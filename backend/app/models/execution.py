from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from datetime import datetime
from app.core.database import Base

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True)
    status = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    # detailed JSON payload stored for history/inspection
    details = Column(JSON, nullable=True)