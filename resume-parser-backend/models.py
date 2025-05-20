from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    resumes = relationship("Resume", back_populates="user")
    matches = relationship("ResumeMatch", back_populates="user")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    skills = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="resumes")

    matches = relationship("ResumeMatch", back_populates="resume")


class ResumeMatch(Base):
    __tablename__ = "resume_matches"

    id = Column(Integer, primary_key=True, index=True)
    job_description = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
    top_skills = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    resume_id = Column(Integer, ForeignKey("resumes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    resume = relationship("Resume", back_populates="matches")
    user = relationship("User", back_populates="matches")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    website = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)     # (Optional: legacy support)
    image_url = Column(String, nullable=True)     # ✅ Required for profile/me route

    user = relationship("User", backref="profile", uselist=False)
