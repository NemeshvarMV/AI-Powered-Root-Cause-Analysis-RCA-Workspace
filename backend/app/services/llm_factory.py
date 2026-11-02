import os
import json
import logging
from typing import Optional, Any
from langchain_groq import ChatGroq
from backend.app.core.config import settings

logger = logging.getLogger(__name__)


def get_llm(model_name: Optional[str] = None, temperature: float = 0.1) -> Optional[ChatGroq]:
    """
    Returns an initialized ChatGroq instance if GROQ_API_KEY is configured.
    Returns None if GROQ_API_KEY is missing or invalid.
    """
    api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
    if not api_key or api_key.strip() == "" or api_key == "gsk_your_groq_api_key_here":
        logger.warning("GROQ_API_KEY not configured or set to placeholder. Operating in fallback mode.")
        return None
    
    selected_model = model_name or settings.GROQ_MODEL
    try:
        return ChatGroq(
            groq_api_key=api_key,
            model_name=selected_model,
            temperature=temperature,
            max_tokens=4096
        )
    except Exception as e:
        logger.error(f"Failed to initialize ChatGroq: {e}")
        return None


def is_groq_available() -> bool:
    api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
    return bool(api_key and api_key.strip() and api_key != "gsk_your_groq_api_key_here")
