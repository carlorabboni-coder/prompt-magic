@echo off
REM ── Prompt Magic · attiva GitHub Pages (1 doppio-click, gratis) ──
cd /d "%~dp0"
set GH=C:\Program Files\GitHub CLI\gh.exe

"%GH%" auth status >nul 2>nul
if errorlevel 1 (
  echo.
  echo [1/3] Apro il browser per autorizzare GitHub (un click su "Authorize")...
  "%GH%" auth login -h github.com -p https -w
  if errorlevel 1 (
    echo [ERRORE] Login non completato. Rilancia questo file e completa l'autorizzazione nel browser.
    pause
    exit /b 1
  )
)

echo.
echo [2/3] Controllo GitHub Pages...
"%GH%" api repos/carlorabboni-coder/prompt-magic/pages --silent >nul 2>nul
if errorlevel 1 (
  echo Attivo Pages con sorgente "GitHub Actions"...
  "%GH%" api repos/carlorabboni-coder/prompt-magic/pages -X POST -f build_type=workflow --jq "{url: .html_url}"
) else (
  echo GitHub Pages gia attivo.
)

echo.
echo [3/3] Avvio il deploy dell'app...
"%GH%" workflow run "Deploy gratis su GitHub Pages" --repo carlorabboni-coder/prompt-magic
echo.
echo FATTO. Tra ~2 minuti l'app sara online su:
echo https://carlorabboni-coder.github.io/prompt-magic/
echo (Controlla l'avanzamento in: https://github.com/carlorabboni-coder/prompt-magic/actions)
pause
