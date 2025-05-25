"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Plus, Play, Pause, MoreHorizontal, TrendingUp } from "lucide-react"

interface DashboardClientProps {
  session: any
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const agents = [
    { id: 1, name: "Vendedor Virtual", status: "online", conversations: 234, rate: 28.5, description: "Especialista em vendas e conversão" },
    { id: 2, name: "Suporte Técnico", status: "online", conversations: 127, rate: 15.2, description: "Atendimento e resolução de dúvidas" },
    { id: 3, name: "Qualificador de Leads", status: "offline", conversations: 89, rate: 42.1, description: "Identificação e qualificação de prospects" }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header estilo OpenAI */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-semibold text-white">Painel de Controle</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="/dashboard" className="text-white font-medium">Painel</a>
                <a href="/dashboard/agents" className="text-gray-400 hover:text-white">Agentes</a>
                <a href="/dashboard/knowledge" className="text-gray-400 hover:text-white">Base de Conhecimento</a>
                <a href="/dashboard/integrations" className="text-gray-400 hover:text-white">Integrações</a>
                <a href="/dashboard/campaigns" className="text-gray-400 hover:text-white">Campanhas</a>
                <a href="/dashboard/analytics" className="text-gray-400 hover:text-white">Análises</a>
                <a href="/dashboard/settings" className="text-gray-400 hover:text-white">Configurações</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Online</Badge>
              <span className="text-gray-300">
                {session.user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">
            Bem-vindo, {session.user?.email?.split('@')[0]}
          </h2>
          <p className="text-gray-400">
            Acompanhe o desempenho dos seus agentes e métricas de conversão em tempo real.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Agentes criados</div>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">847</div>
                <div className="text-sm text-gray-400">Mensagens este mês</div>
              </div>
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-sm text-gray-400">Conhecimentos</div>
              </div>
              <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">Ativo</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-sm text-gray-400">Integrações ativas</div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">WhatsApp</Badge>
            </div>
          </Card>
        </div>        {/* Agents Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Seus Agentes Conversacionais</h3>
            <Button className="bg-white text-black hover:bg-gray-100 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Criar Agente
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{agent.conversations}</div>
                    <div className="text-xs text-gray-600">Conversas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{agent.rate}%</div>
                    <div className="text-xs text-gray-600">Conversão</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {agent.status === 'online' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {agent.status === 'online' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Criar Agente</h4>
            <p className="text-gray-600 text-sm mb-4">Configure um novo agente personalizado para seu negócio.</p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Começar</Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Treinar IA</h4>
            <p className="text-gray-600 text-sm mb-4">Melhore as respostas e performance dos seus agentes.</p>
            <Button variant="outline" className="w-full">Treinar</Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Ver Analytics</h4>
            <p className="text-gray-600 text-sm mb-4">Analise performance e otimize suas conversões.</p>
            <Button variant="outline" className="w-full">Analisar</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}