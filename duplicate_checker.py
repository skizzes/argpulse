"""
duplicate_checker.py — Evita publicar el mismo análisis dos veces.
Guarda un hash del contenido publicado en un archivo JSON local.
"""

import os
import json
import hashlib
from datetime import date
from typing import Optional
from logger import get_logger

logger = get_logger("duplicate_checker")

STATE_FILE = os.path.join(os.path.dirname(__file__), "data", "published_hashes.json")


def _load_state() -> dict:
    """Carga el estado de publicaciones previas desde el archivo JSON."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    if not os.path.exists(STATE_FILE):
        return {}
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logger.warning(f"No se pudo leer el archivo de estado: {e}. Iniciando vacío.")
        return {}


def _save_state(state: dict) -> None:
    """Persiste el estado actualizado."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def compute_hash(content: str) -> str:
    """Genera un hash SHA-256 del contenido para comparación."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def is_duplicate(content: str) -> bool:
    """
    Verifica si el contenido ya fue publicado hoy o si el hash ya existe.
    Retorna True si es duplicado, False si es nuevo.
    """
    today = str(date.today())
    content_hash = compute_hash(content)
    state = _load_state()

    # Verificar publicación del día de hoy
    if state.get("last_published_date") == today:
        logger.warning(f"Ya se publicó un hilo hoy ({today}). Omitiendo.")
        return True

    # Verificar si el mismo contenido ya fue publicado antes
    published_hashes = state.get("published_hashes", [])
    if content_hash in published_hashes:
        logger.warning(f"Contenido duplicado detectado (hash: {content_hash[:12]}...). Omitiendo.")
        return True

    return False


def mark_as_published(content: str) -> None:
    """Registra el contenido como publicado para evitar duplicados futuros."""
    today = str(date.today())
    content_hash = compute_hash(content)
    state = _load_state()

    published_hashes = state.get("published_hashes", [])
    published_hashes.append(content_hash)

    # Conservar solo los últimos 90 hashes (3 meses)
    if len(published_hashes) > 90:
        published_hashes = published_hashes[-90:]

    state["last_published_date"] = today
    state["published_hashes"] = published_hashes

    _save_state(state)
    logger.info(f"Contenido marcado como publicado. Fecha: {today}, Hash: {content_hash[:12]}...")
