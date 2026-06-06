from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.core.security import get_admin_user
from app.models.user import User
from app.models.ticket import TicketBooking

router = APIRouter(prefix="/api/admin", tags=["admin"])

TICKET_PRICE = 30


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    total_users    = db.query(func.count(User.id)).scalar()
    total_bookings = db.query(func.count(TicketBooking.id)).scalar()
    paid_bookings  = db.query(func.count(TicketBooking.id)).filter(TicketBooking.payment_status == "SUCCESS").scalar()
    total_tickets  = db.query(func.sum(TicketBooking.tickets)).filter(TicketBooking.payment_status == "SUCCESS").scalar() or 0
    total_revenue  = int(total_tickets) * TICKET_PRICE

    # Bookings by status
    status_counts = (
        db.query(TicketBooking.payment_status, func.count(TicketBooking.id))
        .group_by(TicketBooking.payment_status)
        .all()
    )

    return {
        "total_users": total_users,
        "total_bookings": total_bookings,
        "paid_bookings": paid_bookings,
        "total_tickets_sold": int(total_tickets),
        "total_revenue": total_revenue,
        "bookings_by_status": {s: c for s, c in status_counts},
    }


# ── Bookings ──────────────────────────────────────────────────────────────────

@router.get("/bookings")
def list_bookings(
    skip: int = 0,
    limit: int = 50,
    status: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    q = db.query(TicketBooking)
    if status:
        q = q.filter(TicketBooking.payment_status == status.upper())
    bookings = q.order_by(TicketBooking.created_at.desc()).offset(skip).limit(limit).all()
    total = q.count()

    return {
        "total": total,
        "bookings": [
            {
                "id": b.id,
                "user_id": b.user_id,
                "name": b.name,
                "email": b.email,
                "date": str(b.date),
                "tickets": b.tickets,
                "amount": b.tickets * TICKET_PRICE,
                "payment_status": b.payment_status,
                "created_at": b.created_at.isoformat() if b.created_at else None,
                "razorpay_payment_id": b.razorpay_payment_id,
            }
            for b in bookings
        ],
    }


@router.delete("/bookings/{booking_id}")
def admin_delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    booking = db.query(TicketBooking).filter(TicketBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": f"Booking #{booking_id} deleted"}


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users")
def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(func.count(User.id)).scalar()

    user_list = []
    for u in users:
        booking_count = db.query(func.count(TicketBooking.id)).filter(TicketBooking.user_id == u.id).scalar()
        user_list.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_admin": u.is_admin,
            "booking_count": booking_count,
        })

    return {"total": total, "users": user_list}


@router.patch("/users/{user_id}/toggle-admin")
def toggle_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own admin status")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_admin = not user.is_admin
    db.commit()
    return {"id": user.id, "username": user.username, "is_admin": user.is_admin}


@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # cascade delete bookings
    db.query(TicketBooking).filter(TicketBooking.user_id == user_id).delete()
    db.delete(user)
    db.commit()
    return {"message": f"User #{user_id} deleted"}
