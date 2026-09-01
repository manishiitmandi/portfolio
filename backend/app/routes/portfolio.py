import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import (
    ProfileModel,
    SkillCategoryModel,
    ExperienceModel,
    ProjectModel,
    EducationModel,
    AchievementModel,
)
from app.models.schemas import (
    Profile,
    SkillCategory,
    ExperienceItem,
    ProjectItem,
    EducationItem,
    AchievementItem,
    Stats,
    TerminalCommandRequest,
    TerminalCommandResponse,
)

router = APIRouter(prefix="/api", tags=["portfolio"])

STATIC_RESUME_PATH = Path(__file__).resolve().parent.parent / "static" / "resume.pdf"


@router.get("/profile", response_model=Profile)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "name": profile.name,
        "headline": profile.headline,
        "tagline": profile.tagline,
        "bio": profile.bio,
        "location": profile.location,
        "available_for_hire": profile.available_for_hire,
        "avatar_url": profile.avatar_url or "",
        "socials": profile.socials or {},
        "stats": profile.stats or {},
    }


@router.get("/skills", response_model=List[SkillCategory])
def get_skills(db: Session = Depends(get_db)):
    categories = db.query(SkillCategoryModel).all()
    return [
        {
            "category": c.category,
            "description": c.description or "",
            "skills": c.skills or [],
        }
        for c in categories
    ]


@router.get("/experience", response_model=List[ExperienceItem])
def get_experience(db: Session = Depends(get_db)):
    items = db.query(ExperienceModel).all()
    return [
        {
            "id": e.id,
            "role": e.role,
            "company": e.company,
            "location": e.location or "",
            "period": e.period or "",
            "type": e.type or "Internship",
            "highlights": e.highlights or [],
            "tech_stack": e.tech_stack or [],
            "current": e.current or False,
        }
        for e in items
    ]


@router.get("/projects", response_model=List[ProjectItem])
def get_projects(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(ProjectModel)
    items = query.all()
    
    projects = [
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "description": p.description or "",
            "full_description": p.full_description or "",
            "tags": p.tags or [],
            "metrics": p.metrics or "",
            "github_url": p.github_url or "",
            "demo_url": p.demo_url or "",
            "featured": p.featured if p.featured is not None else True,
            "architecture": p.architecture or [],
            "created_date": p.created_date or "",
        }
        for p in items
    ]

    if category and category.lower() != "all":
        projects = [
            p for p in projects
            if category.lower() in p.get("category", "").lower()
            or any(category.lower() in t.lower() for t in p.get("tags", []))
        ]
    return projects


@router.get("/projects/{project_id}", response_model=ProjectItem)
def get_project_by_id(project_id: str, db: Session = Depends(get_db)):
    p = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "description": p.description or "",
        "full_description": p.full_description or "",
        "tags": p.tags or [],
        "metrics": p.metrics or "",
        "github_url": p.github_url or "",
        "demo_url": p.demo_url or "",
        "featured": p.featured if p.featured is not None else True,
        "architecture": p.architecture or [],
        "created_date": p.created_date or "",
    }


@router.get("/education", response_model=List[EducationItem])
def get_education(db: Session = Depends(get_db)):
    items = db.query(EducationModel).all()
    return [
        {
            "id": ed.id,
            "institution": ed.institution,
            "degree": ed.degree,
            "period": ed.period or "",
            "location": ed.location or "",
            "cgpa_or_grade": ed.cgpa_or_grade or "",
            "coursework": ed.coursework or [],
            "highlights": ed.highlights or [],
        }
        for ed in items
    ]


@router.get("/achievements", response_model=List[AchievementItem])
def get_achievements(db: Session = Depends(get_db)):
    items = db.query(AchievementModel).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "event": a.event or "",
            "rank": a.rank or "",
            "year": a.year or "",
            "description": a.description or "",
            "link": a.link or "",
        }
        for a in items
    ]


@router.get("/stats", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).first()
    if profile and profile.stats:
        return profile.stats
    return Stats()


@router.get("/resume/download")
def download_resume():
    if STATIC_RESUME_PATH.exists():
        return FileResponse(
            path=str(STATIC_RESUME_PATH),
            filename="Manish_Kumar_Resume.pdf",
            media_type="application/pdf",
        )
    raise HTTPException(status_code=404, detail="Resume file not found")


