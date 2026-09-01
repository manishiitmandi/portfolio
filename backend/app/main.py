from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import portfolio, contact, admin

app = FastAPI(
    title="Manish Kumar - Dynamic Portfolio API",
    description="High-performance FastAPI backend supporting dynamic portfolio content, admin live editing, and message queues.",
    version="1.0.0",
)

# CORS middleware for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for resume and media assets
STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(portfolio.router)
app.include_router(contact.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "name": "Manish Kumar Dynamic Portfolio API",
        "docs": "/docs",
        "endpoints": [
            "/api/profile",
            "/api/skills",
            "/api/projects",
            "/api/experience",
            "/api/education",
            "/api/achievements",
            "/api/stats",
            "/api/contact",
            "/api/admin/login",
            "/api/resume/download",
        ],
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "portfolio-backend"}
