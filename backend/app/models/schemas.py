from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SocialLinks(BaseModel):
    github: str = ""
    linkedin: str = ""
    leetcode: str = ""
    codeforces: str = ""
    email: str = ""
    phone: str = ""
    twitter: Optional[str] = ""


class Stats(BaseModel):
    projects_completed: int = 12
    cgpa: str = "8.07"
    years_experience: str = "1+"
    hackathons_won: int = 2
    contributions: str = "500+"


class Profile(BaseModel):
    name: str
    headline: str
    tagline: str
    bio: str
    location: str
    available_for_hire: bool = True
    avatar_url: str = ""
    socials: SocialLinks
    stats: Stats


class SkillItem(BaseModel):
    name: str
    level: int = Field(ge=0, le=100, default=85)
    icon: Optional[str] = ""
    highlight: bool = False


class SkillCategory(BaseModel):
    category: str
    description: str = ""
    skills: List[SkillItem]


class ExperienceItem(BaseModel):
    id: str
    role: str
    company: str
    location: str
    period: str
    type: str = "Full-time"  # Internship, Full-time, Research, Open Source
    highlights: List[str]
    tech_stack: List[str]
    current: bool = False


class ProjectItem(BaseModel):
    id: str
    title: str
    category: str  # Generative AI, Computer Vision, Backend & Systems, Geospatial
    description: str
    full_description: Optional[str] = ""
    tags: List[str]
    metrics: Optional[str] = ""  # e.g., "Dice score: 0.84 vs 0.81 benchmark"
    github_url: Optional[str] = ""
    demo_url: Optional[str] = ""
    featured: bool = True
    architecture: Optional[List[str]] = []
    created_date: Optional[str] = ""


class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    period: str
    location: str
    cgpa_or_grade: str
    coursework: List[str]
    highlights: Optional[List[str]] = []


class AchievementItem(BaseModel):
    id: str
    title: str
    event: str
    rank: str
    year: str
    description: str
    link: Optional[str] = ""


class ContactMessage(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    subject: str = "Portfolio Inquiry"
    message: str
    created_at: Optional[str] = None
    is_read: bool = False


class PortfolioData(BaseModel):
    profile: Profile
    skills: List[SkillCategory]
    experience: List[ExperienceItem]
    projects: List[ProjectItem]
    education: List[EducationItem]
    achievements: List[AchievementItem]


class AdminLoginRequest(BaseModel):
    pin: str


class AdminLoginResponse(BaseModel):
    success: bool
    token: str
    message: str


class ChangePasswordRequest(BaseModel):
    current_pin: str
    new_pin: str


class TerminalCommandRequest(BaseModel):
    command: str


class TerminalCommandResponse(BaseModel):
    output: str
    type: str = "text"  # text, table, json, error, link
