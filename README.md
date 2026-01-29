# 🚀 Telegram Bot Admin - Sistema Profissional de E-commerce

Sistema completo e moderno para gerenciamento de bot Telegram de e-commerce, com dashboard web e funcionalidades avançadas de gestão de produtos, categorias e stock.

## ✨ Funcionalidades Principais

### 🖥️ Dashboard Web
- Interface moderna e responsiva com shadcn/ui
- Estatísticas em tempo real
- Gestão completa de categorias
- Gestão completa de produtos com stock
- Filtros e busca avançados
- Alertas de stock baixo
- Sistema de notificações (toasts)

### 🤖 Bot Telegram
- Catálogo interativo por categorias
- Carrinho de compras completo
- Sistema de pedidos
- Botão /admin exclusivo para administradores
- Estatísticas em tempo real no bot
- Interface amigável com emojis

### ⚙️ Backend API
- API RESTful completa
- Gestão de categorias (CRUD)
- Gestão de produtos (CRUD)
- Atualização rápida de stock
- Estatísticas do dashboard

## 📚 Documentação Completa

Para documentação detalhada, consulte [README-TELEGRAM-BOT.md](./README-TELEGRAM-BOT.md)

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Iniciar Bot Telegram (outro terminal)
cd mini-services/telegram-bot
bun install
bun run dev
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Bot Telegram (obtenha em @BotFather)
BOT_TOKEN="seu_bot_token_aqui"
ADMIN_TELEGRAM_IDS="123456789,987654321"
API_BASE_URL="http://localhost:3000/api"
```

## 📋 Como Usar

### 1. Configurar o Database
```bash
bun run db:push
```

### 2. Acessar o Dashboard
Abra [http://localhost:3000](http://localhost:3000)

### 3. Configurar o Bot Telegram
1. Abra [@BotFather](https://t.me/botfather) no Telegram
2. Crie um novo bot com `/newbot`
3. Copie o token e adicione ao `.env`
4. Inicie o bot: `cd mini-services/telegram-bot && bun run dev`

### 4. Adicionar Administradores
1. Encontre seu ID usando [@userinfobot](https://t.me/userinfobot)
2. Adicione ao `.env`: `ADMIN_TELEGRAM_IDS="seu_id_aqui"`

## 🎯 Tecnologias Utilizadas

### 🖥️ Frontend & Dashboard
- **⚡ Next.js 16** - React framework com App Router
- **📘 TypeScript 5** - Type-safe JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS
- **🧩 shadcn/ui** - High-quality components
- **🎯 Lucide React** - Icon library
- **🌈 Framer Motion** - Animations

### 🤖 Bot Telegram
- **🤖 Grammy** - Framework para Telegram bots
- **💾 SQLite** - Banco de dados leve

### 🗄️ Backend & Database
- **🗄️ Prisma** - TypeScript ORM
- **💎 SQLite** - Banco de dados local

## 📊 Comparação com Projeto Original

Este sistema é uma evolução significativa do [BOTCC_GG](https://github.com/WorldDarkMarket/BOTCC_GG):

| Funcionalidade | BOTCC_GG | Este Sistema |
|--------------|----------|--------------|
| Dashboard Web | ❌ | ✅ Moderno & Completo |
| Gestão de Stock | Básica | ✅ Avançada com Alertas |
| Categorias | Simples | ✅ Completa com Emojis |
| Botão Admin | Simples | ✅ Painel Dedicado |
| API RESTful | ❌ | ✅ Completa |
| TypeScript | ❌ | ✅ Full-stack |
| UI/UX | Básica | ✅ Profissional |

## 🔌 API Endpoints

```
GET    /api/categories          - Listar categorias
POST   /api/categories          - Criar categoria
PUT    /api/categories/:id      - Atualizar categoria
DELETE /api/categories/:id      - Deletar categoria

GET    /api/products            - Listar produtos
POST   /api/products            - Criar produto
PUT    /api/products/:id        - Atualizar produto
DELETE /api/products/:id        - Deletar produto
PATCH  /api/products/:id        - Atualizar stock

GET    /api/dashboard/stats     - Estatísticas
```

## 💬 Comandos do Bot

### Para Todos:
- `/start` - Iniciar bot
- `/catalogo` - Ver produtos
- `/carrinho` - Ver carrinho
- `/ajuda` - Ajuda

### Para Admins:
- `/admin` - Painel administrativo

## 📁 Estrutura do Projeto

```
my-project/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── components/       # React components
│   │   │   ├── admin/        # Admin components
│   │   │   └── ui/          # shadcn/ui
│   │   ├── types/            # TypeScript types
│   │   └── page.tsx         # Dashboard
├── mini-services/
│   └── telegram-bot/         # Bot Telegram
├── prisma/
│   └── schema.prisma        # Database schema
└── db/
    └── custom.db            # SQLite database
```

## 🛡️ Segurança

- IDs de administradores configuráveis
- Verificação de permissões
- Validação de entradas
- API segura com TypeScript

## 📝 Licença

MIT License - Sinta-se livre para usar este projeto.

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Grammy**
**Powered by [Z.ai](https://chat.z.ai) 🚀**
