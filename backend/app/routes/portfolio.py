import json
import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
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

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "portfolio_data.json"
STATIC_RESUME_PATH = Path(__file__).resolve().parent.parent / "static" / "resume.pdf"


def get_data() -> dict:
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Data store not initialized")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/profile", response_model=Profile)
def get_profile():
    data = get_data()
    return data.get("profile")


@router.get("/skills", response_model=List[SkillCategory])
def get_skills():
    data = get_data()
    return data.get("skills", [])


@router.get("/experience", response_model=List[ExperienceItem])
def get_experience():
    data = get_data()
    return data.get("experience", [])


@router.get("/projects", response_model=List[ProjectItem])
def get_projects(category: Optional[str] = Query(None)):
    data = get_data()
    projects = data.get("projects", [])
    if category and category.lower() != "all":
        projects = [
            p for p in projects
            if category.lower() in p.get("category", "").lower()
            or any(category.lower() in t.lower() for t in p.get("tags", []))
        ]
    return projects


@router.get("/projects/{project_id}", response_model=ProjectItem)
def get_project_by_id(project_id: str):
    data = get_data()
    for p in data.get("projects", []):
        if p.get("id") == project_id:
            return p
    raise HTTPException(status_code=404, detail="Project not found")


@router.get("/education", response_model=List[EducationItem])
def get_education():
    data = get_data()
    return data.get("education", [])


@router.get("/achievements", response_model=List[AchievementItem])
def get_achievements():
    data = get_data()
    return data.get("achievements", [])


@router.get("/stats", response_model=Stats)
def get_stats():
    data = get_data()
    profile = data.get("profile", {})
    return profile.get("stats", {})


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
def execute_terminal_command(req: TerminalCommandRequest):
    cmd = req.command.strip().lower()
    data = get_data()
    profile = data.get("profile", {})

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
        output = (
            f"User: {profile.get('name')}\n"
            f"Headline: {profile.get('headline')}\n"
            f"Location: {profile.get('location')}\n"
            f"Bio: {profile.get('bio')}"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["skills", "ls skills"]:
        categories = data.get("skills", [])
        lines = ["=== Technical Skills Matrix ==="]
        for cat in categories:
            lines.append(f"\n[{cat.get('category')}]:")
            for s in cat.get("skills", []):
                bar = "█" * (s.get("level", 80) // 10) + "░" * (10 - (s.get("level", 80) // 10))
                lines.append(f"  • {s.get('name'):<28} [{bar}] {s.get('level')}%")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["projects", "ls projects"]:
        projects = data.get("projects", [])
        lines = ["=== Featured Projects & Research ==="]
        for p in projects:
            lines.append(f"\n⚡ {p.get('title')} ({p.get('category')})")
            lines.append(f"   Summary: {p.get('description')}")
            if p.get("metrics"):
                lines.append(f"   Metric:  {p.get('metrics')}")
            lines.append(f"   Tech:    {', '.join(p.get('tags', []))}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["experience", "history"]:
        exps = data.get("experience", [])
        lines = ["=== Work & Leadership Experience ==="]
        for e in exps:
            lines.append(f"\n🏢 {e.get('role')} @ {e.get('company')}")
            lines.append(f"   Period: {e.get('period')} | {e.get('location')}")
            for h in e.get("highlights", []):
                lines.append(f"   - {h}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["education"]:
        edus = data.get("education", [])
        lines = ["=== Academic Timeline ==="]
        for ed in edus:
            lines.append(f"🎓 {ed.get('degree')}")
            lines.append(f"   Institution: {ed.get('institution')} ({ed.get('period')})")
            lines.append(f"   Grade: {ed.get('cgpa_or_grade')}")
        return TerminalCommandResponse(output="\n".join(lines))

    if cmd in ["contact", "socials"]:
        socials = profile.get("socials", {})
        output = (
            "=== Contact & Social Channels ===\n"
            f"📧 Email:    {socials.get('email')}\n"
            f"📱 Phone:    {socials.get('phone')}\n"
            f"🐙 GitHub:   {socials.get('github')}\n"
            f"💼 LinkedIn: {socials.get('linkedin')}\n"
            f"🧩 LeetCode: {socials.get('leetcode')}"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["stats", "metrics"]:
        stats = profile.get("stats", {})
        output = (
            f"Projects: {stats.get('projects_completed')}\n"
            f"CGPA: {stats.get('cgpa')}\n"
            f"Experience: {stats.get('years_experience')}\n"
            f"Hackathons: {stats.get('hackathons_won')}\n"
            f"Contributions: {stats.get('contributions')}"
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["cat resume", "resume"]:
        output = (
            f"=== Resume Overview for {profile.get('name')} ===\n"
            "Download PDF directly via the 'Download Resume' button on the navbar or run '/api/resume/download'."
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["sudo hire", "hire"]:
        output = (
            f"🚀 Ready to collaborate!\n"
            f"Send an inquiry via the Contact section below or email directly to {profile.get('socials', {}).get('email')}."
        )
        return TerminalCommandResponse(output=output)

    if cmd in ["admin", "login"]:
        output = "Click the 'Admin' button in the navigation bar or press Ctrl+Shift+A to open the Admin Studio."
        return TerminalCommandResponse(output=output)

    return TerminalCommandResponse(
        output=f"Command not recognized: '{req.command}'. Type 'help' for available commands.",
        type="error",
    )
