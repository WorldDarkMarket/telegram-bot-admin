# 🚀 Guia de Deploy - GitHub + Render

Este guia mostra como fazer o deploy do seu Telegram Bot Admin usando GitHub e Render.

## 📋 Índice

1. [Preparação no GitHub](#1-preparação-no-github)
2. [Deploy no Render](#2-deploy-no-render)
3. [Configuração de Variáveis de Ambiente](#3-configuração-de-variáveis-de-ambiente)
4. [Configuração de Domínio](#4-configuração-de-domínio)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Preparação no GitHub

### Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "+" → "New repository"
3. Nome: `telegram-bot-admin`
4. Público ou Privado (sua escolha)
5. Clique em "Create repository"

### Passo 2: Subir Código para o GitHub

No seu terminal:

```bash
# Inicializar git (se ainda não inicializado)
cd /home/z/my-project
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Telegram Bot Admin with Next.js"

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/telegram-bot-admin.git

# Subir para GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Verificar arquivos .gitignore

Certifique-se de ter um `.gitignore` completo:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Database
db/*.db
db/*.db-journal

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Render
.render/
```

---

## 2. Deploy no Render

### Passo 1: Criar Conta no Render

1. Acesse [Render](https://render.com)
2. Clique em "Sign Up"
3. Use conta GitHub para facilitar integração

### Passo 2: Criar Banco de Dados

1. No dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configuração:
   - **Name**: `telegram-bot-db`
   - **Database**: `telegram_bot`
   - **User**: `telegram_bot_user`
   - **Region**: Closer ao seu público (ex: Frankfurt)
4. Clique em "Create Database"
5. **Anote a connection string** (será usada automaticamente)

### Passo 3: Deploy do Dashboard Web (Next.js)

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. **Connect GitHub**: Conecte seu repositório
4. Configuração:
   - **Name**: `telegram-bot-dashboard`
   - **Environment**: `Node`
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `bun run start`
5. **Advanced Settings**:
   - **Instance Type**: `Free` (ou `Standard` se precisar de mais recursos)
   - **Auto-Deploy**: ✅ Ativado
6. **Environment Variables** (veja seção 3)
7. Clique em "Create Web Service"

### Passo 4: Deploy do Bot Telegram (Worker)

1. No dashboard do Render, clique em "New +"
2. Selecione "Worker" (melhor para bots que rodam continuamente)
3. **Connect GitHub**: O mesmo repositório
4. Configuração:
   - **Name**: `telegram-bot-worker`
   - **Environment**: `Node`
   - **Runtime**: `Bun`
   - **Build Command**: `cd mini-services/telegram-bot && bun install`
   - **Start Command**: `cd mini-services/telegram-bot && bun run start`
5. **Advanced Settings**:
   - **Instance Type**: `Free`
   - **Auto-Deploy**: ✅ Ativado
6. **Environment Variables** (veja seção 3)
7. Clique in "Create Worker Service"

---

## 3. Configuração de Variáveis de Ambiente

### Dashboard Web (Next.js)

No painel do Render → telegram-bot-dashboard → Environment:

```bash
# Database (Render cria automaticamente)
DATABASE_URL=postgresql://telegram_bot_user:senha@db.telegram-bot-db.render.com/telegram_bot

# Bot Telegram
BOT_TOKEN=seu_bot_token_aqui

# IDs dos Admins
ADMIN_TELEGRAM_IDS=123456789,987654321

# API URL (IMPORTANTE: use a URL real do seu serviço Render)
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api

# Node Environment
NODE_ENV=production
```

### Bot Telegram (Worker)

No painel do Render → telegram-bot-worker → Environment:

```bash
# Bot Telegram
BOT_TOKEN=seu_bot_token_aqui

# IDs dos Admins
ADMIN_TELEGRAM_IDS=123456789,987654321

# API URL (DEVE ser a URL do Dashboard Web)
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api

# Node Environment
NODE_ENV=production
```

### Importante Sobre API_BASE_URL

**Em desenvolvimento:**
```bash
API_BASE_URL="http://localhost:3000/api"
```

**Em produção (Render):**
```bash
# Substitua "telegram-bot-dashboard" pelo nome real do seu serviço
API_BASE_URL="https://telegram-bot-dashboard.onrender.com/api"
```

**Com domínio customizado:**
```bash
# Se você configurar um domínio próprio
API_BASE_URL="https://bot.seudominio.com/api"
```

---

## 4. Configuração de Domínio

### Opção 1: Domínio Padrão do Render

Render fornece automaticamente:
- Dashboard: `https://telegram-bot-dashboard.onrender.com`
- Bot API: `https://telegram-bot-dashboard.onrender.com/api`

### Opção 2: Domínio Customizado (Subdomínio)

1. **Comprar domínio** (ex: em Namecheap, GoDaddy, etc.)
2. **No Render**, vá ao serviço → Settings → Custom Domains
3. Adicione domínio: `bot.seudominio.com`
4. Render vai mostrar DNS records para configurar

**Exemplo de configuração DNS:**

| Tipo | Host | Valor |
|------|------|-------|
| CNAME | bot | telegram-bot-dashboard.onrender.com |

### Opção 3: Domínio Customizado (Root)

Para usar `seudominio.com` ao invés de subdomínio:

1. Adicionar domínio root no Render
2. Render mostrará DNS records

**Exemplo de configuração DNS:**

| Tipo | Host | Valor |
|------|------|-------|
| A | @ | 76.76.21.21 (Render IP) |
| CNAME | www | telegram-bot-dashboard.onrender.com |

### Atualizar API_BASE_URL com Domínio Customizado

Se usar domínio customizado, atualize as variáveis de ambiente no Render:

```bash
# No Dashboard Web
API_BASE_URL="https://bot.seudominio.com/api"

# No Bot Telegram Worker
API_BASE_URL="https://bot.seudominio.com/api"
```

---

## 5. Troubleshooting

### Erro: "Cannot find module"

**Solução:** Verifique se `bun install` está no build command.

### Erro: "DATABASE_URL not found"

**Solução:** Configure a variável DATABASE_URL no Render e conecte o banco de dados.

### Erro: "API request failed"

**Solução:** Verifique se API_BASE_URL está correto (HTTPS, não HTTP).

### Bot não responde

**Verificar:**
1. Se o Worker service está rodando (Logs no Render)
2. Se BOT_TOKEN está correto
3. Se API_BASE_URL está correto
4. Se o Dashboard Web está acessível

### Build falha

**Verificar:**
1. Logs de build no Render
2. Se todas as dependências estão no package.json
3. Se scripts de build/start estão corretos

### Deploy automático não funciona

**Solução:** Verifique se "Auto-Deploy" está ativado nas configurações do serviço.

---

## 🔄 CI/CD com GitHub Actions (Opcional)

Para automatizar testes antes do deploy, crie `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
```

---

## 📊 Monitoramento

### Ver Logs no Render

1. Dashboard → telegram-bot-dashboard → Logs
2. Dashboard → telegram-bot-worker → Logs

### Métricas

Render fornece:
- CPU usage
- Memory usage
- Response time
- Error rate

---

## 💰 Custos (Free Tier do Render)

**Plano Free:**
- ✅ Web Service: 750 horas/mês (suficiente para 1 serviço)
- ✅ Worker: 512 MB RAM, 0.1 CPU
- ✅ PostgreSQL: 90 dias (após isso, dados são apagados - fazer backup)

**Para produção:**
- **Standard ($7/mês)**: Serviço web mais robusto
- **Pro Postgres ($7/mês)**: Banco de dados persistente

---

## 🔒 Segurança

1. **Nunca** fazer commit de `.env` com credenciais reais
2. Usar variáveis de ambiente no Render
3. Configurar webhook para updates automáticos (opcional)
4. Limitar ADMIN_TELEGRAM_IDS a IDs confiáveis

---

## 🚀 Pós-Deploy Checklist

- [ ] Dashboard acessível via HTTPS
- [ ] Bot Telegram respondendo comandos
- [ ] Criar primeira categoria
- [ ] Adicionar primeiro produto
- [ ] Testar comando /admin no Telegram
- [ ] Verificar logs no Render
- [ ] Configurar domínio customizado (opcional)
- [ ] Setar backup automático do banco de dados

---

## 📚 Recursos Úteis

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Grammy Documentation](https://grammy.dev/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/)

---

**Pronto! Seu bot está online no Render! 🎉**
