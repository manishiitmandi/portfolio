import os
import time
from datetime import datetime, timedelta
from typing import Optional, Dict
import bcrypt
import jwt
from fastapi import HTTPException, Security, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "prod-super-secure-portfolio-jwt-secret-key-484-mk")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 8))

# Bearer security scheme
security = HTTPBearer()

# In-memory brute-force protection (IP -> list of timestamp failures)
failed_attempts: Dict[str, list] = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_SECONDS = 300  # 5 minutes


def hash_password(password: str) -> str:
    """Hash a plaintext password with direct native bcrypt."""
    # Bcrypt operates on bytes and supports up to 72 bytes
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against bcrypt hash without passlib bugs."""
    if not plain_password or not hashed_password:
        return False

    # Check if stored as bcrypt hash ($2b$ or $2a$)
    if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
        try:
            pwd_bytes = plain_password.encode("utf-8")[:72]
            hash_bytes = hashed_password.encode("utf-8")
            return bcrypt.checkpw(pwd_bytes, hash_bytes)
        except Exception:
            return False

    # Plaintext fallback for initial config, then upgrade to bcrypt
    return plain_password.strip() == hashed_password.strip()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed cryptographic JWT with expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "sub": "portfolio_admin",
    })
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Validate Bearer token signature and expiration."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("sub") != "portfolio_admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token subject",
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please login again.",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


def check_rate_limit(request: Request):
    """Prevent brute-force password guessing attacks."""
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Filter attempts within lockout window
    attempts = [t for t in failed_attempts.get(client_ip, []) if now - t < LOCKOUT_SECONDS]
    failed_attempts[client_ip] = attempts
    
    if len(attempts) >= MAX_FAILED_ATTEMPTS:
        remaining_lockout = int(LOCKOUT_SECONDS - (now - attempts[0]))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Temporarily locked for {remaining_lockout} seconds.",
        )


def register_failed_attempt(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if client_ip not in failed_attempts:
        failed_attempts[client_ip] = []
    failed_attempts[client_ip].append(time.time())


def clear_failed_attempts(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if client_ip in failed_attempts:
        del failed_attempts[client_ip]
