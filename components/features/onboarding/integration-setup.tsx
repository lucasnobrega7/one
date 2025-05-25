"use client"

import { useState } from "react"
import { MessageSquare, Brain, CheckCircle, ExternalLink, Copy, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface IntegrationSetupProps {
  onComplete: (integrations: IntegrationData) => void
}

interface IntegrationData {
  whatsapp: {
    provider: 'z-api' | 'evolution' | 'official'
    token: string
    url?: string
    phoneNumber: string
  }
  openai: {
    apiKey: string
    model: string
  }
}

export function IntegrationSetup({ onComplete }: IntegrationSetupProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<'whatsapp' | 'openai' | 'complete'>('whatsapp')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showWhatsAppToken, setShowWhatsAppToken] = useState(false)
  
  const [integrations, setIntegrations] = useState<IntegrationData>({
    whatsapp: {
      provider: 'z-api',
      token: '',
      url: '',
      phoneNumber: ''
    },
    openai: {
      apiKey: '',
      model: 'gpt-4'
    }
  })

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate WhatsApp integration
    if (!integrations.whatsapp.token || !integrations.whatsapp.phoneNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do WhatsApp",
        variant: "destructive"
      })
      return
    }

    // Test WhatsApp connection (simulate)
    toast({
      title: "Testando conexão...",
      description: "Verificando integração do WhatsApp"
    })

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "WhatsApp conectado!",
        description: "Integração configurada com sucesso"
      })
      setCurrentStep('openai')
    }, 2000)
  }

  const handleOpenAISubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate OpenAI integration
    if (!integrations.openai.apiKey) {
      toast({
        title: "API Key obrigatória",
        description: "Insira sua chave da OpenAI",
        variant: "destructive"
      })
      return
    }

    // Test OpenAI connection (simulate)
    toast({
      title: "Testando API Key...",
      description: "Verificando integração da OpenAI"
    })

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "OpenAI conectada!",
        description: "Integração configurada com sucesso"
      })
      setCurrentStep('complete')
      onComplete(integrations)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência"
    })
  }

  if (currentStep === 'complete') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Integrações Configuradas!
          </h2>
          <p className="text-lg text-gray-300">
            Suas integrações foram configuradas com sucesso. Agora você pode criar seu primeiro agente AI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-green-600 bg-green-900/20">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-400 font-medium">WhatsApp</p>
              <p className="text-sm text-gray-300">{integrations.whatsapp.phoneNumber}</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-600 bg-blue-900/20">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-400 font-medium">OpenAI</p>
              <p className="text-sm text-gray-300">{integrations.openai.model}</p>
            </CardContent>
          </Card>
        </div>

        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => window.location.href = '/dashboard'}
        >
          Ir para o Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${
            currentStep === 'whatsapp' ? 'text-blue-500' : 'text-green-500'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'whatsapp' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {currentStep === 'whatsapp' ? '1' : <CheckCircle className="w-5 h-5" />}
            </div>
            <span className="font-medium">WhatsApp</span>
          </div>
          
          <div className="w-16 h-0.5 bg-zinc-700"></div>
          
          <div className={`flex items-center space-x-2 ${
            (currentStep as string) === 'openai' ? 'text-blue-500' : 
            (currentStep as string) === 'complete' ? 'text-green-500' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              (currentStep as string) === 'openai' ? 'bg-blue-600' : 
              (currentStep as string) === 'complete' ? 'bg-green-600' : 'bg-zinc-700'
            }`}>
              {(currentStep as string) === 'complete' ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <span className="font-medium">OpenAI</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Integration */}
      {currentStep === 'whatsapp' && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-500" />
              Integração do WhatsApp
            </CardTitle>
            <CardDescription>
              Conecte seu número do WhatsApp para começar a atender clientes via IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
              <div>
                <Label className="text-gray-300">Provedor do WhatsApp</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { id: 'z-api', name: 'Z-API', popular: true },
                    { id: 'evolution', name: 'Evolution API', popular: false },
                    { id: 'official', name: 'WhatsApp Business', popular: false }
                  ].map((provider) => (
                    <Button
                      key={provider.id}
                      type="button"
                      variant={integrations.whatsapp.provider === provider.id ? "default" : "outline"}
                      className={`relative ${
                        integrations.whatsapp.provider === provider.id 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => setIntegrations(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, provider: provider.id as any }
                      }))}
                    >
                      {provider.popular && (
                        <span className="absolute -top-2 -right-2 bg-green-600 text-xs px-1 py-0.5 rounded text-white">
                          Popular
                        </span>
                      )}
                      {provider.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp-token" className="text-gray-300">
                  Token/API Key
                </Label>
                <div className="relative">
                  <Input
                    id="whatsapp-token"
                    type={showWhatsAppToken ? "text" : "password"}
                    required
                    value={integrations.whatsapp.token}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, token: e.target.value }
                    }))}
                    className="bg-zinc-800 border-zinc-700 text-white pr-20"
                    placeholder="Cole seu token aqui"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                      className="h-8 w-8 p-0"
                    >
                      {showWhatsAppToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {integrations.whatsapp.provider !== 'official' && (
                <div>
                  <Label htmlFor="whatsapp-url" className="text-gray-300">
                    URL do Servidor (opcional)
                  </Label>
                  <Input
                    id="whatsapp-url"
                    type="url"
                    value={integrations.whatsapp.url}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, url: e.target.value }
                    }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="https://api.z-api.io"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="phone-number" className="text-gray-300">
                  Número do WhatsApp
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  required
                  value={integrations.whatsapp.phoneNumber}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                  }))}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="5511999999999"
                />
              </div>

              <Alert className="border-blue-600 bg-blue-900/20">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <AlertDescription className="text-blue-300">
                  <strong>Como obter seu token:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Acesse o painel da {integrations.whatsapp.provider === 'z-api' ? 'Z-API' : integrations.whatsapp.provider === 'evolution' ? 'Evolution API' : 'WhatsApp Business'}</li>
                    <li>• Copie seu token de API</li>
                    <li>• Cole no campo acima</li>
                  </ul>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-400 hover:text-blue-300"
                    onClick={() => window.open('https://developer.z-api.io', '_blank')}
                  >
                    Ver documentação <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Conectar WhatsApp
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* OpenAI Integration */}
      {currentStep === 'openai' && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              Integração da OpenAI
            </CardTitle>
            <CardDescription>
              Configure sua chave da OpenAI para alimentar os agentes AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenAISubmit} className="space-y-6">
              <div>
                <Label htmlFor="openai-key" className="text-gray-300">
                  API Key da OpenAI
                </Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showApiKey ? "text" : "password"}
                    required
                    value={integrations.openai.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      openai: { ...prev.openai, apiKey: e.target.value }
                    }))}
                    className="bg-zinc-800 border-zinc-700 text-white pr-20"
                    placeholder="sk-..."
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="h-8 w-8 p-0"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Modelo de IA</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { id: 'gpt-4', name: 'GPT-4', description: 'Mais inteligente' },
                    { id: 'gpt-3.5-turbo', name: 'GPT-3.5', description: 'Mais rápido' }
                  ].map((model) => (
                    <Button
                      key={model.id}
                      type="button"
                      variant={integrations.openai.model === model.id ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-start ${
                        integrations.openai.model === model.id 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => setIntegrations(prev => ({
                        ...prev,
                        openai: { ...prev.openai, model: model.id }
                      }))}
                    >
                      <span className="font-medium">{model.name}</span>
                      <span className="text-sm text-gray-400">{model.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Alert className="border-blue-600 bg-blue-900/20">
                <Brain className="w-4 h-4 text-blue-500" />
                <AlertDescription className="text-blue-300">
                  <strong>Como obter sua API Key:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Acesse platform.openai.com</li>
                    <li>• Vá em "API Keys"</li>
                    <li>• Clique em "Create new secret key"</li>
                    <li>• Copie e cole aqui</li>
                  </ul>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-400 hover:text-blue-300"
                    onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                  >
                    Abrir OpenAI <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('whatsapp')}
                  className="border-zinc-700 hover:border-zinc-600"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Conectar OpenAI
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}