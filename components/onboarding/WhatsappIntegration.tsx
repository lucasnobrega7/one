"use client"

import { useState } from 'react'
import { useOnboarding } from '@/contexts/onboarding-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageSquare, 
  Smartphone, 
  QrCode, 
  Key, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Wifi,
  Code,
  Server,
  Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'

const integrationOptions = [
  {
    id: 'z-api',
    name: 'Z-API',
    description: 'Solução empresarial robusta e confiável',
    price: 'A partir de R$ 99/mês',
    complexity: 'Baixa',
    stability: 'Alta',
    support: 'Comercial 24/7',
    features: [
      'API oficial WhatsApp Business',
      'Múltiplos números simultâneos',
      'Webhook em tempo real',
      'Relatórios detalhados',
      'SLA garantido'
    ],
    pros: [
      'Mais estável',
      'Suporte oficial',
      'Escalável',
      'SLA garantido'
    ],
    cons: [
      'Mais caro',
      'Setup mais complexo',
      'Dependência de terceiro'
    ],
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    recommended: true,
    badge: 'Empresarial',
    useCase: 'Empresas que precisam de estabilidade e suporte'
  },
  {
    id: 'baileys',
    name: 'Baileys',
    description: 'Biblioteca TypeScript open-source otimizada',
    price: 'Gratuito',
    complexity: 'Média-Alta',
    stability: 'Boa',
    support: 'Comunidade ativa',
    features: [
      'WebSocket nativo',
      'TypeScript/JavaScript',
      'Controle total do código',
      'Performance otimizada',
      'Sem custos recorrentes'
    ],
    pros: [
      'Gratuito',
      'Controle total',
      'Performance',
      'Open-source'
    ],
    cons: [
      'Complexidade técnica',
      'Não oficial',
      'Manutenção própria'
    ],
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    recommended: true,
    badge: 'Developers',
    useCase: 'Desenvolvedores com conhecimento técnico avançado'
  },
  {
    id: 'evolution-api',
    name: 'Evolution API',
    description: 'Solução intermediária open-source',
    price: 'Gratuito (self-hosted)',
    complexity: 'Média',
    stability: 'Média',
    support: 'Comunidade',
    features: [
      'Open source completo',
      'QR Code simples',
      'API REST padrão',
      'Multi-dispositivo',
      'Docker ready'
    ],
    pros: [
      'Gratuito',
      'Fácil setup',
      'Flexível',
      'REST API'
    ],
    cons: [
      'Menos estável',
      'Sem suporte oficial',
      'Self-hosting'
    ],
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
    recommended: false,
    useCase: 'Projetos intermediários com orçamento limitado'
  },
  {
    id: 'evolution-qr',
    name: 'Evolution QR',
    description: 'Versão hospedada simplificada',
    price: 'R$ 39/mês (hospedado)',
    complexity: 'Baixa',
    stability: 'Baixa-Média',
    support: 'Básico',
    features: [
      'QR Code instantâneo',
      'Hospedagem incluída',
      'Setup em minutos',
      'Webhook básico'
    ],
    pros: [
      'Mais barato',
      'Setup rápido',
      'Sem infraestrutura'
    ],
    cons: [
      'Recursos limitados',
      'Menos confiável',
      'Suporte básico'
    ],
    icon: QrCode,
    color: 'from-orange-500 to-red-500',
    recommended: false,
    useCase: 'Testes e projetos pequenos'
  }
]

interface ConnectionStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'loading' | 'completed' | 'error'
}

