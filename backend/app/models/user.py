from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    # flag to distinguish normal members from administrators
    is_admin = Column(Boolean, nullable=False, server_default="false")