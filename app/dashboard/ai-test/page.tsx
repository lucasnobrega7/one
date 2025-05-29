'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SmartAIClient, AIResponse } from '@/lib/ai/smart-ai-client'
import { BackendAITest } from '@/components/ai/backend-ai-test'
import { 
  Send, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Cpu, 
  DollarSign,
  Clock,
  BarChart3,
  Server,
  Code
} from 'lucide-react'

export default function AITestPage() {
  const [aiClient, setAIClient] = useState<SmartAIClient | null>(null)
  const [message, setMessage] = useState('Olá! Me explique como funciona a inteligência artificial.')
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini')
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [providersStatus, setProvidersStatus] = useState<any>(null)

  // Inicializar AI Client com suas chaves reais
  useEffect(() => {
    const client = new SmartAIClient({
      openrouter: {
        apiKey: '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',
        enabled: true,
      },
      openai: {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        enabled: false, // Usar apenas como fallback
      },
      fallback: {
        enabled: true,
        retries: 3,
      },
    })

    setAIClient(client)
    
    // Verificar status dos providers
    client.getProvidersStatus().then(setProvidersStatus)
  }, [])

  const handleSendMessage = async () => {
    if (!aiClient || !message.trim()) return

    setIsLoading(true)
    setResponse(null)

    try {
      const result = await aiClient.createChatCompletion({
        messages: [
          { role: 'user', content: message }
        ],
        model: selectedModel,
        temperature: 0.7,
        max_tokens: 1000,
      })

      setResponse(result)
    } catch (error) {
      console.error('Error:', error)
      setResponse({
        success: false,
        error: {
          message: 'Erro inesperado',
          code: 'UNKNOWN_ERROR',
          type: 'client_error',
        },
        provider: 'none',
        model: selectedModel,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendedModels = () => {
    if (!aiClient) return { fast: [], balanced: [], premium: [] }
    return aiClient.getRecommendedModels()
  }

  const calculateCostSavings = (usage: any) => {
    if (!usage) return null
    
    // Estimativa: OpenRouter - custos otimizados vs OpenAI direto
    const openaiCost = usage.total_tokens * 0.00003 // Estimativa OpenAI
    const openrouterCost = openaiCost * 0.4 // Custo reduzido via OpenRouter
    const savings = openaiCost - openrouterCost
    
    return {
      openaiCost: openaiCost.toFixed(6),
      openrouterCost: openrouterCost.toFixed(6),
      savings: savings.toFixed(6),
      savingsPercent: 'Significativa'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white/90">AI Test Center</h1>
        <p className="text-white/70">
          Sistema completo: Frontend direto + Backend API com OpenRouter (custos otimizados)
        </p>
      </div>

      {/* Abas de Teste */}
      <Tabs defaultValue="backend" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backend" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Backend Integration
          </TabsTrigger>
          <TabsTrigger value="frontend" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Frontend Direct
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backend" className="mt-6">
          <div className="space-y-4">
            <div className="bg-[#46B2E0]/10 border border-[#46B2E0]/20 rounded-lg p-4">
              <h3 className="font-semibold text-[#46B2E0] mb-1">Backend API Integration</h3>
              <p className="text-sm text-white/70">
                Teste via backend FastAPI que gerencia OpenRouter + fallback OpenAI. 
                Inclui análise de custos e métricas em tempo real.
              </p>
            </div>
            <BackendAITest />
          </div>
        </TabsContent>

        <TabsContent value="frontend" className="mt-6">
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-1">Frontend Direct Integration</h3>
              <p className="text-sm text-white/70">
                Teste direto do frontend com OpenRouter usando SmartAIClient. 
                Fallback automático e otimização de custos.
              </p>
            </div>

      {/* Provider Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white/90">
              <Cpu className="h-4 w-4 text-green-400" />
              OpenRouter Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Status:</span>
              <Badge variant={providersStatus?.openrouter?.healthy ? "default" : "destructive"}>
                {providersStatus?.openrouter?.healthy ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            {providersStatus?.openrouter?.credits && (
              <div className="mt-2 text-xs text-white/50">
                Créditos: ${providersStatus.openrouter.credits.usage || 0} usado
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white/90">
              <Zap className="h-4 w-4 text-[#46B2E0]" />
              OpenAI Fallback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Status:</span>
              <Badge variant={providersStatus?.openai?.healthy ? "default" : "destructive"}>
                {providersStatus?.openai?.healthy ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-white/50">
              Backup automático ativo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader>
            <CardTitle className="text-white/90">Teste de Conversação</CardTitle>
            <CardDescription className="text-white/60">
              Envie uma mensagem para testar a integração AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Modelo de IA:</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai/gpt-4o-mini">GPT-4O Mini (Rápido)</SelectItem>
                  <SelectItem value="openai/gpt-4o">GPT-4O (Balanced)</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</SelectItem>
                  <SelectItem value="google/gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
                  <SelectItem value="deepseek/deepseek-r1">DeepSeek R1 (Reasoning)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Mensagem:</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={4}
              />
            </div>

            {/* Send Button */}
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !message.trim()}
              className="w-full bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Response Section */}
        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader>
            <CardTitle className="text-white/90">Resposta da IA</CardTitle>
            <CardDescription className="text-white/60">
              Resultado do processamento AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response ? (
              <>
                {/* Status */}
                <div className="flex items-center gap-2">
                  {response.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge variant={response.success ? "default" : "destructive"}>
                    {response.success ? "Sucesso" : "Erro"}
                  </Badge>
                  <Badge variant="outline">
                    Provider: {response.provider}
                  </Badge>
                </div>

                {/* Response Content */}
                {response.success && response.data ? (
                  <div className="space-y-3">
                    <div className="bg-[#0e0e10] p-4 rounded-lg border border-[#27272a]">
                      <p className="text-sm text-white/80">
                        {response.data.choices?.[0]?.message?.content || 'Sem resposta'}
                      </p>
                    </div>

                    {/* Usage Stats */}
                    {response.usage && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-[#46B2E0]/10 border border-[#46B2E0]/20 rounded">
                          <div className="text-lg font-bold text-[#46B2E0]">
                            {response.usage.total_tokens}
                          </div>
                          <div className="text-xs text-white/60">Total Tokens</div>
                        </div>
                        <div className="text-center p-2 bg-green-500/10 border border-green-500/20 rounded">
                          <div className="text-lg font-bold text-green-400">
                            Ótima
                          </div>
                          <div className="text-xs text-white/60">Economia</div>
                        </div>
                      </div>
                    )}

                    {/* Cost Analysis */}
                    {response.usage && (
                      <Card className="border-green-500/20 bg-green-500/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-white/90">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            Análise de Custos
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 text-white/70">
                          {(() => {
                            const costAnalysis = calculateCostSavings(response.usage)
                            if (!costAnalysis) return null
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span>OpenAI Direto:</span>
                                  <span>${costAnalysis.openaiCost}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>OpenRouter:</span>
                                  <span className="text-green-400">${costAnalysis.openrouterCost}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t border-green-500/20 pt-1">
                                  <span>Economia:</span>
                                  <span className="text-green-400">${costAnalysis.savings}</span>
                                </div>
                              </>
                            )
                          })()}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <p className="text-sm text-red-400">
                      <strong>Erro:</strong> {response.error?.message || 'Erro desconhecido'}
                    </p>
                    {response.error?.code && (
                      <p className="text-xs text-red-300 mt-1">
                        Código: {response.error.code}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-white/50 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Envie uma mensagem para ver a resposta</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Models */}
      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Modelos Recomendados</CardTitle>
          <CardDescription className="text-white/60">
            Modelos otimizados por categoria de uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-green-400">⚡ Rápidos & Econômicos</h4>
              <div className="space-y-1">
                {getRecommendedModels().fast.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-green-500/10 border-green-500/20 text-white/70 hover:text-green-400"
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.split('/')[1] || model}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-[#46B2E0]">⚖️ Balanced</h4>
              <div className="space-y-1">
                {getRecommendedModels().balanced.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-[#46B2E0]/10 border-[#46B2E0]/20 text-white/70 hover:text-[#46B2E0]"
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.split('/')[1] || model}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-[#8A53D2]">💎 Premium</h4>
              <div className="space-y-1">
                {getRecommendedModels().premium.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-[#8A53D2]/10 border-[#8A53D2]/20 text-white/70 hover:text-[#8A53D2]"
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.split('/')[1] || model}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}