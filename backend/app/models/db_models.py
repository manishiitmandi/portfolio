from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, JSON, DateTime
from app.database import Base


class ProfileModel(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Manish Kumar")
    headline = Column(String(255), default="")
    tagline = Column(String(255), default="")
    bio = Column(Text, default="")
    location = Column(String(100), default="")
    available_for_hire = Column(Boolean, default=True)
    avatar_url = Column(String(500), default="")
    socials = Column(JSON, default=dict)
    stats = Column(JSON, default=dict)


class SkillCategoryModel(Base):
    __tablename__ = "skill_categories"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), unique=True, index=True)
    description = Column(String(255), default="")
    skills = Column(JSON, default=list)  # List of skill items with name, level, icon


class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="AI / Deep Learning")
    description = Column(Text, default="")
    full_description = Column(Text, default="")
    tags = Column(JSON, default=list)
    metrics = Column(String(255), default="")
    github_url = Column(String(500), default="")
    demo_url = Column(String(500), default="")
    featured = Column(Boolean, default=True)
    architecture = Column(JSON, default=list)
    created_date = Column(String(50), default="")


class ExperienceModel(Base):
    __tablename__ = "experience"

    id = Column(String(50), primary_key=True, index=True)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(100), default="")
    period = Column(String(100), default="")
    type = Column(String(50), default="Internship")
    highlights = Column(JSON, default=list)
    tech_stack = Column(JSON, default=list)
    current = Column(Boolean, default=False)


class EducationModel(Base):
    __tablename__ = "education"

    id = Column(String(50), primary_key=True, index=True)
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    period = Column(String(100), default="")
    location = Column(String(100), default="")
    cgpa_or_grade = Column(String(50), default="")
    coursework = Column(JSON, default=list)
    highlights = Column(JSON, default=list)


class AchievementModel(Base):
    __tablename__ = "achievements"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    event = Column(String(255), default="")
    rank = Column(String(100), default="")
    year = Column(String(50), default="")
    description = Column(Text, default="")
    link = Column(String(500), default="")


class ContactMessageModel(Base):
    __tablename__ = "contact_messages"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    subject = Column(String(255), default="Portfolio Inquiry")
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)


class AdminConfigModel(Base):
    __tablename__ = "admin_config"

    id = Column(Integer, primary_key=True)
    admin_pin = Column(String(255), default="admin@484")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
