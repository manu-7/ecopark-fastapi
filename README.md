# 🌿 Eco Park — Full Stack Ticket Booking App

A production-ready full-stack web application for booking tickets to Eco Park Kolkata.

**Stack:** FastAPI (Python) + React (Vite) + PostgreSQL + Razorpay + Google OAuth

---

## 🐛 Bugs Fixed

| # | Location | Bug | Fix |
|---|----------|-----|-----|
| 1 | `security.py` | `hash_password` was truncating passwords to 72 bytes with `.encode()[:72]` which broke passlib sha256_crypt | Removed truncation; sha256_crypt handles long passwords natively |
| 2 | `auth_service.py` / `auth.py` | JWT `sub` was inconsistently `username` (Google) vs `str(id)` (regular login) causing 401s | Standardized: always use `str(user.id)` as JWT sub |
| 3 | `schemas/ticket.py` | `PaymentSuccessRequest` class defined **twice** — second definition silently overwrites first, losing fields | Removed duplicate; kept only the complete version |
| 4 | `tickets.py` (API) | `DELETE /api/tickets/{id}` endpoint was missing, but `Payment.jsx` calls it on cancel | Added `cancel_ticket` DELETE endpoint |
| 5 | `ticket_service.py` | Date validation forced tickets only for today — you could never book in advance | Changed to reject only past dates; future dates allowed |
| 6 | `google_auth.py` | Windows-style CRLF line endings (`\r\n`) caused syntax issues on Linux | Fixed line endings |
| 7 | `auth.py` (Google callback) | Google username collision — if two users share a name, second registration fails with unique constraint error | Added counter suffix loop to ensure unique username |
| 8 | `payment_service.py` | No idempotency — re-fetching payment page creates a new Razorpay order every time | Returns existing order_id if ticket already has a PENDING order |
| 9 | `main.py` | CORS only allowed `localhost:5173`, broke on `127.0.0.1:5173` | Added both origins |
| 10 | `api/auth.py` | Google OAuth returned `Token` schema without `username` field but schema required it | Added `username` to `Token` schema and all return values |
| 11 | `frontend/GoogleSuccess.jsx` | Logged JWT token to browser console (security risk) + no error handling if params missing | Removed `console.log`, added redirect-to-login fallback |
| 12 | `frontend/axios.js` | No global 401 handler — expired tokens left users stuck | Added response interceptor to auto-logout on 401 |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup
```sql
CREATE DATABASE ecopark;
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env` and fill in your credentials:
```bash
cp .env .env.local  # Edit .env with your values
```

Run migrations:
```bash
alembic upgrade head
```

Start backend:
```bash
./run.sh
# or: uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env .env.local   # Edit VITE_GOOGLE_CLIENT_ID
npm install
npm run dev
```

Visit: **http://localhost:5173**

API Docs: **http://localhost:8000/docs**

---

## 📁 Project Structure

```
ecopark/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   │   ├── auth.py      (register, login, Google OAuth)
│   │   │   ├── tickets.py   (book, cancel, confirm, download PDF)
│   │   │   └── payment.py   (Razorpay order, verify payment)
│   │   ├── core/         # Config, DB, security
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   └── services/     # Business logic
│   ├── alembic/          # Database migrations
│   ├── media/qrcodes/    # Generated QR code images
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/          # Axios instance
        ├── components/   # Navbar, Footer, Alert
        ├── context/      # AuthContext (JWT state)
        └── pages/        # Home, Login, Register, BookTicket,
                          # Payment, TicketConfirmation, Adventure, Contact
```

---

## 🌐 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| GET  | `/api/auth/google/login` | — | Start Google OAuth |
| GET  | `/api/auth/google/callback` | — | Google OAuth callback |
| POST | `/api/tickets/book_ticket` | ✅ | Book tickets |
| DELETE | `/api/tickets/{id}` | ✅ | Cancel pending booking |
| GET  | `/api/tickets/ticket_confirmation/{id}` | ✅ | Get booking details |
| GET  | `/api/tickets/download_ticket/{id}` | ✅ | Download PDF ticket |
| GET  | `/api/payment/process_payment/{id}` | ✅ | Create Razorpay order |
| POST | `/api/payment/payment_success` | ✅ | Verify & confirm payment |

---

## 🔑 Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/ecopark
JWT_SECRET=your_strong_secret
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

### Frontend `.env`
```
VITE_GOOGLE_CLIENT_ID=....apps.googleusercontent.com
```

---

## 🎨 Features

- 🎫 Online ticket booking with Razorpay payment gateway
- 🔐 JWT authentication + Google OAuth login
- 📄 PDF ticket download with QR code
- 📱 Fully responsive mobile-friendly design
- 🌿 Beautiful nature-themed UI with Playfair Display typography
