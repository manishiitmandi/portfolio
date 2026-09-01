import json
import os
import shutil
import uuid
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Form, Depends
from app.models.schemas import (
    Profile,
    SkillCategory,
    ExperienceItem,
    ProjectItem,
    EducationItem,
    AchievementItem,
    AdminLoginRequest,
    AdminLoginResponse,
    ContactMessage,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "portfolio_data.json"
MESSAGES_PATH = Path(__file__).resolve().parent.parent / "data" / "messages.json"
CONFIG_PATH = Path(__file__).resolve().parent.parent / "data" / "admin_config.json"
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
STATIC_RESUME_PATH = STATIC_DIR / "resume.pdf"

ACTIVE_TOKEN = "portfolio-admin-auth-token-key-2026"


def get_admin_pin() -> str:
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                return cfg.get("admin_pin", "admin123")
        except Exception:
            pass
    return os.getenv("ADMIN_PIN", "admin123")


def set_admin_pin(new_pin: str):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump({"admin_pin": new_pin}, f, indent=2)


def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "").strip()
    if token != ACTIVE_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid or expired admin token")
    return True


def get_data() -> dict:
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Data file not found")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data: dict):
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# --- Authentication ---
@router.post("/login", response_model=AdminLoginResponse)
def admin_login(req: AdminLoginRequest):
    current_pin = get_admin_pin()
    if req.pin.strip() == current_pin:
        return AdminLoginResponse(
            success=True,
            token=ACTIVE_TOKEN,
            message="Admin authentication successful",
        )
    raise HTTPException(status_code=401, detail="Invalid admin password / PIN")


@router.put("/change-password")
def change_admin_password(req: dict, authorized: bool = Depends(verify_admin_token)):
    current_pin = req.get("current_pin", "").strip()
    new_pin = req.get("new_pin", "").strip()
    
    if not new_pin or len(new_pin) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters long")
    
    actual_pin = get_admin_pin()
    if current_pin != actual_pin:
        raise HTTPException(status_code=401, detail="Current password does not match")
    
    set_admin_pin(new_pin)
    return {"success": True, "message": "Admin password updated successfully"}


@router.get("/verify")
def verify_token(authorized: bool = Depends(verify_admin_token)):
    return {"valid": True, "message": "Admin session active"}


# --- Profile Management ---
@router.put("/profile")
def update_profile(profile: Profile, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    data["profile"] = profile.dict()
    save_data(data)
    return {"success": True, "message": "Profile updated successfully", "profile": profile}


# --- Projects CRUD ---
@router.post("/projects")
def create_project(project: ProjectItem, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    projects = data.get("projects", [])
    if not project.id:
        project.id = f"proj-{str(uuid.uuid4())[:8]}"
    projects.insert(0, project.dict())
    data["projects"] = projects
    save_data(data)
    return {"success": True, "message": "Project created successfully", "project": project}


@router.put("/projects/{project_id}")
def update_project(project_id: str, updated_project: ProjectItem, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    projects = data.get("projects", [])
    found = False
    for i, p in enumerate(projects):
        if p.get("id") == project_id:
            updated_dict = updated_project.dict()
            updated_dict["id"] = project_id
            projects[i] = updated_dict
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail="Project not found")
    data["projects"] = projects
    save_data(data)
    return {"success": True, "message": "Project updated successfully"}


@router.delete("/projects/{project_id}")
def delete_project(project_id: str, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    projects = data.get("projects", [])
    filtered = [p for p in projects if p.get("id") != project_id]
    if len(filtered) == len(projects):
        raise HTTPException(status_code=404, detail="Project not found")
    data["projects"] = filtered
    save_data(data)
    return {"success": True, "message": "Project deleted successfully"}


# --- Skills Management ---
@router.put("/skills")
def update_skills(skills: List[SkillCategory], authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    data["skills"] = [s.dict() for s in skills]
    save_data(data)
    return {"success": True, "message": "Skills updated successfully", "skills": skills}


# --- Experience Management ---
@router.put("/experience")
def update_experience(experience: List[ExperienceItem], authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    data["experience"] = [e.dict() for e in experience]
    save_data(data)
    return {"success": True, "message": "Experience updated successfully"}


@router.post("/experience")
def add_experience(item: ExperienceItem, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    exps = data.get("experience", [])
    if not item.id:
        item.id = f"exp-{str(uuid.uuid4())[:8]}"
    exps.insert(0, item.dict())
    data["experience"] = exps
    save_data(data)
    return {"success": True, "message": "Experience added", "experience": item}


@router.delete("/experience/{exp_id}")
def delete_experience(exp_id: str, authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    exps = data.get("experience", [])
    filtered = [e for e in exps if e.get("id") != exp_id]
    data["experience"] = filtered
    save_data(data)
    return {"success": True, "message": "Experience deleted"}


# --- Education Management ---
@router.put("/education")
def update_education(education: List[EducationItem], authorized: bool = Depends(verify_admin_token)):
    data = get_data()
    data["education"] = [e.dict() for e in education]
    save_data(data)
    return {"success": True, "message": "Education updated successfully"}


# --- Contact Messages Management ---
@router.get("/messages")
def get_contact_messages(authorized: bool = Depends(verify_admin_token)):
    if not MESSAGES_PATH.exists():
        return []
    try:
        with open(MESSAGES_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


@router.put("/messages/{msg_id}/read")
def mark_message_as_read(msg_id: str, authorized: bool = Depends(verify_admin_token)):
    if not MESSAGES_PATH.exists():
        raise HTTPException(status_code=404, detail="Messages not found")
    with open(MESSAGES_PATH, "r", encoding="utf-8") as f:
        messages = json.load(f)
    for m in messages:
        if m.get("id") == msg_id:
            m["is_read"] = True
            break
    with open(MESSAGES_PATH, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2)
    return {"success": True, "message": "Message marked as read"}


@router.delete("/messages/{msg_id}")
def delete_message(msg_id: str, authorized: bool = Depends(verify_admin_token)):
    if not MESSAGES_PATH.exists():
        raise HTTPException(status_code=404, detail="Messages not found")
    with open(MESSAGES_PATH, "r", encoding="utf-8") as f:
        messages = json.load(f)
    filtered = [m for m in messages if m.get("id") != msg_id]
    with open(MESSAGES_PATH, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2)
    return {"success": True, "message": "Message deleted successfully"}


# --- Resume Upload ---
@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), authorized: bool = Depends(verify_admin_token)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    with open(STATIC_RESUME_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"success": True, "message": "Resume PDF updated successfully"}
