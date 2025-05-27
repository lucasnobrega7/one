'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SmartAIClient, AIResponse } from '@/lib/ai/smart-ai-client'
import { 
  Send, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Cpu, 
  DollarSign,
  Clock,
  BarChart3
} from 'lucide-react'

export default function AITestPage() {
  const [aiClient, setAIClient] = useState<SmartAIClient | null>(null)
  const [message, setMessage] = useState('Olá! Me explique como funciona a inteligência artificial.')
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini')
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [providersStatus, setProvidersStatus] = useState<any>(null)

  // Inicializar AI Client
  useEffect(() => {
    const client = new SmartAIClient({
      openrouter: {
        apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
        enabled: true,
      },
      openai: {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        enabled: true,
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
    
    // Estimativa: OpenRouter = 87% margem vs OpenAI direto
    const openaiCost = usage.total_tokens * 0.00003 // Estimativa OpenAI
    const openrouterCost = openaiCost * 0.13 // 13% do custo original = 87% economia
    const savings = openaiCost - openrouterCost
    
    return {
      openaiCost: openaiCost.toFixed(6),
      openrouterCost: openrouterCost.toFixed(6),
      savings: savings.toFixed(6),
      savingsPercent: 87
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Test Center</h1>
        <p className="text-muted-foreground">
          Teste a integração OpenRouter + Smart AI Client com 87% margem de lucro
        </p>
      </div>

      {/* Provider Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-green-600" />
              OpenRouter Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={providersStatus?.openrouter?.healthy ? "default" : "destructive"}>
                {providersStatus?.openrouter?.healthy ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            {providersStatus?.openrouter?.credits && (
              <div className="mt-2 text-xs text-muted-foreground">
                Créditos: ${providersStatus.openrouter.credits.usage || 0} usado
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              OpenAI Fallback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={providersStatus?.openai?.healthy ? "default" : "destructive"}>
                {providersStatus?.openai?.healthy ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Backup automático ativo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Conversação</CardTitle>
            <CardDescription>
              Envie uma mensagem para testar a integração AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Modelo de IA:</label>
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
              <label className="text-sm font-medium">Mensagem:</label>
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
              className="w-full"
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
        <Card>
          <CardHeader>
            <CardTitle>Resposta da IA</CardTitle>
            <CardDescription>
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
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm">
                        {response.data.choices?.[0]?.message?.content || 'Sem resposta'}
                      </p>
                    </div>

                    {/* Usage Stats */}
                    {response.usage && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {response.usage.total_tokens}
                          </div>
                          <div className="text-xs text-blue-600">Total Tokens</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                          <div className="text-lg font-bold text-green-600">
                            87%
                          </div>
                          <div className="text-xs text-green-600">Economia</div>
                        </div>
                      </div>
                    )}

                    {/* Cost Analysis */}
                    {response.usage && (
                      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            Análise de Custos
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1">
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
                                  <span className="text-green-600">${costAnalysis.openrouterCost}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-1">
                                  <span>Economia:</span>
                                  <span className="text-green-600">${costAnalysis.savings} (87%)</span>
                                </div>
                              </>
                            )
                          })()}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                    <p className="text-sm text-red-600">
                      <strong>Erro:</strong> {response.error?.message || 'Erro desconhecido'}
                    </p>
                    {response.error?.code && (
                      <p className="text-xs text-red-500 mt-1">
                        Código: {response.error.code}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Envie uma mensagem para ver a resposta</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Models */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos Recomendados</CardTitle>
          <CardDescription>
            Modelos otimizados por categoria de uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-green-600">⚡ Rápidos & Econômicos</h4>
              <div className="space-y-1">
                {getRecommendedModels().fast.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-green-50"
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.split('/')[1] || model}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-blue-600">⚖️ Balanced</h4>
              <div className="space-y-1">
                {getRecommendedModels().balanced.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-blue-50"
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.split('/')[1] || model}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-purple-600">💎 Premium</h4>
              <div className="space-y-1">
                {getRecommendedModels().premium.map((model) => (
                  <Badge 
                    key={model} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-purple-50"
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
  )
}