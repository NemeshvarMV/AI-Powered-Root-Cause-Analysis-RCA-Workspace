from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.services.llm_factory import is_groq_available

router = APIRouter()


@router.get("/health")
def get_health_status(db: Session = Depends(get_db)):
    """Health check verifying database connection and Groq configuration."""
    db_ok = False
    db_name = None
    try:
        db_name = db.execute(text("SELECT current_database();")).scalar()
        db_ok = True
    except Exception as e:
        db_ok = False
        db_name = str(e)

    groq_ready = is_groq_available()

    return {
        "status": "healthy" if db_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": {
            "connected": db_ok,
            "database_name": db_name,
            "type": "PostgreSQL"
        },
        "ai_engine": {
            "provider": "Groq",
            "model": settings.GROQ_MODEL,
            "configured": groq_ready,
            "mode": "live_groq" if groq_ready else "domain_grounded_fallback"
        }
    }
