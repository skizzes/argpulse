"""
ai_generator.py — Genera un hilo de tweets usando Google Gemini API.
Recibe el texto del Análisis Diario y devuelve una lista de tweets estructurados.
Implementa fallback entre modelos para mayor robustez.
"""

import os
import json
import re
import time
from typing import Optional
import google.generativeai as genai
from logger import get_logger

logger = get_logger("ai_generator")

# Variables de entorno
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MAX_TWEETS = int(os.getenv("MAX_TWEETS", 8))
MIN_TWEETS = int(os.getenv("MIN_TWEETS", 5))
TWEET_MAX_CHARS = int(os.getenv("TWEET_MAX_CHARS", 280))

# Configuración de Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Lista de modelos a intentar en orden de preferencia
MODELS_TO_TRY = [
    'models/gemini-2.5-flash',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-2.0-flash',
]

RULES_TEXT = f"""
Reglas para el hilo de Twitter/X:
1. Genera entre {MIN_TWEETS} y {MAX_TWEETS} tweets.
2. Cada tweet debe tener MÁXIMO {TWEET_MAX_CHARS} caracteres.
3. El primer tweet debe ser un título atractivo con emojis.
4. Tono: profesional, analítico y claro.
5. Numeración: cada tweet debe iniciar con "N/TOTAL" (ej: "1/7").
6. NO incluyas hashtags (#) en ningún tweet.
7. El último tweet DEBE incluir SIEMPRE el enlace: https://argpulse.com
8. Responde ÚNICAMENTE con los datos JSON.
"""

JSON_FORMAT_PREVIEW = """
{
  "tweets": [
    {
      "number": 1,
      "text": "1/X Contenido...",
      "image_prompt": "Prompt..."
    }
  ]
}
"""

PROMPT_TEMPLATE = """
Eres un experto en comunicación financiera.
Convierte el siguiente análisis económico en un hilo de Twitter/X.

{rules}

Formato JSON de respuesta esperado:
{json_format}

=== CONTENIDO PARA ANALIZAR ===
{content}
=== FIN DEL CONTENIDO ===
"""


def validate_tweets(tweets: list[dict]) -> list[dict]:
    """Valida y corrige los tweets generados."""
    validated = []
    for tweet in tweets:
        text = tweet.get("text", "").strip()
        image_prompt = tweet.get("image_prompt", "").strip()

        if not text:
            continue

        if len(text) > TWEET_MAX_CHARS:
            text = text[:TWEET_MAX_CHARS - 3] + "..."

        validated.append({
            "number": tweet.get("number", len(validated) + 1),
            "text": text,
            "image_prompt": image_prompt,
            "char_count": len(text),
        })

    return validated


def generate_thread(content: str) -> Optional[list[dict]]:
    """Llama a Gemini para generar el hilo de tweets con fallback entre modelos."""
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY no está configurada.")
        return None

    full_prompt = PROMPT_TEMPLATE.format(
        rules=RULES_TEXT,
        json_format=JSON_FORMAT_PREVIEW,
        content=content
    )

    for model_name in MODELS_TO_TRY:
        try:
            logger.info(f"Intentando generar hilo con {model_name}...")
            model = genai.GenerativeModel(model_name)
            
            # Ajustar seguridad para evitar bloqueos por falsos positivos en análisis económico
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE",
                },
            ]

            response = model.generate_content(
                full_prompt, 
                safety_settings=safety_settings
            )
            
            if not response.text:
                logger.warning(f"Respuesta vacía de {model_name}. Intentando siguiente...")
                continue
                
            raw_response = response.text.strip()
            
            # Limpiar bloques de código
            if "```" in raw_response:
                json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
                if json_match:
                    raw_response = json_match.group()
                else:
                    raw_response = re.sub(r"```json|```", "", raw_response).strip()

            data = json.loads(raw_response)
            tweets_raw = data.get("tweets", [])

            if not tweets_raw:
                logger.warning(f"JSON sin tweets de {model_name}. Intentando siguiente...")
                continue

            result = validate_tweets(tweets_raw)
            logger.info(f"Hilo generado exitosamente con {model_name}.")
            return result

        except Exception as e:
            logger.error(f"Error con el modelo {model_name}: {e}")
            # Pausa breve antes de reintentar con otro modelo
            time.sleep(1)
            continue

    logger.error("Todos los modelos de Gemini fallaron.")
    return None
