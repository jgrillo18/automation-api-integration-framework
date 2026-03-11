from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    # integration fields
    webhook_url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    slack_channel = Column(String, nullable=True)