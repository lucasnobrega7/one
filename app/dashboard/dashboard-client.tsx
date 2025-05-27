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
    <div className="min-h-screen">
      <main>
        {/* Welcome Section */}
        <div className="mb-8">
        <div className="relative overflow-hidden rounded-xl border border-[#27272a] bg-gradient-to-r from-[#46B2E0]/5 to-[#8A53D2]/5 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#46B2E0]/10 to-[#8A53D2]/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 text-white">
              Bem-vindo, {session.user?.name || session.user?.email?.split('@')[0]}
            </h2>
            <p className="text-white/70 mb-4">
              Acompanhe o desempenho dos seus agentes com OpenRouter e métricas de conversão em tempo real.
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#46B2E0]/20 text-[#46B2E0] border border-[#46B2E0]/30">
                87% Margem ativa
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                Sistema Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#46B2E0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#46B2E0]/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-[#46B2E0] transition-colors duration-200">3</div>
              <div className="text-sm text-white/60">Agentes criados</div>
            </div>
            <div className="w-10 h-10 bg-[#46B2E0]/20 rounded-xl flex items-center justify-center border border-[#46B2E0]/30 group-hover:scale-110 transition-transform duration-200">
              <Bot className="w-5 h-5 text-[#46B2E0]" />
            </div>
          </div>
        </Card>

        <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#8A53D2]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#8A53D2]/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-[#8A53D2] transition-colors duration-200">847</div>
              <div className="text-sm text-white/60">Mensagens este mês</div>
            </div>
            <div className="w-10 h-10 bg-[#8A53D2]/20 rounded-xl flex items-center justify-center border border-[#8A53D2]/30 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-5 h-5 text-[#8A53D2]" />
            </div>
          </div>
        </Card>

        <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#E056A0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#E056A0]/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-[#E056A0] transition-colors duration-200">300+</div>
              <div className="text-sm text-white/60">Modelos AI</div>
            </div>
            <Badge className="bg-[#E056A0]/20 text-[#E056A0] border border-[#E056A0]/30 text-xs">OpenRouter</Badge>
          </div>
        </Card>

        <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-green-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-200">87%</div>
              <div className="text-sm text-white/60">Margem de lucro</div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Economia ativa</Badge>
          </div>
        </Card>
      </div>
      
      {/* Agents Section */}
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
              <Card key={agent.id} className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#46B2E0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#46B2E0]/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-[#46B2E0]' : 'bg-gray-500'}`}></div>
                        <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{agent.conversations}</div>
                    <div className="text-xs text-gray-400">Conversas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#8A53D2]">{agent.rate}%</div>
                    <div className="text-xs text-gray-400">Conversão</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-[#27272a] text-gray-300 hover:text-white hover:border-[#46B2E0]/30">
                    {agent.status === 'online' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {agent.status === 'online' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-[#27272a] text-gray-300 hover:text-white hover:border-[#8A53D2]/30">
                    Ver Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#46B2E0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#46B2E0]/10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-2">Criar Agente</h4>
            <p className="text-gray-400 text-sm mb-4">Configure um novo agente personalizado para seu negócio.</p>
            <Button className="w-full bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:opacity-90">Começar</Button>
          </Card>

          <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#8A53D2]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#8A53D2]/10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8A53D2] to-[#E056A0] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-2">Treinar IA</h4>
            <p className="text-gray-400 text-sm mb-4">Melhore as respostas e performance dos seus agentes.</p>
            <Button variant="outline" className="w-full border-[#27272a] text-gray-300 hover:text-white hover:border-[#8A53D2]/30">Treinar</Button>
          </Card>

          <Card className="group p-6 bg-[#1a1a1d] border border-[#27272a] hover:border-[#E056A0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#E056A0]/10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E056A0] to-[#46B2E0] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-2">Ver Analytics</h4>
            <p className="text-gray-400 text-sm mb-4">Analise performance e otimize suas conversões.</p>
            <Button variant="outline" className="w-full border-[#27272a] text-gray-300 hover:text-white hover:border-[#E056A0]/30">Analisar</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}