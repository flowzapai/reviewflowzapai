function Start-NoExit {
    $ErrorActionPreference = 'Continue'
    Set-Location "C:\Users\55499\Downloads\openclode teste\saas de reviu"
    $env:PORT = "3000"
    $env:HOST = "0.0.0.0"
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   ReviewFlow - Servidor Iniciado" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Acesse: http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        & npm run start
    }
    catch {
        Write-Host "Erro: $_" -ForegroundColor Red
    }
}

Start-NoExit