from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.user import User
from app.models.organization import Organization
from app.schemas.auth_schema import RegisterSchema
from app.schemas.user_schema import UserOut, OrganizationOut
from app.core.security import hash_password

router = APIRouter()

@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    # admins see only users in their org
    return db.query(User).filter(User.organization_id == admin.organization_id).all()

@router.post("/users", response_model=UserOut)
def create_user(data: RegisterSchema, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        password=hash_password(data.password),
        organization_id=admin.organization_id,
        is_admin=data.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/organizations", response_model=list[OrganizationOut])
def list_organizations(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return db.query(Organization).all()