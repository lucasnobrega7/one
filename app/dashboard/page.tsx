import type { Metadata } from "next"
import { auth } from "@/config/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, MessageSquare, Brain, Settings, Plus, BarChart3 } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard | Agentes de Conversão",
  description: "Painel de controle para gerenciar seus agentes de conversão",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    return redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta, {session.user?.email}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Bot className="h-12 w-12 text-blue-400" />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Agentes</h3>
            <p className="text-gray-400">Crie e gerencie seus agentes de IA</p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-12 w-12 text-purple-400" />
              <Button size="sm" variant="outline" className="border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Conhecimento</h3>
            <p className="text-gray-400">Gerencie suas bases de conhecimento</p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="h-12 w-12 text-green-400" />
              <Button size="sm" variant="outline" className="border-gray-600">
                Ver Todas
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Conversas</h3>
            <p className="text-gray-400">Histórico de conversas dos agentes</p>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total de Agentes</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Conversas Hoje</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Taxa de Conversão</p>
                <p className="text-2xl font-bold">23.5%</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Tempo de Resposta</p>
                <p className="text-2xl font-bold">1.2s</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-gray-900 border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-4">Primeiros Passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
              <Bot className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">1. Crie seu primeiro agente</h3>
              <p className="text-gray-400 mb-4">Configure um agente personalizado para seu negócio</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Criar Agente
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
              <Brain className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">2. Adicione conhecimento</h3>
              <p className="text-gray-400 mb-4">Alimente seu agente com informações específicas</p>
              <Button variant="outline" className="border-purple-600 text-purple-400">
                Adicionar Dados
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
              <MessageSquare className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">3. Teste seu agente</h3>
              <p className="text-gray-400 mb-4">Inicie uma conversa e veja seu agente em ação</p>
              <Button variant="outline" className="border-green-600 text-green-400">
                Testar Agente
              </Button>
            </div>
          </div>
        </Card>

        {/* Integration Status */}
        <div className="mt-8">
          <Card className="bg-green-900/20 border-green-800 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <div>
                <h3 className="font-semibold text-green-400">Sistema Operacional</h3>
                <p className="text-sm text-gray-400">Supabase conectado • NextAuth configurado • Database online</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
