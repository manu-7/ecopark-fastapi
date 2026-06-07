from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
import os

from app.core.database import engine, Base
from app.models.user import User          # noqa: register table
from app.models.ticket import TicketBooking  # noqa: register table
from app.api import auth, tickets, payment, admin
from app.core.config import settings

os.makedirs("media/qrcodes", exist_ok=True)

app = FastAPI(
    title="Eco Park Ticket Booking API",
    version="1.0.0",
    description="Backend API for Eco Park online ticket booking system.",
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.JWT_SECRET,
    same_site="lax",
    https_only=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://ecopark-fastapi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(payment.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Eco Park Ticket Booking API is running."}


@app.get("/health")
def health():
    return {"status": "ok"}
