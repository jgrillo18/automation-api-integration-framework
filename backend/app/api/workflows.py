from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.workflow import Workflow
from app.models.execution import Execution
from app.schemas.user_schema import ExecutionOut
from app.services.workflow_engine import WorkflowEngine
from app.schemas.workflow_schema import WorkflowCreate, WorkflowOut, WorkflowUpdate

router = APIRouter()

@router.post("/", response_model=WorkflowOut)
def create_workflow(workflow: WorkflowCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wf = Workflow(
        name=workflow.name,
        type=workflow.type,
        organization_id=user.organization_id,
        webhook_url=workflow.webhook_url,
        email=workflow.email,
        slack_channel=workflow.slack_channel,
    )
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf

@router.get("/", response_model=list[WorkflowOut])
def list_workflows(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Workflow).filter(Workflow.organization_id == user.organization_id).all()

@router.post("/{workflow_id}/run", response_model=ExecutionOut)
def run_workflow(workflow_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.organization_id == user.organization_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Not found")
    result = WorkflowEngine.execute(wf)
    exec = Execution(status=result, workflow_id=wf.id)
    db.add(exec)
    db.commit()
    db.refresh(exec)
    return exec

@router.get("/{workflow_id}/executions", response_model=list[ExecutionOut])
def list_executions(workflow_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # return executions belonging to a workflow in the same org
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.organization_id == user.organization_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Not found")
    return db.query(Execution).filter(Execution.workflow_id == workflow_id).all()

@router.patch("/{workflow_id}", response_model=WorkflowOut)
def update_workflow(workflow_id: int, update: WorkflowUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.organization_id == user.organization_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Not found")
    if update.name is not None:
        wf.name = update.name
    if update.type is not None:
        wf.type = update.type
    if update.webhook_url is not None:
        wf.webhook_url = update.webhook_url
    if update.email is not None:
        wf.email = update.email
    if update.slack_channel is not None:
        wf.slack_channel = update.slack_channel
    db.commit()
    db.refresh(wf)
    return wf
