# ReviewFlow - Deploy na Cloudfy

## Preparar o projeto

1. Verifique se tem todos os arquivos necessários
2. Configure as variáveis ambiente no painel da Cloudfy

## Variáveis ambiente necessárias

No painel da Cloudfy, configure:

```
DATABASE_URL=postgresql://postgres:zeRZo9phWB6qChUWuepb@flowzapai-postgres.cloudfy.live:8653/db?schema=reviewflow
PORT=3000
NODE_ENV=production
NEXTAUTH_SECRET=reviewflow-secret-2024
```

## Deploy via Painel Cloudfy

1. Acesse: https://cloudfy.space
2. Faça login
3. Vá em "Novo Projeto" ou "Deploy"
4. Selecione "Node.js"
5. Faça upload dos arquivos (zip ou via Git)
6. Configure as variáveis ambiente acima
7. Execute: `npm run build && npm start`

## Deploy via API (sfapi)

```bash
# Criar pacote
cd C:\Users\55499\Downloads\openclode teste\saas de reviu
Compress-Archive -Path * -DestinationPath reviewflow.zip

# Enviar para Cloudfy (use o painel ou CLI)
```

## Verificar se tudo está funcionando

Após deploy, akses:
- http://SEU-DOMINIO.cloudfy.live/register
- http://SEU-DOMINIO.cloudfy.live/login
- http://SEU-DOMINIO.cloudfy.live/dashboard

## Troubleshooting

Se der erro no banco:
1. Verifique DATABASE_URL
2. Execute as tabelas: `node create-tables.js`
3. Verifique se o schema "reviewflow" existe

---

**Nota:** O banco PostgreSQL já está configurado na Cloudfy. 
As tabelas precisam ser criadas uma vez com o script `create-tables.js`