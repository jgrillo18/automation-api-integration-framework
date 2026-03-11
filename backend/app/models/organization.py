from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    plan = Column(String, default="basic")