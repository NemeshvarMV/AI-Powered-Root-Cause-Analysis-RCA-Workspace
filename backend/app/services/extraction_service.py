import logging
from typing import Optional, Dict, Any
from backend.app.services.pdf_service import extract_text_from_pdf, PDFExtractionError
from backend.app.workflows.rca_graph import compiled_rca_graph
from backend.app.schemas.extraction import IncidentExtractionSchema, ExtractionResponse

logger = logging.getLogger(__name__)


def process_extraction(
    source_type: str,
    raw_text: Optional[str] = None,
    pdf_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    email_subject: Optional[str] = None
) -> ExtractionResponse:
    """
    Unified extraction pipeline for PDF, text, and email.
    Executes LangGraph extraction and returns validated Pydantic models.
    """
    text_content = ""
    metadata: Dict[str, Any] = {}
    warnings = []

    # 1. Extract raw text from source
    if source_type == "pdf":
        if not pdf_bytes:
            raise ValueError("PDF content is empty.")
        text_content, pdf_meta = extract_text_from_pdf(pdf_bytes, filename=filename or "document.pdf")
        metadata = pdf_meta
    elif source_type == "email":
        if not raw_text or not raw_text.strip():
            raise ValueError("Email body is empty.")
        subject_header = f"EMAIL SUBJECT: {email_subject}\n\n" if email_subject else ""
        text_content = f"{subject_header}{raw_text}"
        metadata = {"email_subject": email_subject}
    elif source_type == "text":
        if not raw_text or not raw_text.strip():
            raise ValueError("Text content is empty.")
        text_content = raw_text
        metadata = {"char_length": len(raw_text)}
    else:
        raise ValueError(f"Unsupported source type: {source_type}")

    # 2. Invoke LangGraph workflow
    initial_state = {
        "source_type": source_type,
        "original_metadata": metadata,
        "raw_text": text_content,
        "retry_count": 0,
        "execution_log": []
    }

    try:
        graph_output = compiled_rca_graph.invoke(initial_state)
        extracted = graph_output.get("extracted_fields", {})
        
        # Validate into Pydantic IncidentExtractionSchema
        pydantic_data = IncidentExtractionSchema(**extracted)
        
        # Check for potential data gaps
        if not pydantic_data.batch_number:
            warnings.append("Batch/Lot number could not be determined from source document.")
        if not pydantic_data.actual_result:
            warnings.append("Explicit numerical test result was not found.")

        return ExtractionResponse(
            success=True,
            source_type=source_type,
            original_reference=filename or email_subject or "Pasted Text",
            extracted_data=pydantic_data,
            raw_text_preview=text_content[:1000] + ("..." if len(text_content) > 1000 else ""),
            warnings=warnings
        )
    except Exception as e:
        logger.error(f"Extraction pipeline failed: {e}", exc_info=True)
        raise RuntimeError(f"Extraction failed: {str(e)}")
