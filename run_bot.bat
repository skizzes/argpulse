@echo off
:: run_bot.bat — Ejecuta el bot manualmente
:: Útil para pruebas o ejecuciones manuales

cd /d "%~dp0"

echo.
echo ============================================================
echo   ArgPulse Bot - Ejecución Manual
echo ============================================================
echo.

:: Verificar flag de prueba
set "PYTHON=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"

if "%1"=="--dry-run" (
    echo Modo: DRY RUN (sin publicar en X)
    "%PYTHON%" main.py --dry-run
) else if "%1"=="--verify" (
    echo Verificando credenciales de X...
    "%PYTHON%" main.py --verify
) else (
    echo Modo: PUBLICACIÓN REAL
    "%PYTHON%" main.py
)

echo.
echo Código de salida: %ERRORLEVEL%
pause
