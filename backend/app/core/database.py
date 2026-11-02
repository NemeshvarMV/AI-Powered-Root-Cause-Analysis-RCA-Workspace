from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings

# Normalize URL for SQLAlchemy + psycopg2 compatibility (e.g. Supabase, Neon, Render)
raw_url = settings.DATABASE_URL
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+"):
    raw_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Configure connection pooling and pre-ping to handle reconnections cleanly
connect_args = {}
if "sqlite" in raw_url:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    raw_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections every 5 min (ideal for Supabase pooler)
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import all models to register with Base.metadata
    from backend.app.models.investigation import Investigation
    from backend.app.models.source_document import SourceDocument
    from backend.app.models.evidence_item import EvidenceItem
    from backend.app.models.root_cause import RootCause
    from backend.app.models.capa_action import CapaAction
    from backend.app.models.five_whys import FiveWhysStep
    from backend.app.models.fishbone import FishboneFactor
    from backend.app.models.review_event import ReviewEvent

    Base.metadata.create_all(bind=engine)
