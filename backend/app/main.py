from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, workflows, dashboard, admin_routes
from app.core.database import Base, engine
from app.core.config import settings
from app.services.scheduler import start_scheduler

# create tables automatically only in development mode
if settings.ENV == "development":
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Automation SaaS")

# prometheus metrics
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)

# CORS - allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth, prefix="/auth")
app.include_router(workflows, prefix="/workflows")
app.include_router(dashboard, prefix="/dashboard")
app.include_router(admin_routes.router, prefix="/admin")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.head("/health")
def health_head():
    return {}

# custom validation error handler (spanish messages for email)
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # intercept email validation errors to return Spanish text
    errors = exc.errors()
    for err in errors:
        if err.get("loc") and err["loc"][-1] == "email":
            return JSONResponse(
                status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                content={"detail": "Ingrese una dirección de correo válida."},
            )
    # fallback to default error response
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )

# scheduler startup and data seeding
@app.on_event("startup")
def startup_event():
    start_scheduler()
    # seed example data if empty
    from app.core.database import SessionLocal
    from app.models.workflow import Workflow
    from app.models.execution import Execution
    from app.models.organization import Organization

    db = SessionLocal()
    try:
        count = db.query(Workflow).count()
        if count == 0:
            # ensure at least one organization
            org = db.query(Organization).first()
            if not org:
                org = Organization(name="Default")
                db.add(org)
                db.commit()
                db.refresh(org)
            w1 = Workflow(name="Sample sync", type="demo", organization_id=org.id)
            w2 = Workflow(name="Another job", type="demo", organization_id=org.id)
            db.add_all([w1, w2])
            db.commit()
            db.refresh(w1)
            # add executions
            e1 = Execution(status="success", workflow_id=w1.id)
            e2 = Execution(status="failed", workflow_id=w1.id)
            db.add_all([e1, e2])
            db.commit()
    finally:
        db.close()