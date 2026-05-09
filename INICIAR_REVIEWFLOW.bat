@echo off
echo ==========================================
echo      ReviewFlow - Iniciando...
echo ==========================================
echo.
cd /d "%~dp0"
echo 1. Fazendo build...
call npm run build
echo.
echo 2. Iniciando servidor...
start /b npm run start
echo.
echo 3. Abrindo navegador...
timeout /t 3 /nobreak >nul
start http://localhost:3000/register
echo.
echo ==========================================
echo Servidor iniciado em http://localhost:3000
echo ==========================================
pause