# routers/forgot_password.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import ForgotPasswordRequest
import smtplib
from email.mime.text import MIMEText
import os

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    try:
        sender_email = os.getenv("SMTP_EMAIL")  # Your Gmail address
        sender_password = os.getenv("SMTP_PASSWORD")  # App password
        receiver_email = request.email

        message = MIMEText("Click here to reset your password: http://localhost:3000/reset-password")
        message["Subject"] = "Password Reset Instructions"
        message["From"] = sender_email
        message["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())

        return {"message": "Reset instructions sent to your email"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
