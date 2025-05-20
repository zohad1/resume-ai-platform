from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from models import Resume, User
from routers.auth import get_current_user

router = APIRouter(
    prefix="/resumes",
    tags=["Resume Viewer"]
)

@router.get("/view/{resume_id}")
def view_resume_by_id(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": resume.id,
        "email": resume.email,
        "phone": resume.phone,
        "skills": resume.skills,
        "education": resume.education,
        "experience": resume.experience,
        "raw_text": resume.raw_text
    }

@router.patch("/update/{resume_id}")
def update_resume(
    resume_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    for field in ["email", "phone", "skills", "education", "experience"]:
        if field in data:
            setattr(resume, field, data[field])

    db.commit()
    db.refresh(resume)

    return {"message": "Resume updated successfully"}
