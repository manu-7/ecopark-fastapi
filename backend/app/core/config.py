from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    MEDIA_ROOT: str = "media"
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    # Email (Gmail SMTP)
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
