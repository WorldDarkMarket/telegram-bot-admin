import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/products/[id] - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      price,
      stock,
      lowStockAlert,
      categoryId,
      isActive,
      imageUrl,
      order
    } = body

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        lowStockAlert: lowStockAlert !== undefined ? parseInt(lowStockAlert) : undefined,
        categoryId,
        isActive,
        imageUrl,
        order
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id]/stock - Atualizar stock do produto
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stock, operation } = body // operation pode ser 'add', 'subtract', 'set'

    const product = await db.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    let newStock = product.stock

    if (operation === 'add') {
      newStock = product.stock + (parseInt(stock) || 1)
    } else if (operation === 'subtract') {
      newStock = Math.max(0, product.stock - (parseInt(stock) || 1))
    } else if (operation === 'set' || stock !== undefined) {
      newStock = parseInt(stock)
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erro ao atualizar stock:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar stock' },
      { status: 500 }
    )
  }
}
