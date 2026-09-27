@echo off
REM ── Prompt Magic · avvio one-click (zero setup) ──
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo [ERRORE] Node.js non trovato. Installalo da https://nodejs.org poi rilancia questo file.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installazione dipendenze (solo la prima volta)…
  call npm install
)
echo.
echo Avvio Prompt Magic su http://localhost:5173 …
echo Chiudi questa finestra per fermare l'app.
call npm run dev
