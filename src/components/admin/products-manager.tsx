'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Package, Search, Filter, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Product, Category } from '@/types'

interface ProductFormData {
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

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    lowStockAlert: 5,
    categoryId: '',
    isActive: true,
    imageUrl: '',
    order: 0
  })

  // Carregar produtos e categorias
  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
    const matchesStock = !showLowStockOnly || product.stock <= product.lowStockAlert
    return matchesSearch && matchesCategory && matchesStock
  })

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      lowStockAlert: 5,
      categoryId: '',
      isActive: true,
      imageUrl: '',
      order: 0
    })
    setEditingProduct(null)
  }

  // Abrir diálogo para novo produto
  const handleNewProduct = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Abrir diálogo para editar produto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      categoryId: product.categoryId,
      isActive: product.isActive,
      imageUrl: product.imageUrl || '',
      order: product.order
    })
    setIsDialogOpen(true)
  }

  // Salvar produto
  const handleSave = async () => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'

      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erro ao salvar produto')

      toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!')
      setIsDialogOpen(false)
      loadData()
      resetForm()
    } catch (error) {
      toast.error('Erro ao salvar produto')
      console.error(error)
    }
  }

  // Deletar produto
  const handleDelete = async (product: Product) => {
    if (!confirm(`Tem certeza que deseja deletar "${product.name}"?`)) return

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao deletar produto')

      toast.success('Produto deletado!')
      loadData()
    } catch (error) {
      toast.error('Erro ao deletar produto')
      console.error(error)
    }
  }

  // Atualizar stock rapidamente
  const handleQuickStockUpdate = async (product: Product, change: number) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: change > 0 ? 'add' : 'subtract', stock: Math.abs(change) })
      })

      if (!response.ok) throw new Error('Erro ao atualizar stock')

      loadData()
    } catch (error) {
      toast.error('Erro ao atualizar stock')
      console.error(error)
    }
  }

  // Toggle status ativo
  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isActive: !product.isActive })
      })

      if (!response.ok) throw new Error('Erro ao atualizar produto')

      toast.success('Produto atualizado!')
      loadData()
    } catch (error) {
      toast.error('Erro ao atualizar produto')
      console.error(error)
    }
  }

  const isLowStock = (product: Product) => product.stock <= product.lowStockAlert

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Produtos</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Gerencie seu catálogo de produtos e stock
          </p>
        </div>
        <Button
          onClick={handleNewProduct}
          className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showLowStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={showLowStockOnly ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Stock Baixo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <Package className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {searchTerm || selectedCategory !== 'all' || showLowStockOnly
                    ? 'Nenhum produto encontrado'
                    : 'Nenhum produto cadastrado'}
                </p>
                <p className="text-sm">
                  {searchTerm || selectedCategory !== 'all' || showLowStockOnly
                    ? 'Tente ajustar os filtros'
                    : 'Crie seu primeiro produto para começar'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800 ${
                  isLowStock(product) ? 'border-l-4 border-l-red-500' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </h3>
                          {!product.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inativo
                            </Badge>
                          )}
                          {isLowStock(product) && (
                            <Badge variant="destructive" className="text-xs">
                              Stock Baixo
                            </Badge>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {product.category?.emoji} {product.category?.name}
                          </p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            €{product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="text-center min-w-[120px] mr-4">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {product.stock}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">em stock</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => handleQuickStockUpdate(product, -1)}
                          >
                            −
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => handleQuickStockUpdate(product, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(product)}
                          title={product.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {product.isActive ? (
                            <Eye className="w-4 h-4 text-slate-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Atualize as informações do produto'
                : 'Adicione um novo produto ao catálogo'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Premium Package, Basic Plan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockAlert">Alerta de Stock</Label>
                  <Input
                    id="lowStockAlert"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: parseInt(e.target.value) || 5 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o produto..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2 flex items-center justify-between">
                  <Label htmlFor="active">Produto ativo</Label>
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.price || !formData.categoryId}
              className="bg-gradient-to-r from-violet-500 to-purple-600"
            >
              {editingProduct ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
