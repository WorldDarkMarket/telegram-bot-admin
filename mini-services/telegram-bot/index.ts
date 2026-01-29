import { Bot, InlineKeyboard } from 'grammy'

// Configurações
const BOT_TOKEN = process.env.BOT_TOKEN || ''
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api'
const ADMIN_TELEGRAM_IDS = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(id => id.trim()) || []

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN não definido!')
  process.exit(1)
}

// Criar bot
const bot = new Bot(BOT_TOKEN)

// Tipos
interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category?: {
    name: string
    emoji?: string
  }
  imageUrl?: string
}

interface Category {
  id: string
  name: string
  emoji?: string
  isActive: boolean
}

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  lowStockItems: number
  pendingOrders: number
}

// Carrinho por usuário
const carts = new Map<number, Map<string, number>>()

// Função para buscar dados da API
async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    if (!response.ok) {
      console.error(`API Error: ${endpoint} - ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return null
  }
}

// Verificar se usuário é admin
function isAdmin(userId: number): boolean {
  return ADMIN_TELEGRAM_IDS.includes(userId.toString())
}

// Obter carrinho do usuário
function getUserCart(userId: number): Map<string, number> {
  if (!carts.has(userId)) {
    carts.set(userId, new Map())
  }
  return carts.get(userId)!
}

// Calcular total do carrinho
function getCartTotal(userId: number, products: Product[]): number {
  const cart = getUserCart(userId)
  let total = 0
  cart.forEach((quantity, productId) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      total += product.price * quantity
    }
  })
  return total
}

// Botão Admin
bot.command('admin', async (ctx) => {
  const userId = ctx.from?.id

  if (!userId || !isAdmin(userId)) {
    await ctx.reply('❌ Acesso não autorizado. Comando apenas para administradores.')
    return
  }

  const adminKeyboard = new InlineKeyboard()
    .text('📊 Estatísticas', 'admin_stats')
    .row()
    .text('📦 Produtos', 'admin_products')
    .row()
    .text('🛍️ Categorias', 'admin_categories')
    .row()
    .text('📝 Pedidos', 'admin_orders')

  await ctx.reply('👨‍💼 *Painel Admin*\n\nSelecione uma opção:', {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard
  })
})

// /start - Comando inicial
bot.command('start', async (ctx) => {
  const userId = ctx.from?.id
  const username = ctx.from?.username
  const firstName = ctx.from?.first_name

  if (!userId) return

  const welcomeMessage = `
🎉 Bem-vindo ao nosso bot de compras!

Aqui você encontrará os melhores produtos e ofertas.

*Nossas Funcionalidades:*
🛒 Catálogo completo
🛍️ Carrinho de compras
📦 Acompanhamento de pedidos
🔔 Notificações de ofertas

Para começar, selecione uma categoria abaixo ou use os comandos:
• /catalogo - Ver produtos
• /carrinho - Ver seu carrinho
• /ajuda - Lista de comandos

*Administradores:*
• /admin - Painel administrativo
  `

  const keyboard = new InlineKeyboard()
    .text('🛍️ Ver Catálogo', 'view_catalog')
    .row()
    .text('🛒 Meu Carrinho', 'view_cart')

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
})

// /catalogo - Ver catálogo
bot.command('catalogo', async (ctx) => {
  const categories = await fetchAPI('/categories?active=true')

  if (!categories || categories.length === 0) {
    await ctx.reply('❌ Nenhuma categoria disponível no momento.')
    return
  }

  const keyboard = new InlineKeyboard()
  categories.forEach((cat: Category) => {
    keyboard.text(`${cat.emoji || '📦'} ${cat.name}`, `cat_${cat.id}`).row()
  })
  keyboard.text('🔄 Atualizar', 'view_catalog').row()
  keyboard.text('🏠 Menu Principal', 'main_menu')

  let message = '*📦 Catálogo de Produtos*\n\n'
  message += 'Selecione uma categoria para ver os produtos:\n\n'

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
})

// /carrinho - Ver carrinho
bot.command('carrinho', async (ctx) => {
  await showCart(ctx)
})

// Ajuda
bot.command('ajuda', async (ctx) => {
  const helpMessage = `
*📚 Lista de Comandos*

*Comandos Gerais:*
/start - Iniciar o bot
/catalogo - Ver catálogo de produtos
/carrinho - Ver carrinho de compras
/ajuda - Mostrar esta mensagem

*Comandos de Administrador:*
/admin - Painel administrativo (apenas admins)

Para navegar, você também pode usar os botões inline.
  `

  await ctx.reply(helpMessage, { parse_mode: 'Markdown' })
})

// Callback queries
bot.callbackQuery('main_menu', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('🛍️ Ver Catálogo', 'view_catalog')
    .row()
    .text('🛒 Meu Carrinho', 'view_cart')

  await ctx.editMessageText('🏠 *Menu Principal*\n\nEscolha uma opção:', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
  await ctx.answerCallbackQuery()
})

bot.callbackQuery('view_catalog', async (ctx) => {
  const categories = await fetchAPI('/categories?active=true')

  if (!categories || categories.length === 0) {
    await ctx.answerCallbackQuery('❌ Nenhuma categoria disponível')
    return
  }

  const keyboard = new InlineKeyboard()
  categories.forEach((cat: Category) => {
    keyboard.text(`${cat.emoji || '📦'} ${cat.name}`, `cat_${cat.id}`).row()
  })
  keyboard.text('🔄 Atualizar', 'view_catalog').row()
  keyboard.text('🏠 Menu Principal', 'main_menu')

  let message = '*📦 Catálogo de Produtos*\n\n'
  message += 'Selecione uma categoria para ver os produtos:\n\n'

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
  await ctx.answerCallbackQuery()
})

bot.callbackQuery(/^cat_(.+)$/, async (ctx) => {
  const categoryId = ctx.match![1]
  const categories = await fetchAPI('/categories?active=true')
  const category = categories?.find((c: Category) => c.id === categoryId)

  if (!category) {
    await ctx.answerCallbackQuery('❌ Categoria não encontrada')
    return
  }

  const products = await fetchAPI(`/products?categoryId=${categoryId}&active=true`)

  if (!products || products.length === 0) {
    await ctx.editMessageText(
      `❌ Nenhum produto disponível na categoria *${category.name}*`,
      { parse_mode: 'Markdown' }
    )
    await ctx.answerCallbackQuery()
    return
  }

  let message = `*${category.emoji || '📦'} ${category.name}*\n\n`

  products.forEach((product: Product, index: number) => {
    const stockStatus = product.stock > 0 ? `✅ ${product.stock} un.` : `❌ Esgotado`
    message += `${index + 1}. *${product.name}*\n`
    message += `   💰 €${product.price.toFixed(2)} | ${stockStatus}\n`
    if (product.description) {
      message += `   📝 ${product.description}\n`
    }
    message += '\n'
  })

  const keyboard = new InlineKeyboard()
  products.forEach((product: Product) => {
    keyboard.text(`Add ${product.name.substring(0, 15)}...`, `add_${product.id}`).row()
  })
  keyboard.row()
  keyboard.text('🛒 Ver Carrinho', 'view_cart')
  keyboard.text('📦 Voltar Catálogo', 'view_catalog')

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
  await ctx.answerCallbackQuery()
})

bot.callbackQuery(/^add_(.+)$/, async (ctx) => {
  const productId = ctx.match![1]
  const products = await fetchAPI(`/products?active=true`)
  const product = products?.find((p: Product) => p.id === productId)

  if (!product) {
    await ctx.answerCallbackQuery('❌ Produto não encontrado')
    return
  }

  if (product.stock <= 0) {
    await ctx.answerCallbackQuery('❌ Produto esgotado')
    return
  }

  const userId = ctx.from?.id
  if (!userId) return

  const cart = getUserCart(userId)
  const currentQuantity = cart.get(productId) || 0

  if (currentQuantity >= product.stock) {
    await ctx.answerCallbackQuery('❌ Quantidade máxima disponível atingida')
    return
  }

  cart.set(productId, currentQuantity + 1)
  await ctx.answerCallbackQuery(`✅ ${product.name.substring(0, 20)}... adicionado!`)
})

bot.callbackQuery('view_cart', async (ctx) => {
  await showCart(ctx)
  await ctx.answerCallbackQuery()
})

bot.callbackQuery(/^remove_(.+)$/, async (ctx) => {
  const productId = ctx.match![1]
  const userId = ctx.from?.id
  if (!userId) return

  const cart = getUserCart(userId)
  cart.delete(productId)

  await showCart(ctx)
  await ctx.answerCallbackQuery('✅ Item removido!')
})

bot.callbackQuery(/^clear_cart$/, async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return

  carts.delete(userId)

  await ctx.editMessageText('🛒 *Seu Carrinho*\n\n✅ Carrinho limpo!', {
    parse_mode: 'Markdown',
    reply_markup: new InlineKeyboard()
      .text('📦 Ver Catálogo', 'view_catalog')
      .text('🏠 Menu Principal', 'main_menu')
  })
  await ctx.answerCallbackQuery('✅ Carrinho limpo!')
})

bot.callbackQuery(/^checkout$/, async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return

  const cart = getUserCart(userId)

  if (cart.size === 0) {
    await ctx.answerCallbackQuery('❌ Carrinho vazio')
    return
  }

  const products = await fetchAPI('/products?active=true') || []
  let total = 0
  let itemsList = ''

  cart.forEach((quantity, productId) => {
    const product = products.find((p: Product) => p.id === productId)
    if (product) {
      total += product.price * quantity
      itemsList += `${quantity}x ${product.name} - €${(product.price * quantity).toFixed(2)}\n`
    }
  })

  const message = `*📝 Confirmação do Pedido*\n\n` +
    `*Itens:*\n${itemsList}\n` +
    `*Total: €${total.toFixed(2)}*\n\n` +
    `Para confirmar o pedido, envie seus dados de entrega ou contate o suporte.`

  const keyboard = new InlineKeyboard()
    .text('✅ Confirmar', 'confirm_order')
    .text('❌ Cancelar', 'clear_cart')

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
  await ctx.answerCallbackQuery()
})

bot.callbackQuery('confirm_order', async (ctx) => {
  await ctx.editMessageText(
    '📝 *Criar Pedido*\n\n' +
    'Para finalizar seu pedido, por favor envie:\n' +
    '• Seu nome completo\n' +
    '• Endereço de entrega\n' +
    '• Método de pagamento preferido\n\n' +
    'Aguardando sua resposta...',
    { parse_mode: 'Markdown' }
  )
  await ctx.answerCallbackQuery()
})

// Admin callbacks
bot.callbackQuery(/^admin_(.+)$/, async (ctx) => {
  const action = ctx.match![1]
  const userId = ctx.from?.id

  if (!userId || !isAdmin(userId)) {
    await ctx.answerCallbackQuery('❌ Acesso negado')
    return
  }

  switch (action) {
    case 'stats':
      await showAdminStats(ctx)
      break
    case 'products':
      await ctx.reply('📦 Para gerenciar produtos, acesse o painel web:\n\n' +
        `${API_BASE_URL.replace('/api', '')}`)
      break
    case 'categories':
      await ctx.reply('🛍️ Para gerenciar categorias, acesse o painel web:\n\n' +
        `${API_BASE_URL.replace('/api', '')}`)
      break
    case 'orders':
      await ctx.reply('📝 Para gerenciar pedidos, acesse o painel web:\n\n' +
        `${API_BASE_URL.replace('/api', '')}`)
      break
  }
  await ctx.answerCallbackQuery()
})

// Função para mostrar carrinho
async function showCart(ctx: any) {
  const userId = ctx.from?.id
  if (!userId) return

  const cart = getUserCart(userId)

  if (cart.size === 0) {
    const keyboard = new InlineKeyboard()
      .text('📦 Ver Catálogo', 'view_catalog')
      .text('🏠 Menu Principal', 'main_menu')

    await ctx.editMessageText('🛒 *Seu Carrinho*\n\n📭 Carrinho vazio', {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
    return
  }

  const products = await fetchAPI('/products?active=true') || []
  let message = '🛒 *Seu Carrinho*\n\n'
  let total = 0

  cart.forEach((quantity, productId) => {
    const product = products.find((p: Product) => p.id === productId)
    if (product) {
      const subtotal = product.price * quantity
      total += subtotal
      message += `${quantity}x *${product.name}*\n`
      message += `   €${subtotal.toFixed(2)}\n\n`
    }
  })

  message += `*Total: €${total.toFixed(2)}*`

  const keyboard = new InlineKeyboard()
  cart.forEach((_, productId) => {
    const product = products.find((p: Product) => p.id === productId)
    if (product) {
      keyboard.text(`🗑️ ${product.name.substring(0, 15)}...`, `remove_${productId}`).row()
    }
  })
  keyboard.text('🗑️ Limpar Carrinho', 'clear_cart').row()
  keyboard.text('✅ Finalizar Pedido', 'checkout').row()
  keyboard.text('📦 Continuar Comprando', 'view_catalog')

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
}

// Função para mostrar estatísticas do admin
async function showAdminStats(ctx: any) {
  const stats = await fetchAPI('/dashboard/stats')

  if (!stats) {
    await ctx.reply('❌ Erro ao carregar estatísticas')
    return
  }

  const message = `*📊 Estatísticas do Sistema*\n\n` +
    `📦 Produtos: ${stats.totalProducts}\n` +
    `🛍️ Categorias: ${stats.totalCategories}\n` +
    `📝 Pedidos: ${stats.totalOrders}\n` +
    `💰 Receita: €${stats.totalRevenue.toFixed(2)}\n` +
    `⚠️ Stock Baixo: ${stats.lowStockItems}\n` +
    `⏳ Pendentes: ${stats.pendingOrders}`

  const keyboard = new InlineKeyboard()
    .text('🔄 Atualizar', 'admin_stats')
    .text('⬅️ Voltar', 'main_menu')

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
}

// Error handling
bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error for ${ctx.update.update_id}:`, err.error)
})

// Start bot
console.log('🤖 Iniciando bot Telegram...')
console.log(`📡 Admin IDs: ${ADMIN_TELEGRAM_IDS.join(', ') || 'Nenhum configurado'}`)
console.log(`🔗 API URL: ${API_BASE_URL}`)

bot.start({
  onStart(botInfo) {
    console.log(`✅ Bot iniciado com sucesso!`)
    console.log(`🤖 Nome: ${botInfo.first_name}`)
    console.log(`👤 Username: @${botInfo.username}`)
  },
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Parando bot...')
  bot.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Parando bot...')
  bot.stop()
  process.exit(0)
})
