"""
logger.py — Módulo de logging centralizado para el ArgPulse Bot.
Registra todos los eventos en consola y en archivo de log rotativo.
"""

import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
LOG_FILE = os.path.join(LOG_DIR, "argpulse_bot.log")


def get_logger(name: str = "argpulse_bot") -> logging.Logger:
    """
    Retorna un logger configurado con handlers de consola y archivo.
    Los logs se rotan cuando alcanzan 5MB (máximo 5 archivos guardados).
    """
    os.makedirs(LOG_DIR, exist_ok=True)

    logger = logging.getLogger(name)

    # Evitar handlers duplicados si se llama múltiples veces
    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Handler de consola
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # Handler de archivo rotativo
    file_handler = RotatingFileHandler(
        LOG_FILE,
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
