import time
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.database import engine, Base, SessionLocal
from app.database_seeder import seed_database_if_empty
from app.routes import portfolio, contact, admin

# Ensure tables exist in database (PostgreSQL / SQLite)
Base.metadata.create_all(bind=engine)

# Seed initial records if fresh database
with SessionLocal() as db_session:
    seed_database_if_empty(db_session)

app = FastAPI(
    title="Manish Kumar — Engineering Portfolio API",
    description="Production-grade asynchronous FastAPI backend with PostgreSQL persistence, cryptographic JWT auth, and live health telemetry.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for local and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Database-Latency"],
)

# Performance & Process Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception as exc:
        process_time = (time.perf_counter() - start_time) * 1000
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error", "detail": str(exc)},
            headers={"X-Process-Time": f"{process_time:.2f}ms"}
        )
    process_time = (time.perf_counter() - start_time) * 1000
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    return response

# Mount static directory for resume and assets
STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(portfolio.router)
app.include_router(contact.router)
app.include_router(admin.router)

# Production Health Check & Database Latency Probe
@app.get("/api/health", tags=["system"])
def health_check():
    db_status = "connected"
    latency_ms = 0.0
    start = time.perf_counter()
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        latency_ms = (time.perf_counter() - start) * 1000
    except Exception as e:
        db_status = f"unreachable: {str(e)}"

    return {
        "status": "healthy" if "unreachable" not in db_status else "degraded",
        "service": "portfolio-api",
        "database": db_status,
        "database_latency_ms": round(latency_ms, 2),
        "timestamp": time.time(),
        "environment": "production" if "neon.tech" in str(engine.url) else "development",
    }
