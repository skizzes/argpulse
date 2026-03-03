@echo off
:: ============================================================
:: setup_scheduler.bat
:: Configura la tarea automática diaria en Windows Task Scheduler
:: Ejecutar como ADMINISTRADOR
:: ============================================================

echo.
echo ============================================================
echo   ArgPulse Bot - Configuración de Tarea Automática
echo ============================================================
echo.

:: Detectar directorio del script
set "BOT_DIR=%~dp0"
set "PYTHON_PATH=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
set "TASK_NAME=ArgPulseTwitterBot"
:: 11:00 hora argentina (UTC-3) = 14:00 UTC
set "TASK_TIME=11:00"

echo Directorio del bot: %BOT_DIR%
echo Hora de ejecución: %TASK_TIME% (hora argentina)
echo.

:: Verificar si Python está disponible
"%PYTHON_PATH%" --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python no encontrado. Instalalo desde https://www.python.org
    pause
    exit /b 1
)

:: Verificar si existe el archivo .env
if not exist "%BOT_DIR%.env" (
    echo ADVERTENCIA: No se encontró el archivo .env
    echo Copiá .env.example a .env y completá tus claves de API antes de ejecutar el bot.
    echo.
)

:: Crear la tarea programada
schtasks /create ^
  /tn "%TASK_NAME%" ^
  /tr "\"%PYTHON_PATH%\" \"%BOT_DIR%main.py\"" ^
  /sc DAILY ^
  /st %TASK_TIME% ^
  /f ^
  /rl HIGHEST ^
  /ru "%USERNAME%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Tarea creada exitosamente.
    echo    Nombre: %TASK_NAME%
    echo    Hora: %TASK_TIME% todos los días
    echo.
    echo Para verificar: Abrí el Programador de Tareas de Windows y buscá "%TASK_NAME%"
    echo Para eliminar la tarea: schtasks /delete /tn "%TASK_NAME%" /f
) else (
    echo.
    echo ❌ Error creando la tarea. Ejecutá este script como Administrador.
)

echo.
pause
