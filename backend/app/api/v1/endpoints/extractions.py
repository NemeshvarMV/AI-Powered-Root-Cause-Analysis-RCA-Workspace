import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Request

from backend.app.schemas.extraction import ExtractionRequest, ExtractionResponse
from backend.app.services.extraction_service import process_extraction
from backend.app.services.pdf_service import PDFExtractionError
from backend.app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/extractions", response_model=ExtractionResponse)
async def extract_incident_data(
    request: Request,
    # Multipart file upload option
    file: Optional[UploadFile] = File(None),
    source_type: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    subject: Optional[str] = Form(None),
    # Or JSON body option for text/email
    json_payload: Optional[ExtractionRequest] = None
):
    """
    Intake incident via PDF upload, pasted text, or email body.
    Extracts structured fields using LangGraph and Groq.
    """
    # 1. Determine input mode
    actual_source_type = source_type or (json_payload.source_type if json_payload else None)
    actual_content = content or (json_payload.content if json_payload else None)
    actual_subject = subject or (json_payload.subject if json_payload else None)

    # If incoming request is JSON (e.g. from frontend apiClient or REST client), extract from JSON body
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            if isinstance(body, dict):
                actual_source_type = body.get("source_type") or actual_source_type
                actual_content = body.get("content") or actual_content
                actual_subject = body.get("subject") or actual_subject
        except Exception as e:
            logger.warning(f"Could not parse JSON body in /extractions: {e}")

    # 2. Handle PDF file upload
    if file:
        actual_source_type = "pdf"
        # Validate filename
        filename = file.filename or "document.pdf"
        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF documents (.pdf) are supported for file upload."
            )
        
        # Read file bytes
        try:
            pdf_bytes = await file.read()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read uploaded file: {str(e)}"
            )

        if len(pdf_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size ({settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB)."
            )

        try:
            return process_extraction(
                source_type="pdf",
                pdf_bytes=pdf_bytes,
                filename=filename
            )
        except PDFExtractionError as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
        except Exception as e:
            logger.error(f"PDF extraction error: {e}", exc_info=True)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"PDF extraction failed: {str(e)}")

    # 3. Handle Text / Email input
    if not actual_source_type:
        actual_source_type = "text"

    if actual_source_type not in ["text", "email"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="source_type must be 'pdf', 'text', or 'email'."
        )

    if not actual_content or not actual_content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input content is empty. Please provide incident text or email body."
        )

    try:
        return process_extraction(
            source_type=actual_source_type,
            raw_text=actual_content,
            email_subject=actual_subject
        )
    except Exception as e:
        logger.error(f"Text/Email extraction error: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Extraction failed: {str(e)}")
