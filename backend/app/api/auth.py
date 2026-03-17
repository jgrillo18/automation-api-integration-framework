from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from .deps import get_current_user
from app.models.organization import Organization
from app.schemas.auth_schema import RegisterSchema, LoginSchema, Token
from app.schemas.user_schema import UserOut

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=Token)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    # validate password length
    pwd_len = len(data.password)
    print(f"[DEBUG] registering password length={pwd_len}")
    if pwd_len > 72:
        raise HTTPException(status_code=400, detail="Password too long")
    # ensure organization exists or create
    org = db.query(Organization).filter(Organization.name == data.organization).first()
    if not org:
        org = Organization(name=data.organization)
        db.add(org)
        db.commit()
        db.refresh(org)
        # seed sample workflows/executions for new org
        from app.models.workflow import Workflow
        from app.models.execution import Execution
        w1 = Workflow(name="Getting started", type="example", organization_id=org.id)
        w2 = Workflow(name="Daily sync", type="example", organization_id=org.id)
        db.add_all([w1, w2])
        db.commit()
        db.refresh(w1)
        db.add_all([
            Execution(status="success", workflow_id=w1.id),
            Execution(status="failed", workflow_id=w1.id)
        ])
        db.commit()
    # check if user already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        password=hash_password(data.password),
        organization_id=org.id,
        is_admin=data.is_admin,
    )
    db.add(user)
    db.commit()
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def read_me(user: User = Depends(get_current_user)):
    return user

@router.post("/login", response_model=Token)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}