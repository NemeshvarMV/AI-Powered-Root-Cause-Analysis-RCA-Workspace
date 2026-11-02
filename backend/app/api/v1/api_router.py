from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    health,
    extractions,
    investigations,
    rca,
    capa,
    evidence
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(extractions.router, tags=["Extractions"])
api_router.include_router(investigations.router, tags=["Investigations"])
api_router.include_router(rca.router, tags=["Root Cause Analysis"])
api_router.include_router(capa.router, tags=["CAPA"])
api_router.include_router(evidence.router, tags=["Evidence"])
