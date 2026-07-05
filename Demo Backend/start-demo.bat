@echo off
setlocal
cd /d "%~dp0"

echo Starting OrionOps Demo Backend on http://127.0.0.1:8000
echo.
echo Make sure the frontend Vite proxy points to port 8000.
echo Stop the real ADK backend before starting this demo server.
echo.

python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
