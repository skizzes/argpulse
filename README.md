# ArgPulse Twitter Bot 🤖📊

Sistema automatizado que publica diariamente un hilo en X (Twitter) con el **Análisis Diario** de [argpulse.com](https://argpulse.com), generado por Claude AI.

---

## 🗂️ Estructura del proyecto

```
argpulse-bot/
├── main.py                 # Orquestador principal
├── scraper.py              # Extrae el Análisis Diario de argpulse.com
├── ai_generator.py         # Genera el hilo con Claude AI
├── twitter_publisher.py    # Publica el hilo en X vía API oficial
├── duplicate_checker.py    # Evita publicaciones duplicadas
├── logger.py               # Logging centralizado (consola + archivo)
├── requirements.txt        # Dependencias Python
├── .env.example            # Template de variables de entorno
├── .env                    # ⚠️ TUS CLAVES (crear desde .env.example)
├── setup_scheduler.bat     # Configura la tarea automática en Windows
├── run_bot.bat             # Ejecutar manualmente
├── logs/                   # Archivos de log (generados automáticamente)
└── data/                   # Estado de publicaciones (generado automáticamente)
```

---

## ⚙️ Instalación

### 1. Requisitos previos
- Python 3.10 o superior: [python.org](https://www.python.org/downloads/)

### 2. Instalar dependencias
```bash
cd "argpulse-bot"
pip install -r requirements.txt
```

### 3. Configurar variables de entorno
```bash
copy .env.example .env
```
Abrí el archivo `.env` y completá con tus claves reales:

| Variable | Descripción |
|---|---|
| `X_API_KEY` | API Key de X Developer Portal |
| `X_API_SECRET` | API Key Secret de X |
| `X_ACCESS_TOKEN` | Access Token de tu cuenta |
| `X_ACCESS_TOKEN_SECRET` | Access Token Secret |
| `X_BEARER_TOKEN` | Bearer Token de X |
| `GEMINI_API_KEY` | API Key de Google Gemini |

---

## 🚀 Uso

### Verificar credenciales de X
```bash
python main.py --verify
# o
run_bot.bat --verify
```

### Prueba sin publicar (recomendado primero)
```bash
python main.py --dry-run
# o
run_bot.bat --dry-run
```

### Publicación real
```bash
python main.py
# o hacer doble clic en run_bot.bat
```

---

## ⏰ Automatización diaria (Windows)

Ejecutar **como Administrador**:
```
setup_scheduler.bat
```
Esto crea una tarea en el Programador de Tareas de Windows que ejecuta el bot **todos los días a las 15:00 (hora argentina)**.

### Verificar la tarea creada
Abrí el **Programador de tareas** de Windows y buscá `ArgPulseTwitterBot`.

### Eliminar la tarea
```bash
schtasks /delete /tn "ArgPulseTwitterBot" /f
```

---

## 📋 Cómo obtener las credenciales de X

1. Ir a [developer.x.com](https://developer.x.com) → **Sign up for Free Account**
2. Crear una nueva App en **Projects & Apps**
3. En **App Settings** → **User authentication settings** → habilitar **Read and Write**
4. En **Keys and Tokens** → generar `API Key`, `API Secret`, `Access Token`, `Access Token Secret`, `Bearer Token`

> ⚠️ El tier **Free** de X API incluye **500 tweets/mes** (suficiente para un hilo diario de ~7 tweets = ~210/mes)

## 🔑 Cómo obtener la API Key de Google Gemini

1. Ir a [aistudio.google.com](https://aistudio.google.com/)
2. Loguearse con cuenta de Google.
3. Clic en **"Get API key"** (arriba a la izquierda).
4. Clic en **"Create API key in new project"**.

---

## 📊 Logs

Los logs se guardan en `logs/argpulse_bot.log` (rotación automática, máximo 5 archivos de 5MB).

Para ver los últimos logs en tiempo real:
```bash
Get-Content logs\argpulse_bot.log -Wait -Tail 50
```

---

## 🛡️ Características de seguridad

- ✅ Las claves API nunca se hardcodean en el código
- ✅ El archivo `.env` no debe subirse a git (añadirlo a `.gitignore`)
- ✅ Evita publicaciones duplicadas con hashing SHA-256
- ✅ Manejo completo de errores con logging detallado

---

## ☁️ Despliegue en cloud (opcional)

Para migrar a un VPS o servicio cloud:
1. Subir el proyecto al servidor (sin el `.env`, ese se configura en el servidor)
2. Configurar las variables de entorno en el servidor
3. Usar **cron** en Linux:
   ```bash
   0 18 * * * cd /ruta/argpulse-bot && python main.py
   ```
   (18:00 UTC = 15:00 Argentina)
