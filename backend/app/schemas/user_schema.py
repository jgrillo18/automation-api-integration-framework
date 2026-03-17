# User schema definitions

from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserSchema(BaseModel):
    id: int
    email: EmailStr
    organization_id: int

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    organization: str  # organization name

class UserOut(BaseModel):
    id: int
    email: EmailStr
    organization_id: int
    is_admin: bool

    class Config:
        from_attributes = True

class ExecutionOut(BaseModel):
    id: int
    status: str
    timestamp: datetime
    workflow_id: int
    details: dict | None = None

    class Config:
        from_attributes = True

class OrganizationOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

