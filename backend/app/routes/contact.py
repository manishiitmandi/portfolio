import html
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import ContactMessageModel
from app.models.schemas import ContactMessage

router = APIRouter(prefix="/api", tags=["contact"])


def sanitize_text(text: str) -> str:
    """Strip dangerous characters and escape HTML to prevent XSS payloads."""
    if not text:
        return ""
    # Strip HTML tags and escape entities
    cleaned = html.escape(text.strip())
    return cleaned


@router.post("/contact")
def submit_contact_form(msg: ContactMessage, db: Session = Depends(get_db)):
    # 1. Validation
    name = sanitize_text(msg.name)
    email = msg.email.strip().lower()
    subject = sanitize_text(msg.subject) if msg.subject else "Portfolio Inquiry"
    message_content = sanitize_text(msg.message)

    if not name or len(name) < 2:
        raise HTTPException(status_code=422, detail="Name must be at least 2 characters")
    if not email or "@" not in email or "." not in email:
        raise HTTPException(status_code=422, detail="A valid email address is required")
    if not message_content or len(message_content) < 5:
        raise HTTPException(status_code=422, detail="Message content must be at least 5 characters")

    new_id = str(uuid.uuid4())
    now = datetime.utcnow()

    # 2. Database Insert
    try:
        db_msg = ContactMessageModel(
            id=new_id,
            name=name,
            email=email,
            subject=subject,
            message=message_content,
            created_at=now,
            is_read=False,
        )
        db.add(db_msg)
        db.commit()
        db.refresh(db_msg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {str(e)}")

    return {
        "success": True,
        "message": f"Thank you {name}! Your message has been safely received.",
        "id": new_id,
        "timestamp": now.isoformat() + "Z"
    }
