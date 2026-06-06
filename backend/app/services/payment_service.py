import razorpay
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.ticket import TicketBooking

TICKET_PRICE = 30


def create_razorpay_order(ticket: TicketBooking, user_full_name: str, user_email: str, db: Session) -> dict:
    # FIX: Check if order already exists to avoid duplicate Razorpay orders
    if ticket.razorpay_order_id and ticket.payment_status == "PENDING":
        return {
            "order_id": ticket.razorpay_order_id,
            "amount": ticket.tickets * TICKET_PRICE * 100,
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "name": user_full_name,
            "email": user_email,
            "ticket_id": ticket.id,
            "payment_status": ticket.payment_status,
        }

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    amount = ticket.tickets * TICKET_PRICE * 100

    try:
        payment_data = {
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1",
            "notes": {
                "ticket_id": str(ticket.id),
                "user_email": user_email,
            },
        }
        order = client.order.create(data=payment_data)

        ticket.razorpay_order_id = order["id"]
        ticket.payment_status = "PENDING"
        db.commit()
        db.refresh(ticket)

        return {
            "order_id": order["id"],
            "amount": amount,
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "name": user_full_name,
            "email": user_email,
            "ticket_id": ticket.id,
            "payment_status": ticket.payment_status,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Payment creation failed: {str(e)}")


def verify_payment_signature(payload) -> bool:
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature,
        })
        return True
    except Exception:
        raise HTTPException(status_code=400, detail="Payment verification failed")
