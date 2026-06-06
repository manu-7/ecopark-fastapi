from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.ticket import PaymentOrderOut, PaymentSuccessRequest
from app.services.ticket_service import get_ticket, generate_qr_and_save
from app.services.payment_service import create_razorpay_order, verify_payment_signature
from app.services.email_service import send_booking_confirmation

router = APIRouter(prefix="/api/payment", tags=["payment"])


@router.get("/process_payment/{ticket_id}", response_model=PaymentOrderOut)
def process_payment(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket(ticket_id, db)
    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized ticket access")
    if ticket.payment_status == "SUCCESS":
        raise HTTPException(status_code=400, detail="Ticket already paid.")

    return create_razorpay_order(
        ticket=ticket,
        user_full_name=current_user.username,
        user_email=current_user.email,
        db=db,
    )


@router.post("/payment_success")
def payment_success(
    payload: PaymentSuccessRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket(payload.ticket_id, db)
    if ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    if ticket.payment_status == "SUCCESS":
        raise HTTPException(status_code=400, detail="Payment already completed")
    if ticket.razorpay_order_id != payload.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Order mismatch")

    verify_payment_signature(payload)

    try:
        ticket.payment_status = "SUCCESS"
        ticket.razorpay_payment_id = payload.razorpay_payment_id
        ticket.razorpay_signature = payload.razorpay_signature
        ticket = generate_qr_and_save(ticket, db)
        db.commit()
        db.refresh(ticket)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Payment processing failed")

    # Send confirmation email (non-blocking — ignore failures)
    try:
        send_booking_confirmation(ticket)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")

    return {
        "ticket_id": ticket.id,
        "payment_status": ticket.payment_status,
        "message": "Payment verified successfully",
    }
