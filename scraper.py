"""
scraper.py — Extrae el contenido de la sección "Análisis Diario" de argpulse.com.
Optimizado para navegar la estructura de contenedores de ArgPulse.
"""

import os
import re
import requests
from bs4 import BeautifulSoup
from typing import Optional
from logger import get_logger

logger = get_logger("scraper")

WEBSITE_URL = os.getenv("WEBSITE_URL", "https://argpulse.com")
ANALYSIS_SECTION_TITLE = "Análisis Diario"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "es-AR,es;q=0.9",
}


def find_analysis_section(soup: BeautifulSoup) -> Optional[str]:
    """
    Localiza la sección y extrae todo su contenido de forma robusta.
    """
    # 1. Buscar el heading que contiene el título
    heading = soup.find(re.compile(r"^h[1-4]$"), string=re.compile(ANALYSIS_SECTION_TITLE, re.I))
    
    if not heading:
        # Intento 2: Buscar cualquier tag que contenga el texto exacto
        heading = soup.find(lambda tag: tag.name in ["h1", "h2", "h3", "h4", "div", "span"] 
                           and ANALYSIS_SECTION_TITLE.lower() in tag.get_text().lower())

    if not heading:
        logger.warning("No se encontró el título de la sección.")
        return None

    logger.info(f"Título encontrado en tag <{heading.name}>")

    # 2. Subir por el árbol hasta encontrar un contenedor que tenga hermanos o suficiente contenido
    # En ArgPulse, las secciones suelen estar en divs o sections hermanas.
    container = heading
    for _ in range(5): # Subir hasta 5 niveles máximo
        if not container.parent:
            break
            
        parent = container.parent
        
        # Si el padre tiene muchos hijos o mucho texto, es un buen candidato
        text_len = len(parent.get_text(strip=True))
        if text_len > 100:
            # Verificar si este contenedor tiene el contenido real
            # Buscamos si tiene párrafos o listas que no sean solo el título
            if parent.find_all(['p', 'li', 'h3', 'h4']):
                container = parent
                break
        container = parent

    # 3. Extraer contenido del contenedor
    # Eliminamos el título para que no se repita en el análisis si es posible
    content_text = container.get_text(separator="\n", strip=True)
    
    # Limpieza básica: si el contenido es demasiado corto, algo salió mal
    if len(content_text) < 50:
        logger.warning(f"Contenido extraído demasiado corto ({len(content_text)} chars).")
        # Fallback: intentar agarrar el texto de los hermanos del contenedor de título
        siblings_text = []
        for sib in container.find_next_siblings():
            siblings_text.append(sib.get_text(separator=" ", strip=True))
        
        if siblings_text:
            content_text = "\n".join(siblings_text)

    if len(content_text) < 50:
        return None

    logger.info(f"Éxito: {len(content_text)} caracteres extraídos.")
    return content_text


def get_daily_analysis() -> Optional[str]:
    """Descarga y extrae el análisis."""
    try:
        response = requests.get(WEBSITE_URL, headers=HEADERS, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'lxml')
        return find_analysis_section(soup)
    except Exception as e:
        logger.error(f"Error en scraping: {e}")
        return None
