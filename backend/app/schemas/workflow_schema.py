# Workflow schema

from pydantic import BaseModel, constr

# allow letters, numbers, spaces, hyphens and underscores
NameType = constr(min_length=1, max_length=100, pattern=r"^[\w\s\-]+$")

class WorkflowBase(BaseModel):
    name: NameType
    type: NameType
    webhook_url: str | None = None
    email: str | None = None
    slack_channel: str | None = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowOut(WorkflowBase):
    id: int
    organization_id: int

class WorkflowUpdate(BaseModel):
    name: NameType | None = None
    type: NameType | None = None
    webhook_url: str | None = None
    email: str | None = None
    slack_channel: str | None = None

