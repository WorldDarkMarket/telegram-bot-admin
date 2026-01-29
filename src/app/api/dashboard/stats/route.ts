import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/stats - Obter estatísticas do dashboard
export async function GET() {
  try {
    // Total de produtos ativos
    const totalProducts = await db.product.count({
      where: { isActive: true }
    })

    // Total de categorias ativas
    const totalCategories = await db.category.count({
      where: { isActive: true }
    })

    // Total de pedidos
    const totalOrders = await db.order.count()

    // Receita total (pedidos completados)
    const completedOrders = await db.order.findMany({
      where: {
        status: 'COMPLETED',
        paymentStatus: 'PAID'
      },
      select: { totalAmount: true }
    })

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    // Produtos com stock baixo
    const lowStockItems = await db.product.count({
      where: {
        isActive: true,
        stock: { lte: 10 } // produtos com 10 ou menos unidades
      }
    })

    // Pedidos pendentes
    const pendingOrders = await db.order.count({
      where: { status: 'PENDING' }
    })

    const stats = {
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      lowStockItems,
      pendingOrders
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
