@echo off
REM Simple script to run the React portfolio on Windows

cd /d "%~dp0"

echo Installing dependencies...
npm install
IF %ERRORLEVEL% NEQ 0 (
  echo.
  echo npm install failed. Please check the errors above.
  pause
  exit /b 1
)

echo.
echo Starting development server on http://localhost:3000 ...
echo (Press CTRL+C in this window to stop)
echo.
npm start

