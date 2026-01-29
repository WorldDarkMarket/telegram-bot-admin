# 🚀 Telegram Bot Admin - Deploy Guide

Sistema completo e moderno para gerenciamento de bot Telegram de e-commerce.

## 📦 Quick Start - Deploy no Render

### 🎯 Resumo Rápido

1. **Fazer push para o GitHub**
2. **Criar banco PostgreSQL no Render**
3. **Deploy Dashboard Web (Next.js)**
4. **Deploy Bot Telegram (Worker)**
5. **Configurar variáveis de ambiente**

> **Leia o guia completo:** [DEPLOY-RENDER.md](./DEPLOY-RENDER.md)

---

## 🌐 Estrutura do Projeto

```
telegram-bot-admin/
├── src/                          # Next.js App
│   ├── app/
│   │   ├── api/                  # API Routes
│   │   │   ├── categories/       # CRUD Categorias
│   │   │   ├── products/        # CRUD Produtos
│   │   │   └── dashboard/       # Stats
│   │   ├── components/
│   │   │   ├── admin/           # Admin Components
│   │   │   └── ui/              # shadcn/ui
│   │   └── page.tsx             # Dashboard Principal
│   └── lib/
│       └── db.ts                 # Prisma Client
├── mini-services/
│   └── telegram-bot/             # Bot Telegram (Grammy)
│       ├── index.ts
│       └── package.json
├── prisma/
│   └── schema.prisma            # Database Schema
└── render.yaml                  # Configuração Render
```

---

## 🎨 Funcionalidades

### Dashboard Web
- ✅ Interface moderna com shadcn/ui
- ✅ Gestão completa de categorias
- ✅ Gestão de produtos com stock
- ✅ Filtros e busca avançados
- ✅ Alertas de stock baixo
- ✅ Estatísticas em tempo real

### Bot Telegram
- ✅ Catálogo interativo por categorias
- ✅ Carrinho de compras
- ✅ Sistema de pedidos
- ✅ **Botão /admin exclusivo**
- ✅ Estatísticas para admins
- ✅ Interface amigável

---

## ⚙️ Configuração

### Variáveis de Ambiente

**Desenvolvimento (.env):**
```env
DATABASE_URL="file:./db/custom.db"
BOT_TOKEN="seu_bot_token"
ADMIN_TELEGRAM_IDS="123456789"
API_BASE_URL="http://localhost:3000/api"
```

**Produção (Render):**
```env
DATABASE_URL="postgresql://..."  # Render cria automaticamente
BOT_TOKEN="seu_bot_token"
ADMIN_TELEGRAM_IDS="123456789"
API_BASE_URL="https://seu-bot.onrender.com/api"
```

---

## 🚀 Deploy no Render

### Passo 1: GitHub

```bash
# Inicializar e push
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USER/telegram-bot-admin.git
git push -u origin main
```

### Passo 2: Render Services

**Serviços necessários:**

1. **PostgreSQL Database**
   - Name: `telegram-bot-db`

2. **Web Service (Next.js)**
   - Name: `telegram-bot-dashboard`
   - Build: `bun install && bun run build`
   - Start: `bun run start`

3. **Worker Service (Bot)**
   - Name: `telegram-bot-worker`
   - Build: `cd mini-services/telegram-bot && bun install`
   - Start: `cd mini-services/telegram-bot && bun run start`

### Passo 3: Configurar Variáveis

No painel do Render para cada serviço:

**Dashboard Web:**
```bash
DATABASE_URL=postgresql://...
BOT_TOKEN=seu_token
ADMIN_TELEGRAM_IDS=123456789
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api
```

**Bot Worker:**
```bash
BOT_TOKEN=seu_token
ADMIN_TELEGRAM_IDS=123456789
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api
```

> **IMPORTANTE:** API_BASE_URL deve usar HTTPS e a URL real do Render!

---

## 🌐 Domínio Customizado

### Opção 1: Domínio Padrão (Grátis)
```
https://telegram-bot-dashboard.onrender.com
```

### Opção 2: Subdomínio
1. Comprar domínio: `seudominio.com`
2. Adicionar no Render: `bot.seudominio.com`
3. Configurar DNS:
   ```
   CNAME bot -> telegram-bot-dashboard.onrender.com
   ```

### Opção 3: Domínio Root
Configurar DNS:
```
A @ -> 76.76.21.21
CNAME www -> telegram-bot-dashboard.onrender.com
```

**Atualizar API_BASE_URL:**
```bash
API_BASE_URL="https://bot.seudominio.com/api"
```

---

## 💬 Comandos do Bot

### Para Todos
- `/start` - Iniciar
- `/catalogo` - Ver produtos
- `/carrinho` - Ver carrinho
- `/ajuda` - Ajuda

### Admins
- `/admin` - Painel administrativo

---

## 📊 API Endpoints

```
GET  /api/categories          - Listar categorias
POST /api/categories          - Criar categoria
PUT  /api/categories/:id      - Atualizar
DEL  /api/categories/:id      - Deletar

GET  /api/products            - Listar produtos
POST /api/products            - Criar produto
PUT  /api/products/:id        - Atualizar
DEL  /api/products/:id        - Deletar
PATCH /api/products/:id        - Atualizar stock

GET  /api/dashboard/stats     - Estatísticas
```

---

## 🔍 Troubleshooting

### Bot não responde
- Verificar se Worker está rodando (Logs no Render)
- Checar API_BASE_URL correto
- Verificar BOT_TOKEN

### API request failed
- Usar HTTPS em API_BASE_URL
- Verificar se Dashboard está acessível

### Build falha
- Verificar logs de build
- Checar scripts em package.json

---

## 💰 Custos (Free Tier)

- ✅ Web Service: 750h/mês (1 serviço free)
- ✅ Worker: 512MB RAM, 0.1 CPU (free)
- ✅ PostgreSQL: 90 dias (free)

**Para produção:**
- Standard Web: $7/mês
- Pro Postgres: $7/mês

---

## 📚 Documentação Completa

- [Guia detalhado de deploy](./DEPLOY-RENDER.md)
- [Documentação do projeto](./README-TELEGRAM-BOT.md)
- [Render Docs](https://render.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Grammy Docs](https://grammy.dev/)

---

## 🎉 Pós-Deploy

- [ ] Dashboard acessível via HTTPS
- [ ] Bot respondendo comandos
- [ ] Criar primeira categoria
- [ ] Adicionar primeiro produto
- [ ] Testar /admin no Telegram
- [ ] Configurar domínio customizado

---

**Desenvolvido com Next.js, TypeScript, Grammy e Prisma** 🚀
