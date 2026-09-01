import json
import os
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.db_models import (
    ProfileModel,
    SkillCategoryModel,
    ProjectModel,
    ExperienceModel,
    EducationModel,
    AchievementModel,
    AdminConfigModel,
)

DATA_PATH = Path(__file__).resolve().parent / "data" / "portfolio_data.json"
ADMIN_CONFIG_PATH = Path(__file__).resolve().parent / "data" / "admin_config.json"


def seed_database_if_empty(db: Session):
    # Check if profile already exists
    if db.query(ProfileModel).first() is not None:
        return  # Database already seeded

    # Load initial seed data
    data = {}
    if DATA_PATH.exists():
        try:
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {}

    # Seed Admin Config
    default_pin = os.getenv("ADMIN_PIN", "admin@484")
    if ADMIN_CONFIG_PATH.exists():
        try:
            with open(ADMIN_CONFIG_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                default_pin = cfg.get("admin_pin", default_pin)
        except Exception:
            pass

    admin_record = AdminConfigModel(id=1, admin_pin=default_pin)
    db.add(admin_record)

    # Seed Profile
    profile_data = data.get("profile", {})
    if profile_data:
        profile = ProfileModel(
            name=profile_data.get("name", "Manish Kumar"),
            headline=profile_data.get("headline", "Generative AI & Backend Systems Engineer"),
            tagline=profile_data.get("tagline", "Crafting high-throughput FastAPI microservices & deep learning architectures."),
            bio=profile_data.get("bio", ""),
            location=profile_data.get("location", "Himachal Pradesh / Indore, India"),
            available_for_hire=profile_data.get("available_for_hire", True),
            avatar_url=profile_data.get("avatar_url", ""),
            socials=profile_data.get("socials", {}),
            stats=profile_data.get("stats", {}),
        )
        db.add(profile)

    # Seed Skills
    skills_data = data.get("skills", [])
    for cat in skills_data:
        skill_cat = SkillCategoryModel(
            category=cat.get("category"),
            description=cat.get("description", ""),
            skills=cat.get("skills", []),
        )
        db.add(skill_cat)

    # Seed Projects
    projects_data = data.get("projects", [])
    for p in projects_data:
        proj = ProjectModel(
            id=p.get("id"),
            title=p.get("title"),
            category=p.get("category"),
            description=p.get("description"),
            full_description=p.get("full_description", ""),
            tags=p.get("tags", []),
            metrics=p.get("metrics", ""),
            github_url=p.get("github_url", ""),
            demo_url=p.get("demo_url", ""),
            featured=p.get("featured", True),
            architecture=p.get("architecture", []),
            created_date=p.get("created_date", ""),
        )
        db.add(proj)

    # Seed Experience
    experience_data = data.get("experience", [])
    for e in experience_data:
        exp = ExperienceModel(
            id=e.get("id"),
            role=e.get("role"),
            company=e.get("company"),
            location=e.get("location", ""),
            period=e.get("period", ""),
            type=e.get("type", "Internship"),
            highlights=e.get("highlights", []),
            tech_stack=e.get("tech_stack", []),
            current=e.get("current", False),
        )
        db.add(exp)

    # Seed Education
    education_data = data.get("education", [])
    for ed in education_data:
        edu = EducationModel(
            id=ed.get("id"),
            institution=ed.get("institution"),
            degree=ed.get("degree"),
            period=ed.get("period", ""),
            location=ed.get("location", ""),
            cgpa_or_grade=ed.get("cgpa_or_grade", ""),
            coursework=ed.get("coursework", []),
            highlights=ed.get("highlights", []),
        )
        db.add(edu)

    # Seed Achievements
    achievements_data = data.get("achievements", [])
    for ach in achievements_data:
        ach_item = AchievementModel(
            id=ach.get("id"),
            title=ach.get("title"),
            event=ach.get("event", ""),
            rank=ach.get("rank", ""),
            year=ach.get("year", ""),
            description=ach.get("description", ""),
            link=ach.get("link", ""),
        )
        db.add(ach_item)

    db.commit()
