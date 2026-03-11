"""add admin and integration columns

Revision ID: 0002_add_columns
Revises: 0001_initial
Create Date: 2026-03-10 11:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_add_columns'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade():
    # users
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.false()))
    # workflows
    op.add_column('workflows', sa.Column('webhook_url', sa.String(), nullable=True))
    op.add_column('workflows', sa.Column('email', sa.String(), nullable=True))
    op.add_column('workflows', sa.Column('slack_channel', sa.String(), nullable=True))
    # executions
    op.add_column('executions', sa.Column('details', sa.JSON(), nullable=True))


def downgrade():
    op.drop_column('executions', 'details')
    op.drop_column('workflows', 'slack_channel')
    op.drop_column('workflows', 'email')
    op.drop_column('workflows', 'webhook_url')
    op.drop_column('users', 'is_admin')