export function WhatsappIntegration() {
  const { updateWhatsappIntegration, completeStep, whatsappIntegration } = useOnboarding()
  
  const [selectedOption, setSelectedOption] = useState(whatsappIntegration?.option || '')
  const [apiKey, setApiKey] = useState(whatsappIntegration?.apiKey || '')
  const [webhookUrl, setWebhookUrl] = useState(whatsappIntegration?.webhookUrl || '')
  const [phoneNumber, setPhoneNumber] = useState(whatsappIntegration?.phoneNumber || '')
  const [sessionId, setSessionId] = useState(whatsappIntegration?.sessionId || '')
  const [nodeEndpoint, setNodeEndpoint] = useState(whatsappIntegration?.nodeEndpoint || '')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionSteps, setConnectionSteps] = useState<ConnectionStep[]>([])
  const [qrCode, setQrCode] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')

  const selectedOptionData = integrationOptions.find(opt => opt.id === selectedOption)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    setConnectionStatus('disconnected')
    setQrCode('')
  }

  const testConnection = async () => {
    if (!selectedOption) return

    setIsConnecting(true)
    setConnectionStatus('connecting')

    const steps: ConnectionStep[] = [
      { id: 'validate', title: 'Validando credenciais', description: 'Verificando API key e configurações', status: 'pending' },
      { id: 'connect', title: 'Conectando ao WhatsApp', description: 'Estabelecendo conexão com a API', status: 'pending' },
      { id: 'webhook', title: 'Configurando webhook', description: 'Configurando recebimento de mensagens', status: 'pending' },
      { id: 'test', title: 'Teste de envio', description: 'Enviando mensagem de teste', status: 'pending' }
    ]

    setConnectionSteps(steps)

    // Simulate connection process
    for (let i = 0; i < steps.length; i++) {
      setConnectionSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'loading' } : step
      ))

      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate some failures for demonstration
      const shouldFail = Math.random() > 0.8 && i > 0
      
      setConnectionSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: shouldFail ? 'error' : 'completed' } : step
      ))

      if (shouldFail) break
    }

    // If Z-API or Evolution QR, show QR code
    if (selectedOption === 'evolution-qr' || selectedOption === 'evolution-api') {
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') // Placeholder QR
    }

    const allCompleted = connectionSteps.every(step => step.status === 'completed')
    setConnectionStatus(allCompleted ? 'connected' : 'disconnected')
    setIsConnecting(false)
  }

  const handleSaveIntegration = () => {
    const config = {
      option: selectedOption,
      apiKey,
      webhookUrl,
      phoneNumber,
      connectionStatus,
      qrCode
    }
    
    updateWhatsappIntegration(config)
    completeStep('whatsapp-integration')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'loading': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-green-400" />
          Integração com WhatsApp
        </h3>
        <p className="text-white/70">
          Conecte seu agente ao WhatsApp para começar a converter clientes reais
        </p>
      </div>

      {/* WhatsApp QR Code Integration */}
      <div>
        <Card className="bg-surface-base border-surface-stroke max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4 mx-auto">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-xl">Conectar ao WhatsApp</CardTitle>
            <CardDescription className="text-white/60">
              Conecte seu agente ao WhatsApp escaneando um QR Code
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Grátis • Fácil • Seguro</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-accent-start/20 flex items-center justify-center mx-auto">
                    <span className="text-accent-start font-bold">1</span>
                  </div>
                  <p className="text-white/70 text-sm">Clique em "Conectar"</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-accent-start/20 flex items-center justify-center mx-auto">
                    <span className="text-accent-start font-bold">2</span>
                  </div>
                  <p className="text-white/70 text-sm">Escaneie o QR Code</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-accent-start/20 flex items-center justify-center mx-auto">
                    <span className="text-accent-start font-bold">3</span>
                  </div>
                  <p className="text-white/70 text-sm">Agente ativo!</p>
                </div>
              </div>
            </div>
            
            <Alert className="border-green-500/30 bg-green-500/10">
              <Shield className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Sua conexão é segura e criptografada. Seus dados permanecem privados.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Connection */}
      <div>
        <Tabs defaultValue="connect" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-1 bg-surface-raised">
            <TabsTrigger value="connect" className="text-white">Conectar WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-6">
            <Card className="bg-surface-base border-surface-stroke">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Conectar ao WhatsApp
                </CardTitle>
                <CardDescription className="text-white/60">
                  Escaneie o QR Code para conectar seu WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionSteps.length === 0 ? (
                  <div className="text-center py-8">
                    <Button
                      onClick={() => {
                        setSelectedOption('qr-code')
                        testConnection()
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Conectar WhatsApp
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connectionSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-3 bg-surface-raised rounded-lg"
                      >
                        {getStatusIcon(step.status)}
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{step.title}</div>
                          <div className="text-white/60 text-xs">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {qrCode && (
                  <Card className="bg-surface-raised border-surface-stroke">
                    <CardHeader>
                      <CardTitle className="text-white text-base">
                        Escaneie o QR Code
                      </CardTitle>
                      <CardDescription>
                        Use seu WhatsApp para escanear este código
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                      <div className="text-white/60 text-sm">
                        1. Abra o WhatsApp no seu telefone<br/>
                        2. Vá em Configurações → Dispositivos conectados<br/>
                        3. Toque em "Conectar um dispositivo"<br/>
                        4. Escaneie este código
                      </div>
                    </CardContent>
                  </Card>
                )}

                {connectionStatus === 'connected' && (
                  <Alert className="border-green-500/30 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      WhatsApp conectado com sucesso! Seu agente está pronto para receber mensagens.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Help and Support */}
      <Card className="bg-surface-base border-surface-stroke max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Precisa de Ajuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-surface-stroke text-white/70 hover:text-white justify-start"
              onClick={() => window.open('#', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação
            </Button>
            <Button
              variant="outline"
              className="border-surface-stroke text-white/70 hover:text-white justify-start"
              onClick={() => window.open('#', '_blank')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Suporte Técnico
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            const config = {
              option: 'qr-code',
              connectionStatus,
              qrCode
            }
            updateWhatsappIntegration(config)
            completeStep('whatsapp-integration')
          }}
          disabled={connectionStatus !== 'connected'}
          className="bg-gradient-to-r from-accent-start to-accent-end hover:opacity-90 disabled:opacity-50"
        >
          Finalizar Integração
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}