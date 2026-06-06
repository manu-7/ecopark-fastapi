from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from reportlab.pdfgen import canvas as rl_canvas
from io import BytesIO
import os

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.ticket import TicketBooking
from app.schemas.ticket import TicketCreate, TicketOut
from app.services.ticket_service import create_ticket, get_ticket, delete_ticket

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

TICKET_PRICE = 30


@router.post("/book_ticket", response_model=TicketOut)
def book_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_ticket(payload, current_user.id, db)


@router.get("/my_bookings")
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = (
        db.query(TicketBooking)
        .filter(TicketBooking.user_id == current_user.id)
        .order_by(TicketBooking.created_at.desc())
        .all()
    )
    return [
        {
            "id": b.id,
            "name": b.name,
            "email": b.email,
            "date": str(b.date),
            "tickets": b.tickets,
            "amount": b.tickets * TICKET_PRICE,
            "payment_status": b.payment_status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "qr_code_url": f"/media/qrcodes/invoice_{b.id}.png" if b.qr_code else None,
        }
        for b in bookings
    ]


@router.delete("/{ticket_id}")
def cancel_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_ticket(ticket_id, current_user.id, db)


@router.get("/ticket_confirmation/{ticket_id}")
def ticket_confirmation(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket(ticket_id, db)
    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    qr_url = None
    if ticket.qr_code:
        qr_url = f"/media/qrcodes/invoice_{ticket.id}.png"

    return {
        "id": ticket.id,
        "name": ticket.name,
        "email": ticket.email,
        "date": str(ticket.date),
        "tickets": ticket.tickets,
        "payment_status": ticket.payment_status,
        "total_amount": ticket.tickets * TICKET_PRICE,
        "qr_code_url": qr_url,
    }


@router.get("/download_ticket/{ticket_id}")
def download_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket(ticket_id, db)
    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    if ticket.payment_status != "SUCCESS":
        raise HTTPException(status_code=400, detail="Payment not completed yet.")

    buffer = BytesIO()
    pdf = rl_canvas.Canvas(buffer)
    pdf.setTitle("Eco Park Ticket")

    pdf.setFillColorRGB(0.1, 0.24, 0.17)
    pdf.rect(0, 750, 600, 92, fill=True, stroke=False)
    pdf.setFillColorRGB(1, 1, 1)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(300, 800, "ECO PARK - TICKET")
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(300, 775, "Nature Awaits — Official Entry Ticket")

    pdf.setFillColorRGB(0.1, 0.24, 0.17)
    pdf.setFont("Helvetica-Bold", 13)
    y = 710
    fields = [
        ("Name", ticket.name),
        ("Email", ticket.email),
        ("Visit Date", str(ticket.date)),
        ("No. of Tickets", str(ticket.tickets)),
        ("Amount Paid", f"Rs.{ticket.tickets * TICKET_PRICE}"),
        ("Ticket ID", f"#{ticket.id}"),
        ("Payment Status", ticket.payment_status),
    ]
    for label, value in fields:
        pdf.setFont("Helvetica-Bold", 11)
        pdf.setFillColorRGB(0.42, 0.42, 0.42)
        pdf.drawString(80, y, f"{label}:")
        pdf.setFont("Helvetica", 11)
        pdf.setFillColorRGB(0.1, 0.24, 0.17)
        pdf.drawString(220, y, value)
        y -= 28

    if ticket.qr_code:
        qr_path = os.path.join(settings.MEDIA_ROOT, f"qrcodes/invoice_{ticket.id}.png")
        if os.path.exists(qr_path):
            pdf.drawInlineImage(qr_path, 220, y - 140, 140, 140)

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="ecopark_ticket_{ticket.id}.pdf"'},
    )
