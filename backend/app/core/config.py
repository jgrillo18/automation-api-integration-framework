from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # possible values: development, staging, production
    ENV: str = "development"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/automation"
    SECRET_KEY: str = "supersecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()