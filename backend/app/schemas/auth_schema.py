# Authentication schemas

from pydantic import BaseModel, EmailStr

from pydantic import constr

class RegisterSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=72)
    organization: constr(min_length=1, max_length=100, pattern=r"^[\w\s\-]+$")
    is_admin: bool = False  # whether the new user should be an administrator

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
