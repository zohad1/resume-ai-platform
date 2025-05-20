from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Resume, User
from routers.auth import get_current_user
from io import BytesIO
import fitz  # PyMuPDF
import re
from docx import Document
import spacy
from datetime import datetime, timezone

router = APIRouter()
nlp = spacy.load("en_core_web_sm")

# -------------------------------
# Helper Functions
# -------------------------------

def extract_email(text: str) -> str | None:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else None

def extract_phone(text: str) -> str | None:
    match = re.search(r"\+?\d[\d\s\-]{8,}\d", text)
    return match.group(0) if match else None

def classify_sections(text: str) -> dict:
    lines = text.splitlines()
    sections = {"skills": [], "education": [], "experience": []}
    current_section = None

    for line in lines:
        clean = line.strip()
        if re.match(r"^(skills?|technical skills?)[:\s]*$", clean, re.IGNORECASE):
            current_section = "skills"
            continue
        elif re.match(r"^(education|academic background)[:\s]*$", clean, re.IGNORECASE):
            current_section = "education"
            continue
        elif re.match(r"^(experience|work experience|employment history)[:\s]*$", clean, re.IGNORECASE):
            current_section = "experience"
            continue
        if current_section and clean:
            sections[current_section].append(clean)

    return {k: "\n".join(v).strip() for k, v in sections.items()}

def extract_text_from_pdf(file: UploadFile) -> str:
    with fitz.open(stream=file.file.read(), filetype="pdf") as doc:
        return "\n".join([page.get_text() for page in doc])

def extract_text_from_docx(file: UploadFile) -> str:
    doc = Document(BytesIO(file.file.read()))
    return "\n".join([p.text for p in doc.paragraphs])

# -------------------------------
# Resume Upload Endpoint
# -------------------------------

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        file.file.seek(0)
        text = (
            extract_text_from_pdf(file)
            if file.filename.endswith(".pdf")
            else extract_text_from_docx(file)
            if file.filename.endswith(".docx")
            else None
        )
        if not text:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        sections = classify_sections(text)

        resume = Resume(
            email=extract_email(text),
            phone=extract_phone(text),
            skills=sections.get("skills"),
            education=sections.get("education"),
            experience=sections.get("experience"),
            raw_text=text,
            user_id=current_user.id
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return {"data": {"id": resume.id}}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------
# View Resume Endpoint
# -------------------------------

@router.get("/view/{resume_id}")
def view_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": resume.id,
        "email": resume.email,
        "phone": resume.phone,
        "skills": resume.skills,
        "education": resume.education,
        "experience": resume.experience,
        "raw_text": resume.raw_text,
        "created_at": resume.created_at
    }