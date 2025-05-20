from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Resume  # Make sure Resume model exists and is related to User
from routers.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.delete("/delete-account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Delete user’s resumes if they exist
    db.query(Resume).filter(Resume.user_id == current_user.id).delete()

    # Delete the user
    db.delete(current_user)
    db.commit()

    return {"message": "Account and associated data deleted successfully"}
