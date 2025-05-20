from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Resume
from database import get_db
from routers.auth import get_current_user
from datetime import date
from collections import defaultdict, Counter

router = APIRouter()

@router.get("/dashboard/recent")
def get_dashboard_data(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Fetch all resumes
    all_resumes = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.id.desc()).all()
    total = len(all_resumes)

    # Count resumes parsed today
    parsed_today = sum(1 for r in all_resumes if r.created_at and r.created_at.date() == date.today())

    # Monthly uploads for bar chart
    monthly_counter = defaultdict(int)
    for resume in all_resumes:
        if resume.created_at:
            month_abbr = resume.created_at.strftime("%b")
            monthly_counter[month_abbr] += 1

    resume_stats = [
        {"month": m, "total": monthly_counter.get(m, 0)}
        for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    ]

    # Skill analysis
    all_skills = []
    for resume in all_resumes:
        if resume.skills:
            for line in resume.skills.split("\n"):
                all_skills.extend([s.strip() for s in line.split(",") if s.strip()])

    top_skills = [skill for skill, _ in Counter(all_skills).most_common(5)]

    return {
        "total_resumes": total,
        "parsed_today": parsed_today,
        "top_skills": top_skills,
        "resume_stats": resume_stats,
        "storage_used": {"used_mb": 12, "total_mb": 50},
        "activity": [  # renamed from "recent"
            {
                "id": r.id,
                "email": r.email,
                "phone": r.phone
            } for r in all_resumes
        ]
    }
