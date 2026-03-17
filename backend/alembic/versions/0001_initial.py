"""initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2026-03-09 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'organizations',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=True, unique=True),
        sa.Column('plan', sa.String(), nullable=True, server_default='basic'),
    )
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(), nullable=True, unique=True),
        sa.Column('password', sa.String(), nullable=True),
        sa.Column('organization_id', sa.Integer(), sa.ForeignKey('organizations.id'), nullable=True),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_table(
        'workflows',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('organization_id', sa.Integer(), sa.ForeignKey('organizations.id'), nullable=True),
        sa.Column('webhook_url', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('slack_channel', sa.String(), nullable=True),
    )
    op.create_table(
        'executions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('workflow_id', sa.Integer(), sa.ForeignKey('workflows.id'), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
    )


def downgrade():
    op.drop_table('executions')
    op.drop_table('workflows')
    op.drop_table('users')
    op.drop_table('organizations')
