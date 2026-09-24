@echo off
cd /d "%~dp0.."
echo Starting LightRAG server...
echo Indexing: Claude Code auto-memory store for this project
echo Server: http://localhost:9623
echo Swagger: http://localhost:9623/docs
echo.
echo Press Ctrl+C to stop.
echo.

REM --- Load .lightrag.env by setting each variable ---
REM    (lightrag-server reads .env from cwd; we SET vars instead
REM     so the project-root .env files for Node are not affected)
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".lightrag.env") do (
    if not "%%A"=="" if not "%%B"=="" set "%%A=%%B"
)

REM --- lightrag-server >=1.5.3 prints a Unicode banner that crashes on the
REM     default Windows console codepage (cp1252) unless forced to UTF-8 ---
set PYTHONIOENCODING=utf-8

REM --- lightrag-server also loads the project root .env (it requires one to
REM     exist at all, for its multi-instance check) and reads LOG_LEVEL from
REM     it too — but expects an uppercase Python logging level, while
REM     .env.example sets LOG_LEVEL=info (lowercase, for Winston) and crashes
REM     lightrag-server on startup. python-dotenv does not override an
REM     already-set process env var, so pre-setting it here wins regardless
REM     of what's in .env. ---
set LOG_LEVEL=INFO

call .lightrag-venv\Scripts\activate
lightrag-server ^
    --host 127.0.0.1 ^
    --port 9623 ^
    --working-dir .lightrag ^
    --input-dir "%INPUT_DIR%" ^
    --llm-binding openai ^
    --embedding-binding openai
