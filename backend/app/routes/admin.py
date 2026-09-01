import os
import shutil
import uuid
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_jwt_token,
    check_rate_limit,
    register_failed_attempt,
    clear_failed_attempts,
)
from app.models.db_models import (
    ProfileModel,
    SkillCategoryModel,
    ExperienceModel,
    ProjectModel,
    EducationModel,
    ContactMessageModel,
    AdminConfigModel,
)
from app.models.schemas import (
    Profile,
    SkillCategory,
    ExperienceItem,
    ProjectItem,
    EducationItem,
    AdminLoginRequest,
    AdminLoginResponse,
    ChangePasswordRequest,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
STATIC_RESUME_PATH = STATIC_DIR / "resume.pdf"


# --- Authentication with Cryptographic JWT & Bcrypt ---
@router.post("/login", response_model=AdminLoginResponse)
def admin_login(req: AdminLoginRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Check brute force protection
    check_rate_limit(request)

    admin_cfg = db.query(AdminConfigModel).first()
    stored_pin = admin_cfg.admin_pin if admin_cfg else os.getenv("ADMIN_PIN", "admin@484")
    
    # 2. Verify password with bcrypt (supports fallback and auto-upgrade)
    if not verify_password(req.pin.strip(), stored_pin):
        register_failed_attempt(request)
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    # 3. Transparently upgrade to bcrypt if stored as plaintext
    if admin_cfg and not (stored_pin.startswith("$2b$") or stored_pin.startswith("$2a$")):
        admin_cfg.admin_pin = hash_password(req.pin.strip())
        db.commit()

    # 4. Clear any failed attempts for this client
    clear_failed_attempts(request)

    # 5. Issue cryptographic JWT token
    token = create_access_token(data={"user": "admin", "role": "portfolio_owner"})

    return AdminLoginResponse(
        success=True,
        token=token,
        message="Cryptographic JWT session issued successfully",
    )


@router.put("/change-password")
def change_admin_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    current_pin = req.current_pin.strip()
    new_pin = req.new_pin.strip()
    
    if not new_pin or len(new_pin) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters long")
    
    admin_cfg = db.query(AdminConfigModel).first()
    stored_pin = admin_cfg.admin_pin if admin_cfg else os.getenv("ADMIN_PIN", "admin@484")
    
    if not verify_password(current_pin, stored_pin):
        raise HTTPException(status_code=401, detail="Current password does not match")
    
    # Hash new password with salted bcrypt
    hashed_new_pin = hash_password(new_pin)
    
    if not admin_cfg:
        admin_cfg = AdminConfigModel(id=1, admin_pin=hashed_new_pin)
        db.add(admin_cfg)
    else:
        admin_cfg.admin_pin = hashed_new_pin
        
    db.commit()
    return {"success": True, "message": "Admin password securely hashed with bcrypt and saved"}


@router.get("/verify")
def verify_token(admin_auth: dict = Depends(verify_jwt_token)):
    return {"valid": True, "message": "Admin JWT token signature is verified"}


# --- Profile Management ---
@router.put("/profile")
def update_profile(
    profile: Profile,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    p = db.query(ProfileModel).first()
    if not p:
        p = ProfileModel()
        db.add(p)

    p.name = profile.name
    p.headline = profile.headline
    p.tagline = profile.tagline
    p.bio = profile.bio
    p.location = profile.location
    p.available_for_hire = profile.available_for_hire
    p.avatar_url = profile.avatar_url or ""
    p.socials = profile.socials.dict()
    p.stats = profile.stats.dict()

    db.commit()
    return {"success": True, "message": "Profile updated in database", "profile": profile}


# --- Projects CRUD ---
@router.post("/projects")
def create_project(
    project: ProjectItem,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    proj_id = project.id if project.id else f"proj-{str(uuid.uuid4())[:8]}"
    db_proj = ProjectModel(
        id=proj_id,
        title=project.title,
        category=project.category,
        description=project.description,
        full_description=project.full_description or "",
        tags=project.tags,
        metrics=project.metrics or "",
        github_url=project.github_url or "",
        demo_url=project.demo_url or "",
        featured=project.featured,
        architecture=project.architecture or [],
        created_date=project.created_date or "",
    )
    db.add(db_proj)
    db.commit()
    return {"success": True, "message": "Project created in database", "project": project}


@router.put("/projects/{project_id}")
def update_project(
    project_id: str,
    updated_project: ProjectItem,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    p = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    p.title = updated_project.title
    p.category = updated_project.category
    p.description = updated_project.description
    p.full_description = updated_project.full_description or ""
    p.tags = updated_project.tags
    p.metrics = updated_project.metrics or ""
    p.github_url = updated_project.github_url or ""
    p.demo_url = updated_project.demo_url or ""
    p.featured = updated_project.featured
    p.architecture = updated_project.architecture or []
    p.created_date = updated_project.created_date or ""

    db.commit()
    return {"success": True, "message": "Project updated in database"}


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    p = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(p)
    db.commit()
    return {"success": True, "message": "Project deleted from database"}


# --- Skills Management ---
@router.put("/skills")
def update_skills(
    skills: List[SkillCategory],
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    db.query(SkillCategoryModel).delete()
    for cat in skills:
        db_cat = SkillCategoryModel(
            category=cat.category,
            description=cat.description,
            skills=[s.dict() for s in cat.skills],
        )
        db.add(db_cat)
    db.commit()
    return {"success": True, "message": "Skills updated in database", "skills": skills}


# --- Experience Management ---
@router.put("/experience")
def update_experience(
    experience: List[ExperienceItem],
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    db.query(ExperienceModel).delete()
    for e in experience:
        db_e = ExperienceModel(
            id=e.id or f"exp-{str(uuid.uuid4())[:8]}",
            role=e.role,
            company=e.company,
            location=e.location,
            period=e.period,
            type=e.type,
            highlights=e.highlights,
            tech_stack=e.tech_stack,
            current=e.current or False,
        )
        db.add(db_e)
    db.commit()
    return {"success": True, "message": "Experience updated in database"}


# --- Education Management ---
@router.put("/education")
def update_education(
    education: List[EducationItem],
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    db.query(EducationModel).delete()
    for ed in education:
        db_ed = EducationModel(
            id=ed.id or f"edu-{str(uuid.uuid4())[:8]}",
            institution=ed.institution,
            degree=ed.degree,
            period=ed.period,
            location=ed.location,
            cgpa_or_grade=ed.cgpa_or_grade,
            coursework=ed.coursework,
            highlights=ed.highlights or [],
        )
        db.add(db_ed)
    db.commit()
    return {"success": True, "message": "Education updated in database"}


# --- Contact Messages Management ---
@router.get("/messages")
def get_contact_messages(
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    msgs = db.query(ContactMessageModel).order_by(ContactMessageModel.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "subject": m.subject,
            "message": m.message,
            "created_at": m.created_at.isoformat() + "Z" if m.created_at else None,
            "is_read": m.is_read,
        }
        for m in msgs
    ]


@router.put("/messages/{msg_id}/read")
def mark_message_as_read(
    msg_id: str,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    m = db.query(ContactMessageModel).filter(ContactMessageModel.id == msg_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Message not found")
    m.is_read = True
    db.commit()
    return {"success": True, "message": "Message marked as read"}


@router.delete("/messages/{msg_id}")
def delete_message(
    msg_id: str,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_jwt_token),
):
    m = db.query(ContactMessageModel).filter(ContactMessageModel.id == msg_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(m)
    db.commit()
    return {"success": True, "message": "Message deleted from database"}


# --- Resume Upload ---
@router.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    admin_auth: dict = Depends(verify_jwt_token),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    with open(STATIC_RESUME_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"success": True, "message": "Resume PDF updated successfully"}
