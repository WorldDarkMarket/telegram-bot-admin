# 📋 Guia Rápido - GitHub + Render

## 🎯 O Que Fazer Agora

### 1️⃣ Preparar o GitHub

```bash
# Verificar arquivos antes do commit
git status

# Adicionar tudo
git add .

# Commit inicial
git commit -m "feat: Initial commit - Telegram Bot Admin with Next.js and Grammy"

# Criar repositório no GitHub: https://github.com/new

# Adicionar remote e fazer push
git remote add origin https://github.com/WorldDarkMarket/telegram-bot-admin.git
git branch -M main
git push -u origin main
```

### 2️⃣ Configurar Render

**Acessar:** https://render.com

#### Passo A: Criar Banco de Dados
1. "New +" → "PostgreSQL"
2. Name: `telegram-bot-db`
3. Database: `telegram_bot`
4. Region: A mais perto dos seus usuários
5. Criar e **anote a connection string**

#### Passo B: Deploy Dashboard (Next.js)
1. "New +" → "Web Service"
2. Connect: seu repositório GitHub
3. Name: `telegram-bot-dashboard`
4. Environment: Node
5. Build: `bun install && bun run build`
6. Start: `bun run start`

**Variáveis de Ambiente:**
```bash
DATABASE_URL=postgresql://... (criado pelo Render)
BOT_TOKEN=seu_bot_token_do_botfather
ADMIN_TELEGRAM_IDS=seu_telegram_id
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api
```

#### Passo C: Deploy Bot (Worker)
1. "New +" → "Worker"
2. Connect: mesmo repositório GitHub
3. Name: `telegram-bot-worker`
4. Environment: Node
5. Runtime: Bun
6. Build: `cd mini-services/telegram-bot && bun install`
7. Start: `cd mini-services/telegram-bot && bun run start`

**Variáveis de Ambiente:**
```bash
BOT_TOKEN=seu_bot_token_do_botfather
ADMIN_TELEGRAM_IDS=seu_telegram_id
API_BASE_URL=https://telegram-bot-dashboard.onrender.com/api
```

### 3️⃣ Obter Token e ID

**Token do Bot:**
1. Abrir [@BotFather](https://t.me/botfather) no Telegram
2. Enviar `/newbot`
3. Seguir instruções
4. Copiar o token

**Seu Telegram ID:**
1. Abrir [@userinfobot](https://t.me/userinfobot)
2. Enviar qualquer mensagem
3. Copiar seu ID

### 4️⃣ Sobre API_BASE_URL

**❌ ERRADO:**
```bash
API_BASE_URL="http://localhost:3000/api"
```

**✅ CORRETO (Produção):**
```bash
# Substitua pelo nome real do seu serviço
API_BASE_URL="https://telegram-bot-dashboard.onrender.com/api"
```

**✅ CORRETO (Com domínio customizado):**
```bash
API_BASE_URL="https://bot.seudominio.com/api"
```

**🔑 IMPORTANTE:**
- Deve usar **HTTPS**
- Deve ser a URL real do serviço Render
- Deve terminar com `/api`
- Deve ser a MESMA URL em ambos os serviços (Dashboard e Bot)

### 5️⃣ Subdomínio vs Domínio

**Opção 1: Domínio Padrão Render (Grátis)**
```
https://telegram-bot-dashboard.onrender.com
```

**Opção 2: Subdomínio (Necessita domínio comprado)**
```
https://bot.seudominio.com

Configuração DNS:
Tipo: CNAME
Host: bot
Valor: telegram-bot-dashboard.onrender.com
```

**Opção 3: Domínio Root (Necessita domínio comprado)**
```
https://seudominio.com

Configuração DNS:
Tipo: A
Host: @
Valor: 76.76.21.21
```

---

## ⚠️ Perguntas Frequentes

### Q: Preciso comprar domínio?
**R:** Não obrigatório. Render fornece domínio grátis: `seu-servico.onrender.com`

### Q: Posso usar localhost em produção?
**R:** NÃO! Use sempre a URL real do Render ou seu domínio.

### Q: API_BASE_URL é a mesma nos dois serviços?
**R:** SIM! Dashboard e Bot devem usar a mesma URL.

### Q: O que fazer se deploy falhar?
**R:** Checar logs no Render → Service → Logs

### Q: Como testar após deploy?
**R:**
1. Acesse dashboard: `https://seu-servico.onrender.com`
2. Abra bot no Telegram: `/start`
3. Como admin: `/admin`

---

## 🎉 Checklist de Deploy

- [ ] Código no GitHub
- [ ] Banco PostgreSQL criado
- [ ] Dashboard Web deployado
- [ ] Bot Worker deployado
- [ ] Variáveis de ambiente configuradas
- [ ] BOT_TOKEN correto
- [ ] ADMIN_TELEGRAM_IDS correto
- [ ] API_BASE_URL correto (HTTPS)
- [ ] Dashboard acessível
- [ ] Bot respondendo
- [ ] Testar /start
- [ ] Testar /admin
- [ ] Criar categoria
- [ ] Adicionar produto
- [ ] Testar fluxo completo

---

## 📞 Suporte

- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Grammy Docs:** https://grammy.dev/
- **Telegram API:** https://core.telegram.org/bots/api

---

**Boa sorte com o deploy! 🚀**
