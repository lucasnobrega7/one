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
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
        <div className="relative overflow-hidden rounded-lg border border-[--openai-gray-200] bg-gradient-to-r from-[--openai-blue]/5 to-[--openai-gray-100] p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[--openai-blue]/3 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="sohne-heading text-4xl font-normal mb-3 text-[--openai-gray-900]">
              Bem-vindo, {session.user?.name || session.user?.email?.split('@')[0]}
            </h2>
            <p className="text-lg text-[--openai-gray-600] mb-6 max-w-2xl">
              Acompanhe o desempenho dos seus agentes com OpenRouter e métricas de conversão em tempo real.
            </p>
            <div className="flex items-center gap-3">
              <Badge className="bg-[--openai-blue]/10 text-[--openai-blue] border border-[--openai-blue]/20 px-3 py-1">
                87% Margem ativa
              </Badge>
              <Badge className="bg-green-50 text-green-700 border border-green-200 px-3 py-1">
                Sistema Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card className="openai-card-light group p-6 hover:shadow-openai-light-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-[--openai-gray-900] group-hover:text-[--openai-blue] transition-colors duration-200">3</div>
              <div className="text-sm text-[--openai-gray-600]">Agentes criados</div>
            </div>
            <div className="w-12 h-12 bg-[--openai-blue]/10 rounded-lg flex items-center justify-center group-hover:bg-[--openai-blue]/15 transition-colors duration-200">
              <Bot className="w-5 h-5 text-[--openai-blue]" />
            </div>
          </div>
        </Card>

        <Card className="openai-card-light group p-6 hover:shadow-openai-light-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-[--openai-gray-900] group-hover:text-[--openai-blue] transition-colors duration-200">847</div>
              <div className="text-sm text-[--openai-gray-600]">Mensagens este mês</div>
            </div>
            <div className="w-12 h-12 bg-[--openai-blue]/10 rounded-lg flex items-center justify-center group-hover:bg-[--openai-blue]/15 transition-colors duration-200">
              <TrendingUp className="w-5 h-5 text-[--openai-blue]" />
            </div>
          </div>
        </Card>

        <Card className="openai-card-light group p-6 hover:shadow-openai-light-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-[--openai-gray-900] group-hover:text-[--openai-blue] transition-colors duration-200">300+</div>
              <div className="text-sm text-[--openai-gray-600]">Modelos AI</div>
            </div>
            <Badge className="bg-[--openai-blue]/10 text-[--openai-blue] border border-[--openai-blue]/20 px-2 py-1 text-xs">OpenRouter</Badge>
          </div>
        </Card>

        <Card className="openai-card-light group p-6 hover:shadow-openai-light-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-[--openai-gray-900] group-hover:text-green-600 transition-colors duration-200">87%</div>
              <div className="text-sm text-[--openai-gray-600]">Margem de lucro</div>
            </div>
            <Badge className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 text-xs">Economia ativa</Badge>
          </div>
        </Card>
      </div>
      
      {/* Agents Section */}
      <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="sohne-heading text-2xl font-normal text-[--openai-gray-900]">Seus Agentes Conversacionais</h3>
            <Button className="btn-openai-primary-light">
              <Plus className="w-4 h-4 mr-2" />
              Criar Agente
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="openai-card-light group p-6 hover:shadow-openai-light-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[--openai-blue] to-[--openai-blue]/80 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[--openai-gray-900]">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-[--openai-gray-400]'}`}></div>
                        <span className="text-sm text-[--openai-gray-600] capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[--openai-gray-500] hover:text-[--openai-gray-700]">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <div className="text-lg font-semibold text-[--openai-gray-900]">{agent.conversations}</div>
                    <div className="text-xs text-[--openai-gray-600]">Conversas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[--openai-blue]">{agent.rate}%</div>
                    <div className="text-xs text-[--openai-gray-600]">Conversão</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-[--openai-gray-300] text-[--openai-gray-700] hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400]">
                    {agent.status === 'online' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {agent.status === 'online' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-[--openai-gray-300] text-[--openai-gray-700] hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400]">
                    Ver Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="openai-card-light group p-6 hover:shadow-openai-light-lg transition-all duration-200">
            <div className="w-14 h-14 bg-[--openai-blue]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[--openai-blue]/15 transition-colors duration-200">
              <Plus className="w-6 h-6 text-[--openai-blue]" />
            </div>
            <h4 className="font-semibold text-[--openai-gray-900] mb-2">Criar Agente</h4>
            <p className="text-[--openai-gray-600] text-sm mb-5">Configure um novo agente personalizado para seu negócio.</p>
            <Button className="btn-openai-primary-light w-full">Começar</Button>
          </Card>

          <Card className="openai-card-light group p-6 hover:shadow-openai-light-lg transition-all duration-200">
            <div className="w-14 h-14 bg-[--openai-blue]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[--openai-blue]/15 transition-colors duration-200">
              <Bot className="w-6 h-6 text-[--openai-blue]" />
            </div>
            <h4 className="font-semibold text-[--openai-gray-900] mb-2">Treinar IA</h4>
            <p className="text-[--openai-gray-600] text-sm mb-5">Melhore as respostas e performance dos seus agentes.</p>
            <Button variant="outline" className="w-full border-[--openai-gray-300] text-[--openai-gray-700] hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400]">Treinar</Button>
          </Card>

          <Card className="openai-card-light group p-6 hover:shadow-openai-light-lg transition-all duration-200">
            <div className="w-14 h-14 bg-[--openai-blue]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[--openai-blue]/15 transition-colors duration-200">
              <TrendingUp className="w-6 h-6 text-[--openai-blue]" />
            </div>
            <h4 className="font-semibold text-[--openai-gray-900] mb-2">Ver Analytics</h4>
            <p className="text-[--openai-gray-600] text-sm mb-5">Analise performance e otimize suas conversões.</p>
            <Button variant="outline" className="w-full border-[--openai-gray-300] text-[--openai-gray-700] hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400]">Analisar</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}