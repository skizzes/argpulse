"""
twitter_publisher.py — Publica el hilo de tweets en X usando Tweepy (API v2).
Cada tweet se publica como respuesta al anterior para formar el hilo.
"""

import os
import time
from typing import Optional
import tweepy
from logger import get_logger

logger = get_logger("twitter_publisher")

# Credenciales de X API (desde variables de entorno)
X_API_KEY = os.getenv("X_API_KEY")
X_API_SECRET = os.getenv("X_API_SECRET")
X_ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")

# Pausa entre tweets para evitar rate-limiting (segundos)
DELAY_BETWEEN_TWEETS = 3


def get_client() -> Optional[tweepy.Client]:
    """
    Crea y retorna un cliente Tweepy autenticado con OAuth 1.0a.
    Retorna None si faltan credenciales.
    """
    missing = [
        name for name, val in {
            "X_API_KEY": X_API_KEY,
            "X_API_SECRET": X_API_SECRET,
            "X_ACCESS_TOKEN": X_ACCESS_TOKEN,
            "X_ACCESS_TOKEN_SECRET": X_ACCESS_TOKEN_SECRET,
        }.items() if not val
    ]

    if missing:
        logger.error(f"Faltan las siguientes variables de entorno de X: {', '.join(missing)}")
        return None

    try:
        client = tweepy.Client(
            consumer_key=X_API_KEY,
            consumer_secret=X_API_SECRET,
            access_token=X_ACCESS_TOKEN,
            access_token_secret=X_ACCESS_TOKEN_SECRET,
            bearer_token=X_BEARER_TOKEN,
            wait_on_rate_limit=True,
        )
        logger.info("Cliente de X (Tweepy) autenticado correctamente.")
        return client
    except Exception as e:
        logger.error(f"Error creando el cliente de X: {e}", exc_info=True)
        return None


def publish_thread(tweets: list[dict]) -> bool:
    """
    Publica el hilo de tweets en X.
    Cada tweet se responde al anterior para formar el hilo.

    Args:
        tweets: Lista de dicts con 'number', 'text', 'image_prompt', 'char_count'

    Returns:
        True si el hilo se publicó completamente, False si hubo algún error.
    """
    client = get_client()
    if not client:
        return False

    if not tweets:
        logger.error("Lista de tweets vacía. No se puede publicar.")
        return False

    logger.info(f"Iniciando publicación del hilo ({len(tweets)} tweets)...")

    reply_to_id: Optional[str] = None
    published_count = 0

    for tweet in tweets:
        tweet_text = tweet["text"]
        tweet_number = tweet["number"]
        char_count = tweet.get("char_count", len(tweet_text))

        logger.info(
            f"Publicando tweet {tweet_number}/{len(tweets)} "
            f"({char_count} chars)..."
        )

        try:
            if reply_to_id:
                # Publicar como respuesta al tweet anterior
                response = client.create_tweet(
                    text=tweet_text,
                    in_reply_to_tweet_id=reply_to_id,
                )
            else:
                # Primer tweet del hilo
                response = client.create_tweet(text=tweet_text)

            if response.data and response.data.get("id"):
                reply_to_id = str(response.data["id"])
                published_count += 1
                logger.info(
                    f"✅ Tweet {tweet_number} publicado. ID: {reply_to_id}"
                )

                # Log del prompt de imagen sugerido
                if tweet.get("image_prompt"):
                    logger.info(
                        f"   🖼️  Prompt imagen sugerido: {tweet['image_prompt'][:80]}..."
                    )
            else:
                logger.error(
                    f"❌ Tweet {tweet_number}: respuesta inesperada de la API: {response}"
                )
                return False

        except tweepy.TweepyException as e:
            logger.error(
                f"❌ Error publicando tweet {tweet_number}: {e}",
                exc_info=True
            )
            if published_count > 0:
                logger.warning(
                    f"Se publicaron {published_count}/{len(tweets)} tweets antes del error. "
                    "El hilo quedó incompleto."
                )
            return False
        except Exception as e:
            logger.error(
                f"❌ Error inesperado publicando tweet {tweet_number}: {e}",
                exc_info=True
            )
            return False

        # Pausa entre tweets para no saturar la API
        if tweet_number < len(tweets):
            time.sleep(DELAY_BETWEEN_TWEETS)

    logger.info(
        f"🎉 Hilo publicado exitosamente: {published_count}/{len(tweets)} tweets."
    )
    return True


def verify_credentials() -> bool:
    """Verifica que las credenciales de X sean válidas antes de publicar."""
    client = get_client()
    if not client:
        return False
    try:
        me = client.get_me()
        if me.data:
            logger.info(f"Credenciales verificadas. Cuenta: @{me.data.username}")
            return True
        return False
    except tweepy.TweepyException as e:
        logger.error(f"Error verificando credenciales de X: {e}")
        return False
