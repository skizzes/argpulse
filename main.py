"""
main.py — Orquestador principal del ArgPulse Twitter Bot.

Flujo de ejecución:
  1. Carga variables de entorno
  2. Extrae el "Análisis Diario" de argpulse.com
  3. Verifica que no sea duplicado
  4. Genera el hilo con Claude
  5. Publica el hilo en X
  6. Registra el contenido como publicado

Uso:
  python main.py              → ejecución normal
  python main.py --dry-run    → simula sin publicar en X
  python main.py --verify     → verifica credenciales de X solamente
"""

import sys
import os
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Cargar .env desde el directorio del script
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from logger import get_logger
from scraper import get_daily_analysis
from duplicate_checker import is_duplicate, mark_as_published
from ai_generator import generate_thread
from twitter_publisher import publish_thread, verify_credentials

logger = get_logger("main")


def run(dry_run: bool = False) -> int:
    """
    Ejecuta el flujo completo del bot.

    Args:
        dry_run: Si es True, genera el hilo pero NO publica en X.

    Returns:
        Código de salida: 0=éxito, 1=error, 2=sin contenido/duplicado
    """
    start_time = datetime.now()
    logger.info("=" * 60)
    logger.info(f"ArgPulse Bot — Inicio: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"Modo: {'DRY RUN (sin publicar)' if dry_run else 'PUBLICACIÓN REAL'}")
    logger.info("=" * 60)

    # --- PASO 1: Scraping ---
    logger.info("📥 PASO 1/4: Extrayendo Análisis Diario de argpulse.com...")
    content = get_daily_analysis()

    if not content:
        logger.warning("⚠️  No se encontró contenido en 'Análisis Diario'. Finalizando sin publicar.")
        return 2

    logger.info(f"✅ Contenido extraído: {len(content)} caracteres.")

    # --- PASO 2: Verificar duplicados ---
    logger.info("🔍 PASO 2/4: Verificando si el contenido ya fue publicado...")
    if is_duplicate(content):
        logger.info("⏭️  Contenido duplicado. No se publicará.")
        return 2

    logger.info("✅ Contenido nuevo. Procediendo...")

    # --- PASO 3: Generar hilo con Gemini AI ---
    logger.info("🤖 PASO 3/4: Generando hilo con Gemini AI...")
    tweets = generate_thread(content)

    if not tweets:
        logger.error("❌ No se pudo generar el hilo. Finalizando.")
        return 1

    # Mostrar preview del hilo en los logs
    logger.info(f"✅ Hilo generado: {len(tweets)} tweets.")
    logger.info("─" * 40)
    logger.info("PREVIEW DEL HILO:")
    for tweet in tweets:
        logger.info(f"  [{tweet['number']}] ({tweet['char_count']} chars) {tweet['text'][:80]}...")
    logger.info("─" * 40)

    # --- PASO 4: Publicar en X ---
    if dry_run:
        logger.info("🔵 DRY RUN: No se publicará en X.")
        logger.info("Hilo completo generado:")
        for tweet in tweets:
            logger.info(f"\n--- Tweet {tweet['number']}/{len(tweets)} ({tweet['char_count']} chars) ---")
            logger.info(tweet["text"])
            logger.info(f"🖼️  Imagen sugerida: {tweet.get('image_prompt', 'N/A')}")
        return 0

    logger.info("🐦 PASO 4/4: Publicando hilo en X...")
    success = publish_thread(tweets)

    if success:
        mark_as_published(content)
        elapsed = (datetime.now() - start_time).total_seconds()
        logger.info(f"🎉 Hilo publicado exitosamente en {elapsed:.1f}s.")
        logger.info("=" * 60)
        return 0
    else:
        logger.error("❌ Error publicando el hilo. El contenido NO fue marcado como publicado.")
        logger.info("=" * 60)
        return 1


def main():
    parser = argparse.ArgumentParser(
        description="ArgPulse Bot — Publica hilos diarios en X basados en el Análisis Diario de argpulse.com"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generar el hilo sin publicarlo en X (para pruebas)",
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Verificar solo las credenciales de X y salir",
    )
    args = parser.parse_args()

    if args.verify:
        logger.info("Verificando credenciales de X...")
        ok = verify_credentials()
        sys.exit(0 if ok else 1)

    exit_code = run(dry_run=args.dry_run)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
