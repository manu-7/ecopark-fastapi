from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    password2: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    is_admin: bool = False

class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True
