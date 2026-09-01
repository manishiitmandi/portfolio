import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import ContactMessageModel
from app.models.schemas import ContactMessage

router = APIRouter(prefix="/api", tags=["contact"])


@router.post("/contact")
def submit_contact_form(msg: ContactMessage, db: Session = Depends(get_db)):
    if not msg.name.strip():
        raise HTTPException(status_code=422, detail="Name cannot be empty")
    if not msg.email.strip() or "@" not in msg.email:
        raise HTTPException(status_code=422, detail="Valid email address is required")
    if not msg.message.strip():
        raise HTTPException(status_code=422, detail="Message content cannot be empty")

    new_id = str(uuid.uuid4())
    now = datetime.utcnow()

    db_msg = ContactMessageModel(
        id=new_id,
        name=msg.name.strip(),
        email=msg.email.strip(),
        subject=msg.subject.strip() if msg.subject else "Portfolio Inquiry",
        message=msg.message.strip(),
        created_at=now,
        is_read=False,
    )

    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)

    return {
        "success": True,
        "message": f"Thank you {msg.name}! Your message has been saved successfully.",
        "id": new_id,
        "timestamp": now.isoformat() + "Z"
    }
