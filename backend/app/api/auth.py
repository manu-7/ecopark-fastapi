import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import RegisterRequest, Token
from app.services.auth_service import register_user, login_user
from app.core.google_auth import oauth
from app.core.security import create_access_token, hash_password
from app.models.user import User
from app.services.email_service import send_password_reset

router = APIRouter(prefix="/api/auth", tags=["auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(payload, db)


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user(form.username, form.password, db)


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully."}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return success to avoid email enumeration
    if not user:
        return {"message": "If this email exists, a reset link has been sent."}

    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

    from app.core.config import settings
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    send_password_reset(user.email, reset_url)

    return {"message": "If this email exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()

    if not user or not user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Reset token has expired.")

    user.password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Password reset successfully. You can now log in."}


@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token["userinfo"]
    email = user_info["email"]
    username = user_info.get("name", email.split("@")[0])

    user = db.query(User).filter(User.email == email).first()
    if not user:
        base_username = username
        counter = 0
        while db.query(User).filter(User.username == username).first():
            counter += 1
            username = f"{base_username}{counter}"

        user = User(username=username, email=email, password="GOOGLE_AUTH")
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": str(user.id)})
    return RedirectResponse(
        url=f"http://localhost:5173/google-success?token={access_token}&username={user.username}&is_admin={str(user.is_admin).lower()}"
    )
