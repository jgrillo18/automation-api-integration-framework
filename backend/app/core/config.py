from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # possible values: development, staging, production
    ENV: str = "development"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/automation"
    SECRET_KEY: str = "supersecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    def __init__(self, **values):
        super().__init__(**values)
        # Render/Neon provides postgres:// but SQLAlchemy 2.x requires postgresql://
        if self.DATABASE_URL.startswith("postgres://"):
            object.__setattr__(self, "DATABASE_URL", self.DATABASE_URL.replace("postgres://", "postgresql://", 1))

    class Config:
        env_file = ".env"

settings = Settings()