@echo off
setlocal
cd /d "%~dp0"

echo Checking backend on http://localhost:3000/ ...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel%==0 (
    echo Backend is already running.
    goto open_frontend
)

for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Port 3000 is busy (PID %%p). Stopping stale process...
    taskkill /PID %%p /F >nul 2>nul
)

echo Starting backend in a new window...
start "Movie Dashboard API" cmd /k "cd /d \"%~dp0backend\" && npm start"
timeout /t 2 /nobreak >nul

:open_frontend
echo Opening frontend...
start "" "%~dp0index.html"

echo.
echo If login still says it cannot connect, verify PostgreSQL is running.
echo.
endlocal
