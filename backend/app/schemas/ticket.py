from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


class TicketCreate(BaseModel):
    name: str
    email: EmailStr
    date: date
    tickets: int


class TicketOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    date: date
    tickets: int
    created_at: datetime
    qr_code: Optional[str] = None

    class Config:
        from_attributes = True


class PaymentOrderOut(BaseModel):
    order_id: str
    amount: int
    razorpay_key: str
    name: str
    email: str
    ticket_id: int
    payment_status: str


# FIX: removed duplicate class definition - only keep the full one
class PaymentSuccessRequest(BaseModel):
    ticket_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
