'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Users, Package, TrendingUp, Settings, MessageSquare, BarChart3, Plus, RefreshCw } from 'lucide-react'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { ProductsManager } from '@/components/admin/products-manager'
import { DashboardStats } from '@/types'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [activeTab]) // Recarregar ao mudar de aba

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
      PENDING: { variant: 'secondary', label: 'Pendente' },
      CONFIRMED: { variant: 'default', label: 'Confirmado' },
      PROCESSING: { variant: 'outline', label: 'Processando' },
      COMPLETED: { variant: 'default', label: 'Concluído' },
      CANCELLED: { variant: 'destructive', label: 'Cancelado' },
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Telegram Bot Admin</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Painel de Controle</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              disabled={isLoadingStats}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Acessar Bot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total de Produtos
                    </CardTitle>
                    <Package className="w-4 h-4 text-violet-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoadingStats ? (
                      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stats?.totalProducts || 0}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Produtos ativos
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total de Categorias
                    </CardTitle>
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoadingStats ? (
                      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stats?.totalCategories || 0}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Categorias ativas
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total de Pedidos
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoadingStats ? (
                      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stats?.totalOrders || 0}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {stats?.pendingOrders || 0} pendentes
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Receita Total
                    </CardTitle>
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    {isLoadingStats ? (
                      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : '€0,00'}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Receita total
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Low Stock Alert */}
            {stats && stats.lowStockItems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Alerta de Stock Baixo
                    </CardTitle>
                    <CardDescription>
                      {stats.lowStockItems} produtos com stock baixo precisam de atenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('products')}
                      className="border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950/30"
                    >
                      Ver Produtos
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Welcome Card */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl">Bem-vindo ao Telegram Bot Admin!</CardTitle>
                <CardDescription>
                  Gerencie seu bot Telegram de forma profissional e eficiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('categories')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                  >
                    <ShoppingBag className="w-8 h-8 text-violet-500" />
                    <span className="font-semibold">Gerenciar Categorias</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('products')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  >
                    <Package className="w-8 h-8 text-emerald-500" />
                    <span className="font-semibold">Gerenciar Produtos</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('orders')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  >
                    <TrendingUp className="w-8 h-8 text-amber-500" />
                    <span className="font-semibold">Ver Pedidos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Pedidos</h2>
              <p className="text-slate-500 dark:text-slate-400">Acompanhe e gerencie todos os pedidos</p>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Todos os Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Sistema de pedidos em desenvolvimento...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
          © 2025 Telegram Bot Admin. Sistema profissional de gestão.
        </div>
      </footer>
    </div>
  )
}
