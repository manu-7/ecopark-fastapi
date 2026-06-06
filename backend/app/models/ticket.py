from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class TicketBooking(Base):
    __tablename__ = "ticket_bookings"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name               = Column(String(100), nullable=False)
    email              = Column(String(255), nullable=False, index=True)
    date               = Column(Date, nullable=False)
    tickets            = Column(Integer, nullable=False)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
    qr_code            = Column(String(500), nullable=True)
    payment_status     = Column(String(20), nullable=False, server_default="PENDING")
    razorpay_order_id  = Column(String(255), unique=True, nullable=True)
    razorpay_payment_id= Column(String(255), unique=True, nullable=True)
    razorpay_signature = Column(String(500), nullable=True)

    def __repr__(self):
        return f"<TicketBooking {self.name} - {self.tickets} Tickets>"
