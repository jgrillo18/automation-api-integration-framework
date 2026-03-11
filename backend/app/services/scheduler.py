from apscheduler.schedulers.background import BackgroundScheduler
from app.core.database import SessionLocal
from app.models.workflow import Workflow
from app.models.execution import Execution
from app.services.workflow_engine import WorkflowEngine


def _run_pending():
    db = SessionLocal()
    workflows = db.query(Workflow).all()
    for wf in workflows:
        result = WorkflowEngine.execute(wf)
        exec = Execution(status=result, workflow_id=wf.id)
        db.add(exec)
    db.commit()
    db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    # every five minutes
    scheduler.add_job(_run_pending, 'interval', minutes=5)
    scheduler.start()
    return scheduler
