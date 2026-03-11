from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.workflow import Workflow
from app.models.execution import Execution

router = APIRouter()

@router.get("/")
def get_dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    workflows_count = db.query(Workflow).filter(Workflow.organization_id == user.organization_id).count()
    executions_count = db.query(Execution).join(Workflow).filter(Workflow.organization_id == user.organization_id).count()
    return {"workflows": workflows_count, "executions": executions_count}
