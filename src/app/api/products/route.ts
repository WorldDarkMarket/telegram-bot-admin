import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/products - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const lowStock = searchParams.get('lowStock')
    const active = searchParams.get('active')

    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (active !== null) {
      where.isActive = active === 'true'
    }

    if (lowStock === 'true') {
      where.stock = { lte: db.product.fields.lowStockAlert }
    }

    const products = await db.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        category: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      stock,
      lowStockAlert = 5,
      categoryId,
      isActive = true,
      imageUrl,
      order = 0
    } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Nome, preço e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        lowStockAlert: parseInt(lowStockAlert),
        categoryId,
        isActive,
        imageUrl,
        order
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
