import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

TICKET_PRICE = 30


def _send_email(to: str, subject: str, html: str):
    if not settings.MAIL_USERNAME:
        print(f"[EMAIL] To: {to} | Subject: {subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = settings.MAIL_FROM or settings.MAIL_USERNAME
    msg["To"]      = to
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_USERNAME, to, msg.as_string())


def send_booking_confirmation(ticket):
    total = ticket.tickets * TICKET_PRICE
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
      <div style="background:#1a3d2b;padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🌿 Eco Park — Booking Confirmed!</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#374151;">Hi <strong>{ticket.name}</strong>, your ticket has been booked successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Ticket ID</td><td style="padding:8px 0;font-weight:600;color:#111827;">#{ticket.id}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Visit Date</td><td style="padding:8px 0;font-weight:600;color:#111827;">{ticket.date}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Tickets</td><td style="padding:8px 0;font-weight:600;color:#111827;">{ticket.tickets}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Amount Paid</td><td style="padding:8px 0;font-weight:600;color:#1a3d2b;">₹{total}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Status</td><td style="padding:8px 0;"><span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600;">CONFIRMED</span></td></tr>
        </table>
        <p style="color:#6b7280;font-size:13px;">Show your QR code at the entrance. Enjoy your visit! 🌳</p>
      </div>
      <div style="background:#f3f4f6;padding:16px 32px;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">Eco Park Kolkata &bull; This is an automated email</p>
      </div>
    </div>
    """
    _send_email(ticket.email, f"✅ Booking Confirmed — Eco Park Ticket #{ticket.id}", html)


def send_password_reset(to_email: str, reset_url: str):
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
      <div style="background:#1a3d2b;padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🌿 Eco Park — Password Reset</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="color:#374151;">We received a request to reset your password. Click the button below:</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="{reset_url}" style="background:#1a3d2b;color:#fff;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Reset Password</a>
        </div>
        <p style="color:#6b7280;font-size:13px;">This link expires in <strong>30 minutes</strong>. If you didn't request this, ignore this email.</p>
      </div>
      <div style="background:#f3f4f6;padding:16px 32px;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">Eco Park Kolkata &bull; This is an automated email</p>
      </div>
    </div>
    """
    _send_email(to_email, "🔑 Reset Your Eco Park Password", html)
