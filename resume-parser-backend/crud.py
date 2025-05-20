from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, schemas
from models import Resume

# 🔐 Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# -------------------------------
# ✅ Fetch user by email
# -------------------------------
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# -------------------------------
# ✅ Password hashing / verification
# -------------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# -------------------------------
# ✅ Create a new user (hashed password)
# -------------------------------
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# -------------------------------
# ✅ Authenticate existing user
# -------------------------------
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# -------------------------------
# ✅ Save parsed resume (for parser)
# -------------------------------
def save_parsed_resume(db: Session, data: dict):
    resume = Resume(**data)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
