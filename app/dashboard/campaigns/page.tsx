'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Plus,
  Calendar,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react'

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      name: "Black Friday 2024",
      agent: "Vendedor Virtual",
      channel: "WhatsApp",
      status: "active",
      scheduled: "2024-11-29 09:00",
      sent: 2847,
      delivered: 2801,
      opened: 1923,
      replied: 456,
      conversion: "16.0%"
    },
    {
      id: 2,
      name: "Seguimento de Carrinho",
      agent: "Vendedor Virtual", 
      channel: "WhatsApp",
      status: "scheduled",
      scheduled: "2024-12-01 14:00",
      sent: 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      conversion: "0%"
    },
    {
      id: 3,
      name: "Pesquisa de Satisfação",
      agent: "Suporte Técnico",
      channel: "WhatsApp",
      status: "completed",
      scheduled: "2024-11-25 10:00",
      sent: 1250,
      delivered: 1238,
      opened: 892,
      replied: 634,
      conversion: "50.7%"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'  
      case 'completed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campanhas</h1>
            <p className="text-gray-400">
              Crie e gerencie campanhas de mensagens para seus agentes
            </p>
          </div>
          
          <Button className="bg-white text-black hover:bg-gray-100">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Campanhas ativas</div>
              </div>
              <Send className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">4,097</div>
                <div className="text-sm text-gray-400">Mensagens enviadas</div>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">68.3%</div>
                <div className="text-sm text-gray-400">Taxa de abertura</div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">22.2%</div>
                <div className="text-sm text-gray-400">Taxa conversão</div>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status === 'active' && 'Ativa'}
                    {campaign.status === 'scheduled' && 'Agendada'}  
                    {campaign.status === 'completed' && 'Concluída'}
                    {campaign.status === 'paused' && 'Pausada'}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  {campaign.status === 'active' && (
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Pause className="w-3 h-3 mr-1" />
                      Pausar
                    </Button>
                  )}
                  {campaign.status === 'scheduled' && (
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Play className="w-3 h-3 mr-1" />
                      Iniciar
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                    <Settings className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Agente:</span>
                    <span className="text-white">{campaign.agent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Canal:</span>
                    <span className="text-white">{campaign.channel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Agendado:</span>
                    <span className="text-white">{campaign.scheduled}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{campaign.sent.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Enviadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{campaign.opened.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Abertas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">{campaign.conversion}</div>
                    <div className="text-xs text-gray-400">Conversão</div>
                  </div>
                </div>
              </div>

              {campaign.status === 'active' && (
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(campaign.sent / 5000) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}