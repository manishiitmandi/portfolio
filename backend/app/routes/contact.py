import json
import uuid
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.models.schemas import ContactMessage

router = APIRouter(prefix="/api", tags=["contact"])

MESSAGES_PATH = Path(__file__).resolve().parent.parent / "data" / "messages.json"


def load_messages() -> list:
    if not MESSAGES_PATH.exists():
        return []
    try:
        with open(MESSAGES_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_messages(messages: list):
    MESSAGES_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MESSAGES_PATH, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2)


@router.post("/contact")
def submit_contact_form(msg: ContactMessage):
    if not msg.name.strip():
        raise HTTPException(status_code=422, detail="Name cannot be empty")
    if not msg.email.strip() or "@" not in msg.email:
        raise HTTPException(status_code=422, detail="Valid email address is required")
    if not msg.message.strip():
        raise HTTPException(status_code=422, detail="Message content cannot be empty")

    new_msg = {
        "id": str(uuid.uuid4()),
        "name": msg.name.strip(),
        "email": msg.email.strip(),
        "subject": msg.subject.strip() or "Portfolio Inquiry",
        "message": msg.message.strip(),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "is_read": False,
    }

    messages = load_messages()
    messages.insert(0, new_msg)
    save_messages(messages)

    return {
        "success": True,
        "message": f"Thank you {msg.name}! Your message has been sent successfully.",
        "id": new_msg["id"],
        "timestamp": new_msg["created_at"]
    }