@router.post("/terminal", response_model=TerminalCommandResponse)
def execute_terminal_command(req: TerminalCommandRequest, db: Session = Depends(get_db)):
    cmd = req.command.strip().lower()
    profile = db.query(ProfileModel).first()

    if not cmd:
        return TerminalCommandResponse(output="Type 'help' to see list of available commands.")

    if cmd in ["help", "?"]:
        output = (
            "Available Commands:\n"
            "  whoami          Display profile headline & summary\n"
            "  skills          List top technical skills and proficiency\n"
            "  projects        List featured research & software projects\n"
            "  experience      Show work history and timeline\n"
            "  education       View academic background at IIT Mandi\n"
            "  contact         Display contact details & social channels\n"
            "  cat resume      Display quick resume overview\n"
            "  sudo hire       Direct hiring & collaboration link\n"
            "  stats           Show live metrics\n"
            "  admin           Info on opening Admin Studio\n"
            "  clear           Clear the terminal display"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["whoami", "about"]:
        if profile:
            output = (
                f"User: {profile.name}\n"
                f"Headline: {profile.headline}\n"
                f"Location: {profile.location}\n"
                f"Bio: {profile.bio}"
            )
        else:
            output = "User: Manish Kumar"
        return TerminalCommandResponse(output=output)

    if cmd in ["skills", "ls skills"]:
        categories = db.query(SkillCategoryModel).all()
        lines = ["=== Technical Skills Matrix ==="]
        for cat in categories:
            lines.append(f"\n[{cat.category}]:")
            for s in (cat.skills or []):
                lvl = s.get("level", 80)
                bar = "█" * (lvl // 10) + "░" * (10 - (lvl // 10))
                lines.append(f"  • {s.get('name'):<28} [{bar}] {lvl}%")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["projects", "ls projects"]:
        projects = db.query(ProjectModel).all()
        lines = ["=== Featured Projects & Research ==="]
        for p in projects:
            lines.append(f"\n⚡ {p.title} ({p.category})")
            lines.append(f"   Summary: {p.description}")
            if p.metrics:
                lines.append(f"   Metric:  {p.metrics}")
            lines.append(f"   Tech:    {', '.join(p.tags or [])}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["experience", "history"]:
        exps = db.query(ExperienceModel).all()
        lines = ["=== Work & Leadership Experience ==="]
        for e in exps:
            lines.append(f"\n🏢 {e.role} @ {e.company}")
            lines.append(f"   Period: {e.period} | {e.location}")
            for h in (e.highlights or []):
                lines.append(f"   - {h}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["education"]:
        edus = db.query(EducationModel).all()
        lines = ["=== Academic Timeline ==="]
        for ed in edus:
            lines.append(f"🎓 {ed.degree}")
            lines.append(f"   Institution: {ed.institution} ({ed.period})")
            lines.append(f"   Grade: {ed.cgpa_or_grade}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["contact", "socials"]:
        socials = profile.socials if profile and profile.socials else {}
        output = (
            "=== Contact & Social Channels ===\n"
            f"📧 Email:    {socials.get('email', '')}\n"
            f"📱 Phone:    {socials.get('phone', '')}\n"
            f"🐙 GitHub:   {socials.get('github', '')}\n"
            f"💼 LinkedIn: {socials.get('linkedin', '')}\n"
            f"🧩 LeetCode: {socials.get('leetcode', '')}"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["stats", "metrics"]:
        stats = profile.stats if profile and profile.stats else {}
        output = (
            f"Projects: {stats.get('projects_completed', 8)}\n"
            f"Experience: {stats.get('years_experience', '1+')}\n"
            f"Hackathons: {stats.get('hackathons_won', 2)}\n"
            f"Contributions: {stats.get('contributions', '650+')}"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["cat resume", "resume"]:
        name = profile.name if profile else "Manish Kumar"
        output = (
            f"=== Resume Overview for {name} ===\n"
            "Download PDF directly via the 'Download Resume' button on the navbar or run '/api/resume/download'."
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["sudo hire", "hire"]:
        email = profile.socials.get("email", "") if profile and profile.socials else ""
        output = (
            f"🚀 Ready to collaborate!\n"
            f"Send an inquiry via the Contact section below or email directly to {email}."
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["admin", "login"]:
        output = "Click the 'Admin' button in the navigation bar or press Ctrl+Shift+A to open the Admin Studio."
        return TerminalCommandResponse(output=output)

    return TerminalCommandResponse(
        output=f"Command not recognized: '{req.command}'. Type 'help' for available commands.",
        type="error",
    )
