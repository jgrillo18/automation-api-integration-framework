from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# use pbkdf2_sha256 to avoid bcrypt version/depth limitations
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str):
    # truncate to safe length (pbkdf2_sha256 does not have such a low limit)
    if isinstance(password, str):
        password = password[:256]
    return pwd_context.hash(password)

def verify_password(password, hashed):
    if isinstance(password, str):
        password = password[:72]
    return pwd_context.verify(password, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")