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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl border border-[#27272a] bg-gradient-to-r from-[#1a1a1d] to-[#0e0e10] p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46B2E0]/5 to-[#8A53D2]/5"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-3 text-white/90">
            Bem-vindo, {session.user?.name || session.user?.email?.split('@')[0]}
          </h2>
          <p className="text-lg text-white/70 mb-6 max-w-2xl">
            Acompanhe o desempenho dos seus agentes com OpenRouter e métricas de conversão em tempo real.
          </p>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-[#46B2E0] border border-[#27272a] px-3 py-1">
              Custos Otimizados
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
              Sistema Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">3</div>
              <div className="text-sm text-white/60">Agentes criados</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-lg flex items-center justify-center group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-colors duration-200">
              <Bot className="w-5 h-5 text-[#46B2E0]" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">847</div>
              <div className="text-sm text-white/60">Mensagens este mês</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-lg flex items-center justify-center group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-colors duration-200">
              <TrendingUp className="w-5 h-5 text-[#46B2E0]" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-white/90 group-hover:text-[#46B2E0] transition-colors duration-200">300+</div>
              <div className="text-sm text-white/60">Modelos AI</div>
            </div>
            <Badge className="bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-[#46B2E0] border border-[#27272a] px-2 py-1 text-xs">OpenRouter</Badge>
          </div>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-green-400 group-hover:text-green-300 transition-colors duration-200">Ótima</div>
              <div className="text-sm text-white/60">Eficiência</div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 text-xs">Economia ativa</Badge>
          </div>
        </Card>
      </div>
      
      {/* Agents Section */}
      <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white/90">Seus Agentes Conversacionais</h3>
            <Button className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Criar Agente
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white/90">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-400' : 'bg-white/30'}`}></div>
                        <span className="text-sm text-white/60 capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white/90 hover:bg-[#27272a]/30">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <div className="text-lg font-semibold text-white/90">{agent.conversations}</div>
                    <div className="text-xs text-white/60">Conversas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#46B2E0]">{agent.rate}%</div>
                    <div className="text-xs text-white/60">Conversão</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-[#27272a] text-white/70 hover:bg-[#27272a]/30 hover:text-white hover:border-[#46B2E0]/30">
                    {agent.status === 'online' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {agent.status === 'online' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-[#27272a] text-white/70 hover:bg-[#27272a]/30 hover:text-white hover:border-[#46B2E0]/30">
                    Ver Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 hover:bg-[#1a1a1d]/80 transform hover:scale-[1.02] transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-lg flex items-center justify-center mb-5 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-colors duration-200">
              <Plus className="w-6 h-6 text-[#46B2E0]" />
            </div>
            <h4 className="font-semibold text-white/90 mb-2">Criar Agente</h4>
            <p className="text-white/60 text-sm mb-5">Configure um novo agente personalizado para seu negócio.</p>
            <Button className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 w-full">Começar</Button>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 hover:bg-[#1a1a1d]/80 transform hover:scale-[1.02] transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-lg flex items-center justify-center mb-5 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-colors duration-200">
              <Bot className="w-6 h-6 text-[#46B2E0]" />
            </div>
            <h4 className="font-semibold text-white/90 mb-2">Treinar IA</h4>
            <p className="text-white/60 text-sm mb-5">Melhore as respostas e performance dos seus agentes.</p>
            <Button variant="outline" className="w-full border-[#27272a] text-white/70 hover:bg-[#27272a]/30 hover:text-white hover:border-[#46B2E0]/30">Treinar</Button>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a] group p-6 hover:shadow-lg hover:border-[#46B2E0]/20 hover:bg-[#1a1a1d]/80 transform hover:scale-[1.02] transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-lg flex items-center justify-center mb-5 group-hover:from-[#46B2E0]/30 group-hover:to-[#8A53D2]/30 transition-colors duration-200">
              <TrendingUp className="w-6 h-6 text-[#46B2E0]" />
            </div>
            <h4 className="font-semibold text-white/90 mb-2">Ver Analytics</h4>
            <p className="text-white/60 text-sm mb-5">Analise performance e otimize suas conversões.</p>
            <Button variant="outline" className="w-full border-[#27272a] text-white/70 hover:bg-[#27272a]/30 hover:text-white hover:border-[#46B2E0]/30">Analisar</Button>
          </Card>
        </div>
    </div>
  )
}