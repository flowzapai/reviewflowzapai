Write-Host "Iniciando servidor Next.js..." -ForegroundColor Green
cd "C:\Users\55499\Downloads\openclode teste\saas de reviu"

$env:DATABASE_URL = "postgresql://postgres:zeRZo9phWB6qChUWuepb@flowzapai-postgres.cloudfy.live:8653/db"
$env:PORT = "3000"

& npm run start

Write-Host "`nServidor iniciado em http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para encerrar" -ForegroundColor Yellow