'use client'

import { Suspense, useState } from 'react'
import { FlowDashboard } from '@/components/agents/flow-dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Bot, 
  BarChart3,
  Plus,
  Share2,
  Download,
  Eye
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

function FlowStats() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-sm text-gray-400">Fluxos ativos</div>
          </div>
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">2,341</div>
            <div className="text-sm text-gray-400">Execuções hoje</div>
          </div>
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">98.7%</div>
            <div className="text-sm text-gray-400">Taxa sucesso</div>
          </div>
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlowPage() {
  const permissions = usePermissions()
  const canCreateAgents = true // Temporary fix

  const flows = [
    {
      id: 1,
      name: "Vendas WhatsApp",
      description: "Fluxo de qualificação e conversão via WhatsApp",
      status: "active",
      executions: 324,
      conversion: "45.2%",
      nodes: 12
    },
    {
      id: 2,
      name: "Suporte Técnico",
      description: "Atendimento automatizado com escalação humana",
      status: "active", 
      executions: 156,
      conversion: "78.1%",
      nodes: 8
    },
    {
      id: 3,
      name: "Captação de Leads",
      description: "Qualificação de prospects no site",
      status: "draft",
      executions: 0,
      conversion: "0%",
      nodes: 6
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Editor Visual de Fluxos</h1>
            <p className="text-gray-400">
              Crie fluxos conversacionais complexos com nossa interface visual baseada no Flowise
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            {canCreateAgents && (
              <Button className="bg-white text-black hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fluxo
              </Button>
            )}
          </div>
        </div>

        <FlowStats />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {flow.name}
                </h3>
                <Badge className={`${
                  flow.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  {flow.status === 'active' ? 'Ativo' : 'Rascunho'}
                </Badge>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {flow.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{flow.executions}</div>
                  <div className="text-xs text-gray-400">Execuções</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{flow.conversion}</div>
                  <div className="text-xs text-gray-400">Conversão</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{flow.nodes}</div>
                  <div className="text-xs text-gray-400">Nós</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/30">
                  <Share2 className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Editor Visual</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          <Suspense fallback={
            <div className="w-full h-[600px] bg-gray-950 rounded-lg flex items-center justify-center border border-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 animate-pulse" />
                <p className="text-gray-500">Carregando Flow Builder...</p>
              </div>
            </div>
          }>
            <FlowDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  )
}