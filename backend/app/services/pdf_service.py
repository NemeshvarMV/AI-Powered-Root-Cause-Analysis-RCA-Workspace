import io
import re
from typing import Tuple, Dict, Any
from pypdf import PdfReader


class PDFExtractionError(Exception):
    pass


def extract_text_from_pdf(file_bytes: bytes, filename: str = "document.pdf") -> Tuple[str, Dict[str, Any]]:
    """
    Safely extract text from PDF file bytes using pypdf.
    Validates PDF signature, page limits, and handles malformed or scanned PDFs gracefully.
    """
    if not file_bytes:
        raise PDFExtractionError("Uploaded file is empty (0 bytes).")
    
    # Check PDF header magic bytes (%PDF)
    if not file_bytes.startswith(b"%PDF"):
        raise PDFExtractionError("Invalid file format. The file is not a valid PDF document.")
    
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        num_pages = len(reader.pages)
        if num_pages == 0:
            raise PDFExtractionError("PDF file contains no readable pages.")
        
        extracted_pages = []
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            extracted_pages.append(page_text.strip())
        
        full_text = "\n\n--- PAGE BREAK ---\n\n".join(extracted_pages).strip()
        
        # Check if text is virtually empty (likely scanned or image-based)
        clean_text = re.sub(r"\s+", "", full_text)
        if len(clean_text) < 10:
            raise PDFExtractionError(
                "Document appears to be a scanned image or contains non-extractable text. "
                "Optical Character Recognition (OCR) is required for scanned documents."
            )
            
        metadata = {
            "num_pages": num_pages,
            "filename": filename,
            "file_size_bytes": len(file_bytes),
            "is_encrypted": reader.is_encrypted
        }
        
        return full_text, metadata

    except PDFExtractionError:
        raise
    except Exception as e:
        raise PDFExtractionError(f"Failed to process PDF document: {str(e)}")
