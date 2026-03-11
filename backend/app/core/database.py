import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from app.core.config import settings

# try to establish connection with retries (db container may not be ready)
def _create_engine_with_retry(url, retries=10, delay=1):
    for attempt in range(retries):
        try:
            eng = create_engine(url)
            # test connection
            conn = eng.connect()
            conn.close()
            return eng
        except OperationalError:
            if attempt < retries - 1:
                time.sleep(delay)
                continue
            else:
                raise

engine = _create_engine_with_retry(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()