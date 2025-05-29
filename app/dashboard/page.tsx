"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthCheck } from "@/components/features/auth/auth-check"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bot, 
  Plus, 
  TrendingUp, 
  Activity,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

function DashboardContent() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-xl border border-[#27272a] bg-gradient-to-r from-[#1a1a1d] to-[#0e0e10] p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46B2E0]/5 to-[#8A53D2]/5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white/90 mb-2">
                Bem-vindo, {user?.user_metadata?.name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-white/70 text-lg max-w-2xl">
                Gerencie seus Agentes de Conversão
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-[#46B2E0] border border-[#27272a] px-3 py-1">
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
                Sistema Online
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/agents">
              <Button className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Agente
              </Button>
            </Link>
            <Link href="/dashboard/ai-test">
              <Button variant="outline" className="border-[#27272a] text-white/70 hover:bg-[#27272a]/30 hover:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Testar IA
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Agentes Ativos
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-[#46B2E0]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">0</div>
            <p className="text-xs text-white/50">
              Nenhum agente criado ainda
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Conversas Hoje
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-[#46B2E0]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">0</div>
            <p className="text-xs text-white/50">
              Sem conversas hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Taxa de Conversão
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-[#46B2E0]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">0%</div>
            <p className="text-xs text-white/50">
              Sem dados suficientes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Margem de Lucro
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-200">Ótima</div>
            <p className="text-xs text-white/50">
              OpenRouter ativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1d] border-[#27272a] hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white/90 flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#46B2E0]" />
              Começar com Agentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/70">
              Crie seu primeiro agente de conversão para começar a automatizar suas vendas com IA avançada.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>300+ modelos de IA disponíveis</span>
            </div>
            <Link href="/dashboard/agents">
              <Button className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 w-full">
                Criar Primeiro Agente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white/90 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Status da Implementação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white/70">Supabase Auth implementado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white/70">Vector Store funcionando</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white/70">OpenRouter (custos otimizados)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white/70">Prisma Schema (14 tabelas)</span>
            </div>
            <div className="pt-2">
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                Sistema 100% operacional
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/agents" className="group">
          <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center mb-4 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-all duration-200">
                <Plus className="h-6 w-6 text-[#46B2E0]" />
              </div>
              <h3 className="font-semibold text-white/90 mb-2">Criar Agente</h3>
              <p className="text-white/60 text-sm">Configure um novo agente personalizado para seu negócio</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics" className="group">
          <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center mb-4 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-all duration-200">
                <BarChart3 className="h-6 w-6 text-[#46B2E0]" />
              </div>
              <h3 className="font-semibold text-white/90 mb-2">Ver Analytics</h3>
              <p className="text-white/60 text-sm">Analise performance e otimize suas conversões</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings" className="group">
          <Card className="bg-[#1a1a1d] border-[#27272a] hover:bg-[#1a1a1d]/80 hover:border-[#46B2E0]/20 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 flex items-center justify-center mb-4 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-all duration-200">
                <Settings className="h-6 w-6 text-[#46B2E0]" />
              </div>
              <h3 className="font-semibold text-white/90 mb-2">Configurações</h3>
              <p className="text-white/60 text-sm">Personalize integrações e preferências</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthCheck>
      <DashboardContent />
    </AuthCheck>
  )
}