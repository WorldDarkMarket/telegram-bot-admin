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
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Package, GripVertical, Eye, EyeOff } from 'lucide-react'
import { Category } from '@/types'

interface CategoryFormData {
  name: string
  description: string
  emoji: string
  order: number
  isActive: boolean
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    emoji: '',
    order: 0,
    isActive: true
  })

  // Carregar categorias
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error('Erro ao carregar categorias')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      emoji: '',
      order: 0,
      isActive: true
    })
    setEditingCategory(null)
  }

  // Abrir diálogo para nova categoria
  const handleNewCategory = () => {
    resetForm()
    setFormData(prev => ({ ...prev, order: categories.length }))
    setIsDialogOpen(true)
  }

  // Abrir diálogo para editar categoria
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      emoji: category.emoji || '',
      order: category.order,
      isActive: category.isActive
    })
    setIsDialogOpen(true)
  }

  // Salvar categoria
  const handleSave = async () => {
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'

      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erro ao salvar categoria')

      toast.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!')
      setIsDialogOpen(false)
      loadCategories()
      resetForm()
    } catch (error) {
      toast.error('Erro ao salvar categoria')
      console.error(error)
    }
  }

  // Deletar categoria
  const handleDelete = async (category: Category) => {
    if (!confirm(`Tem certeza que deseja deletar "${category.name}"?`)) return

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao deletar categoria')

      toast.success('Categoria deletada!')
      loadCategories()
    } catch (error) {
      toast.error('Erro ao deletar categoria')
      console.error(error)
    }
  }

  // Toggle status ativo
  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, isActive: !category.isActive })
      })

      if (!response.ok) throw new Error('Erro ao atualizar categoria')

      toast.success('Categoria atualizada!')
      loadCategories()
    } catch (error) {
      toast.error('Erro ao atualizar categoria')
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Categorias</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Organize seus produtos em categorias
          </p>
        </div>
        <Button
          onClick={handleNewCategory}
          className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Lista de Categorias */}
      <div className="grid gap-4">
        <AnimatePresence>
          {categories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <Package className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma categoria encontrada</p>
                <p className="text-sm">Crie sua primeira categoria para começar</p>
              </CardContent>
            </Card>
          ) : (
            categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Emoji */}
                      {category.emoji ? (
                        <div className="text-3xl">{category.emoji}</div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {category.name}
                          </h3>
                          {!category.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 mr-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {(category as any)._count?.products || 0}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Produtos
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(category)}
                          title={category.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {category.isActive ? (
                            <Eye className="w-4 h-4 text-slate-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Atualize as informações da categoria'
                : 'Crie uma nova categoria para organizar seus produtos'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Serviços, Planos, Acessórios"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                placeholder="Ex: 🎮, 🛍️, 💳"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o que esta categoria contém..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Ordem de exibição</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Categoria ativa</Label>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name}
              className="bg-gradient-to-r from-violet-500 to-purple-600"
            >
              {editingCategory ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
