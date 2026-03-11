# build stage (install dependencies)
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# runtime image
FROM python:3.11-slim
WORKDIR /app
# bring over installed libraries and scripts
COPY --from=builder /usr/local /usr/local
COPY ./app ./app
# migrate folder and config for Alembic
COPY alembic.ini ./
COPY alembic ./alembic
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]