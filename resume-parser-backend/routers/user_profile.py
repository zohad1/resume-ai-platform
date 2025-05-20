from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, User
from routers.auth import get_current_user
from pydantic import BaseModel
import os

router = APIRouter()

# -------------------------------
# Pydantic Model for Profile Update
# -------------------------------
class ProfileUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    github: str | None = None
    linkedin: str | None = None
    website: str | None = None
    bio: str | None = None
    image_url: str | None = None


# -------------------------------
# GET Full Profile (/profile/me)
# -------------------------------
@router.get("/profile/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    # Auto-create profile if not exists
    if not profile:
        profile = UserProfile(
            user_id=current_user.id,
            full_name=current_user.name,
            phone="",
            github="",
            linkedin="",
            website="",
            bio="",
            image_url=""
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "name": current_user.name,
        "email": current_user.email,
        "phone": profile.phone,
        "linkedin": profile.linkedin,
        "github": profile.github,
        "website": profile.website,
        "bio": profile.bio,
        "image_url": profile.image_url,
    }


# -------------------------------
# PUT Update Profile
# -------------------------------
@router.put("/profile/update")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}


# -------------------------------
# POST Upload Profile Picture
# -------------------------------
@router.post("/profile/upload-photo")
def upload_profile_image(
    image: UploadFile = File(...),  # ✅ matches frontend key
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    uploads_dir = "uploads/profile_pictures"
    os.makedirs(uploads_dir, exist_ok=True)

    filename = f"user_{current_user.id}_{image.filename}"
    file_path = os.path.join(uploads_dir, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(image.file.read())

    image_url = f"http://127.0.0.1:8000/{file_path.replace(os.sep, '/')}"

    # ✅ Save to database
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.image_url = image_url
    db.commit()

    return {"image_url": image_url}
