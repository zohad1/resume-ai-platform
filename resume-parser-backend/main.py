from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Routers
from routers import resume
from routers.auth import router as auth_router
from routers.forgot_password import router as forgot_router
from routers.view_resume import router as view_router
from routers.dashboard import router as dashboard_router
from routers.analytics import router as analytics_router  # ✅ New
from routers import settings
from routers import user_profile


# DB setup
from database import engine
import models

# Initialize DB tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# ------------------------
# ✅ CORS Middleware Setup
# ------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# ✅ Routers Registration
# ------------------------
app.include_router(resume.router, prefix="/resumes", tags=["Resume"])
app.include_router(auth_router, tags=["Auth"])  # No `/auth` prefix
app.include_router(forgot_router, prefix="/auth", tags=["ForgotPassword"])
app.include_router(view_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)  # ✅ New route
app.include_router(settings.router)
app.include_router(user_profile.router)

# ------------------------
# ✅ Root Endpoint
# ------------------------
@app.get("/")
def root():
    return {"message": "Resume Parser API Running"}


# mounts

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")