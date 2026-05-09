@echo off
setlocal enabledelayedexpansion

title ReviewFlow - Servidor
color 0a

cd /d "C:\Users\55499\Downloads\openclode teste\saas de reviu"

echo.
echo ============================================
echo       ReviewFlow - SaaS de Avaliacoes
echo ============================================
echo.

:main
echo [1] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js_nao_instalado
    pause
    exit /b 1
)

echo [2] Verificando installacao...
if not exist "node_modules" (
    echo       Instalando dependencias...
    call npm install
)

echo [3] Fazendo build...
call npm run build >nul 2>&1

echo [4] Iniciando servidor...
echo.
echo ============================================
echo   Servidor INICIADO!
echo ============================================
echo.
echo   Acesse no navegador:
echo   http://localhost:3000
echo   http://127.0.0.1:3000
echo.
echo ============================================
echo.

rem Inicia o servidor e mantém em loop
:server
npm run start
echo.
echo Servidor_parou_ou_erro!
echo Tecle ENTER para reiniciar ou CTRL+C para sair...
pause >nul
goto :server