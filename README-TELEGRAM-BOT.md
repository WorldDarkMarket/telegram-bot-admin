# 🤖 Telegram Bot Admin - Sistema Profissional de E-commerce

Sistema completo e moderno para gerenciamento de bot Telegram de e-commerce, com dashboard web e funcionalidades avançadas de gestão de produtos, categorias e stock.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Comandos do Bot](#comandos-do-bot)

## ✨ Funcionalidades

### Dashboard Web
- ✅ Interface moderna e responsiva com shadcn/ui
- ✅ Estatísticas em tempo real
- ✅ Gestão completa de categorias
- ✅ Gestão completa de produtos com stock
- ✅ Filtros e busca avançados
- ✅ Alertas de stock baixo
- ✅ Sistema de notificações (toasts)

### Bot Telegram
- ✅ Catálogo interativo por categorias
- ✅ Carrinho de compras completo
- ✅ Sistema de pedidos
- ✅ Botão /admin exclusivo para administradores
- ✅ Estatísticas em tempo real no bot
- ✅ Interface amigável com emojis
- ✅ Suporte multi-idioma (base)

### Backend API
- ✅ API RESTful completa
- ✅ Gestão de categorias (CRUD)
- ✅ Gestão de produtos (CRUD)
- ✅ Atualização rápida de stock
- ✅ Estatísticas do dashboard
- ✅ Integração com Prisma ORM

## 🏗️ Arquitetura

```
my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   └── dashboard/
│   │   │       └── stats/route.ts
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── categories-manager.tsx
│   │   │   │   └── products-manager.tsx
│   │   │   └── ui/ (shadcn/ui components)
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── page.tsx (Dashboard principal)
│   │   └── layout.tsx
│   └── lib/
│       ├── db.ts (Prisma client)
│       └── utils.ts
├── mini-services/
│   └── telegram-bot/
│       ├── index.ts (Bot Telegram)
│       └── package.json
├── prisma/
│   └── schema.prisma
└── db/
    └── custom.db (SQLite)
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ e Bun
- Token do Bot Telegram (obtenha em [@BotFather](https://t.me/botfather))

### Passo 1: Instalar Dependências

```bash
# Instalar dependências do Next.js
bun install

# Instalar dependências do Bot Telegram
cd mini-services/telegram-bot
bun install
cd ../..
```

### Passo 2: Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Bot Telegram
BOT_TOKEN="seu_bot_token_aqui"
ADMIN_TELEGRAM_IDS="123456789,987654321"
API_BASE_URL="http://localhost:3000/api"
```

### Passo 3: Configurar o Database

```bash
# Push do schema do Prisma
bun run db:push
```

### Passo 4: Iniciar os Serviços

```bash
# Terminal 1: Dashboard Web
bun run dev

# Terminal 2: Bot Telegram
cd mini-services/telegram-bot
bun run dev
```

## ⚙️ Configuração

### Bot Telegram

Para criar um bot:

1. Abra uma conversa com [@BotFather](https://t.me/botfather)
2. Envie `/newbot`
3. Siga as instruções e escolha um nome
4. Copie o token gerado
5. Adicione ao `.env` como `BOT_TOKEN`

### Administradores

Para adicionar administradores:

1. Encontre seu Telegram ID (use [@userinfobot](https://t.me/userinfobot))
2. Adicione ao `.env` como `ADMIN_TELEGRAM_IDS` (separado por vírgulas)

### Categorias

Via dashboard web:

1. Acesse a aba "Categorias"
2. Clique em "Nova Categoria"
3. Preencha nome, descrição e emoji
4. Defina a ordem de exibição

### Produtos

Via dashboard web:

1. Acesse a aba "Produtos"
2. Clique em "Novo Produto"
3. Preencha todos os campos obrigatórios
4. Selecione uma categoria
5. Defina o stock inicial

## 📱 Uso

### Dashboard Web

1. Acesse `http://localhost:3000`
2. Navegue pelas abas:
   - **Visão Geral**: Estatísticas e alertas
   - **Produtos**: Gerenciar produtos e stock
   - **Categorias**: Gerenciar categorias
   - **Pedidos**: Ver e gerenciar pedidos

### Bot Telegram (Para Usuários)

1. Abra o bot no Telegram
2. Envie `/start` para começar
3. Use os botões ou comandos:
   - `/catalogo` - Ver produtos
   - `/carrinho` - Ver carrinho
   - `/ajuda` - Lista de comandos

### Bot Telegram (Para Admins)

1. Envie `/admin` no bot
2. Acesse as opções:
   - 📊 Estatísticas
   - 📦 Produtos
   - 🛍️ Categorias
   - 📝 Pedidos

## 🔌 API Endpoints

### Categorias

```
GET    /api/categories          - Listar todas
POST   /api/categories          - Criar categoria
GET    /api/categories/:id      - Obter categoria
PUT    /api/categories/:id      - Atualizar categoria
DELETE /api/categories/:id      - Deletar categoria
```

### Produtos

```
GET    /api/products            - Listar todos
POST   /api/products            - Criar produto
GET    /api/products?categoryId=:id - Filtrar por categoria
GET    /api/products?lowStock=true - Filtrar stock baixo
PUT    /api/products/:id        - Atualizar produto
DELETE /api/products/:id        - Deletar produto
PATCH  /api/products/:id        - Atualizar stock
```

### Dashboard

```
GET    /api/dashboard/stats     - Obter estatísticas
```

## 💬 Comandos do Bot

### Para Todos os Usuários

- `/start` - Iniciar o bot
- `/catalogo` - Ver catálogo de produtos
- `/carrinho` - Ver carrinho de compras
- `/ajuda` - Mostrar lista de comandos

### Apenas Administradores

- `/admin` - Acessar painel administrativo

## 🎯 Funcionalidades Especiais

### Gestão de Stock

- Alerta automático quando stock baixo
- Atualização rápida com +/-
- Visualização de produtos com stock baixo
- Limite de alerta configurável por produto

### Categorias

- Organização por ordem de exibição
- Emojis customizados
- Ativação/desativação
- Contagem automática de produtos

### Admin no Telegram

- Painel dedicado para admins
- Estatísticas em tempo real
- Acesso rápido às funções
- Segurança por ID do Telegram

## 🛡️ Segurança

- IDs de administradores configuráveis
- Verificação de permissões
- Não expõe dados sensíveis
- Validação de entradas

## 📊 Database Schema

```prisma
// Principais modelos
Admin          - Administradores do sistema
Category       - Categorias de produtos
Product        - Produtos com stock
TelegramUser   - Usuários do Telegram
Order          - Pedidos realizados
OrderItem      - Itens de cada pedido
```

## 🔄 Melhorias em Relação ao Projeto Original

Comparado ao [BOTCC_GG](https://github.com/WorldDarkMarket/BOTCC_GG):

1. ✅ **Interface Web Moderna** - Dashboard profissional em Next.js
2. ✅ **Gestão de Stock Simplificada** - Atualização rápida e intuitiva
3. ✅ **Categorias Organizadas** - Sistema completo de categorias com emojis
4. ✅ **Botão Admin Dedicado** - Painel exclusivo para administradores no Telegram
5. ✅ **Arquitetura Moderna** - Next.js 16 + Prisma + TypeScript
6. ✅ **API RESTful** - Backend completo e bem estruturado
7. ✅ **Design Responsivo** - Funciona em desktop e mobile
8. ✅ **Alertas em Tempo Real** - Notificações de stock baixo
9. ✅ **Filtros Avançados** - Busca e filtros por categoria/stock
10. ✅ **Código Tipado** - TypeScript para maior segurança

## 📝 Desenvolvimento Futuro

- [ ] Sistema de pagamentos
- [ ] Envio automático de produtos digitais
- [ ] Notificações push para admins
- [ ] Sistema de promoções/cupons
- [ ] Análises e relatórios detalhados
- [ ] Multi-idioma completo
- [ ] Sistema de reviews/avaliações
- [ ] Integração com gateways de pagamento

## 🤝 Contribuindo

Este é um projeto de demonstração. Sinta-se livre para fazer fork e melhorar!

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto.

## 👨‍💻 Suporte

Para dúvidas ou suporte, consulte a documentação do [Grammy](https://grammy.dev/) e [Next.js](https://nextjs.org/docs).

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Grammy**
