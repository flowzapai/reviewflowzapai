@echo off
setlocal

cd /d "C:\Users\55499\Downloads\openclode teste\saas de reviu"

title ReviewFlow Servidor

echo ============================================
echo    ReviewFlow - Servidor
echo ============================================
echo.

echo 1. Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js_nao_encontrado
    pause
    exit /b 1
)

echo 2. Fazendo build...
call npm run build
if errorlevel 1 (
    echo ERRO_no_build
    pause
    exit /b 1
)

echo.
echo 3. Iniciando servidor...
echo.
echo Acesse: http://localhost:3000/register
echo.
echo Pressione Ctrl+C para encerrar
echo.

rem Executa e mantém ativo
npm run start

pause