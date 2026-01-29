export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Admin {
  id: string
  telegramId: string
  name: string
  email?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string | null
  emoji?: string | null
  order: number
  isActive: boolean
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  lowStockAlert: number
  categoryId: string
  category?: Category
  isActive: boolean
  imageUrl?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface TelegramUser {
  id: string
  telegramId: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  languageCode?: string | null
  isBlocked: boolean
  orders?: Order[]
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: TelegramUser
  status: OrderStatus
  totalAmount: number
  paymentMethod?: string | null
  paymentStatus: PaymentStatus
  items?: OrderItem[]
  deliveryInfo?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  order?: Order
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  createdAt: Date
}

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  lowStockItems: number
  pendingOrders: number
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  lowStockAlert: number
  categoryId: string
  isActive: boolean
  imageUrl: string
  order: number
}

export interface CategoryFormData {
  name: string
  description: string
  emoji: string
  order: number
  isActive: boolean
}
