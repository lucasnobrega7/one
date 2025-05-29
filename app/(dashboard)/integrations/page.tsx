'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Globe, 
  Code, 
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react'

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState(null)

  const integrations = [
    {
      id: 'whatsapp-official',
      name: 'WhatsApp Oficial',
      description: 'API oficial do Meta para WhatsApp Business',
      icon: MessageSquare,
      status: 'available',
      category: 'messaging',
      complexity: 'advanced',
      features: ['Templates oficiais', 'Webhooks', 'Multi-agentes', 'Analytics'],
      requirements: ['App Meta', 'Conta Comercial', 'WABA ID']
    },
    {
      id: 'whatsapp-evolution',
      name: 'Evolution API',
      description: 'API não oficial com conexão rápida via QR Code',
      icon: MessageSquare,
      status: 'connected',
      category: 'messaging',
      complexity: 'simple',
      features: ['QR Code', 'Múltiplas contas', 'Grupos', 'Mídia'],
      requirements: ['Instância Evolution API', 'API Key']
    },
    {
      id: 'website',
      name: 'Widget Website',
      description: 'Chat embarcado para seu site ou loja online',
      icon: Globe,
      status: 'connected',
      category: 'web',
      complexity: 'simple',
      features: ['Personalização visual', 'Responsivo', 'Analytics', 'Leads'],
      requirements: ['Código de embed']
    },
    {
      id: 'api',
      name: 'API REST',
      description: 'Integre com qualquer sistema via nossa API',
      icon: Code,
      status: 'available',
      category: 'api',
      complexity: 'advanced',
      features: ['Webhooks', 'Rate limiting', 'Autenticação', 'SDKs'],
      requirements: ['API Key', 'Documentação técnica']
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Bot para grupos e canais do Telegram',
      icon: MessageSquare,
      status: 'coming-soon',
      category: 'messaging',
      complexity: 'simple',
      features: ['Comandos', 'Grupos', 'Canais', 'Inline'],
      requirements: ['Bot Token']
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      description: 'Mensagens diretas do Instagram Business',
      icon: MessageSquare,
      status: 'coming-soon',
      category: 'messaging',
      complexity: 'advanced',
      features: ['DMs', 'Stories', 'Comments', 'Media'],
      requirements: ['Instagram Business', 'Meta App']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'available':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'coming-soon':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-emerald-500/10 text-emerald-400'
      case 'advanced':
        return 'bg-orange-500/10 text-orange-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const categoryIcons = {
    messaging: Smartphone,
    web: Monitor,
    api: Code
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Integrações</h1>
            <p className="text-gray-400">
              Conecte seus agentes aos canais onde seus clientes estão
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/30">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button className="bg-white text-black hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Nova Integração
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Ativas</div>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">2,847</div>
                <div className="text-sm text-gray-400">Mensagens hoje</div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">99.2%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">1.3s</div>
                <div className="text-sm text-gray-400">Latência média</div>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const IconComponent = integration.icon
            const CategoryIcon = categoryIcons[integration.category as keyof typeof categoryIcons]
            
            return (
              <div key={integration.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {integration.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CategoryIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400 capitalize">{integration.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status === 'connected' && 'Conectado'}
                    {integration.status === 'available' && 'Disponível'}
                    {integration.status === 'coming-soon' && 'Em breve'}
                  </Badge>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {integration.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Complexidade</span>
                    <Badge className={getComplexityColor(integration.complexity)}>
                      {integration.complexity === 'simple' ? 'Simples' : 'Avançado'}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-gray-400 mb-2 block">Recursos principais:</span>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="text-xs text-gray-400">+{integration.features.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {integration.status === 'connected' ? (
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/30">
                      <Settings className="w-3 h-3 mr-1" />
                      Configurar
                    </Button>
                  ) : integration.status === 'available' ? (
                    <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-100">
                      <Plus className="w-3 h-3 mr-1" />
                      Conectar
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-400" disabled>
                      Em breve
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800/30">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}