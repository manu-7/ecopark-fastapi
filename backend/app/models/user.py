from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id                  = Column(Integer, primary_key=True, index=True)
    username            = Column(String(150), unique=True, nullable=False, index=True)
    email               = Column(String(255), unique=True, nullable=False)
    password            = Column(String(255), nullable=False)
    is_admin            = Column(Boolean, default=False, nullable=False)
    reset_token         = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"
