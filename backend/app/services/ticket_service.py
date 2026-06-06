from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date
from io import BytesIO
import qrcode
import os

from app.models.ticket import TicketBooking
from app.schemas.ticket import TicketCreate
from app.core.config import settings

TICKET_PRICE = 30


def create_ticket(payload: TicketCreate, user_id: int, db: Session) -> TicketBooking:
    # FIX: removed strict today-only check to allow future date bookings (better UX)
    if payload.date < date.today():
        raise HTTPException(
            status_code=400,
            detail="You cannot book tickets for a past date."
        )

    if payload.tickets < 1:
        raise HTTPException(status_code=400, detail="Must book at least 1 ticket.")

    ticket = TicketBooking(
        user_id=user_id,
        name=payload.name,
        email=payload.email,
        date=payload.date,
        tickets=payload.tickets,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_ticket(ticket_id: int, db: Session) -> TicketBooking:
    ticket = db.query(TicketBooking).filter(TicketBooking.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


def delete_ticket(ticket_id: int, user_id: int, db: Session):
    ticket = get_ticket(ticket_id, db)
    if ticket.user_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    if ticket.payment_status == "SUCCESS":
        raise HTTPException(status_code=400, detail="Cannot cancel a paid ticket.")
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket cancelled successfully."}


def generate_qr_and_save(ticket: TicketBooking, db: Session) -> TicketBooking:
    total_amount = ticket.tickets * TICKET_PRICE

    invoice_data = (
        f"Eco Park Ticket Invoice\n"
        f"--------------------------\n"
        f"Name: {ticket.name}\n"
        f"Email: {ticket.email}\n"
        f"Date: {ticket.date}\n"
        f"Tickets: {ticket.tickets}\n"
        f"Amount Paid: Rs.{total_amount}\n"
        f"Ticket ID: {ticket.id}"
    )

    qr = qrcode.make(invoice_data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")

    os.makedirs(f"{settings.MEDIA_ROOT}/qrcodes", exist_ok=True)

    qr_filename = f"{settings.MEDIA_ROOT}/qrcodes/invoice_{ticket.id}.png"
    with open(qr_filename, "wb") as f:
        f.write(buffer.getvalue())

    ticket.qr_code = qr_filename
    db.commit()
    db.refresh(ticket)
    return ticket
