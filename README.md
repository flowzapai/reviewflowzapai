# ReviewFlow - Micro SaaS

Sistema de automação de avaliações no Google com IA.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis ambiente
cp .env.example .env
# Edite o .env com seus dados

# 3. Criar banco de dados
npx prisma db push

# 4. Iniciar desenvolvimento
npm run dev
```

## 📁 Estrutura

```
├── prisma/          # Schema do banco de dados
├── src/
│   ├── lib/       # Utilitários (db, auth, whatsapp)
│   ├── pages/     # Páginas Next.js
│   │   ├── api/   # API Routes
│   │   ├── avaliacao/  # Formulário de avaliação
│   │   └── dashboard/ # CRM Dashboard
│   └── styles/    # CSS Modules
└── workflows/    # Workflows n8n
```

## 🔧 Configuração Cloudfy

1. **PostgreSQL**: Configure a URL em `.env`
2. **n8n**: Importe os workflows da pasta `workflows/`
3. **Evolution API**: Configure as credenciais WhatsApp
4. **Google API**: Configure as credenciais do Google Business

## 📝 Licença

MIT