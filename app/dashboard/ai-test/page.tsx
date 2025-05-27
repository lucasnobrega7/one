"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingDown,
  Sparkles
} from 'lucide-react'

interface AIResponse {
  content: string
  provider: string
  costMultiplier: number
  duration: number
  model?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  costs?: {
    openrouter: number
    openaiDirect: number
    savings: number
    savingsPercentage: string
  }
}

export default function AITestPage() {
  const [prompt, setPrompt] = useState('Como os agentes de IA podem ajudar empresas a converter mais clientes?')
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAI = async (budgetLevel: 'economy' | 'standard' | 'premium') => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Real API call to OpenRouter
      const apiResponse = await fetch('/api/test-openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          budgetLevel,
          taskType: 'general'
        })
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Erro na API')
      }

      if (data.success) {
        const apiResult = data.response
        setResponse({
          content: apiResult.content,
          provider: apiResult.provider,
          costMultiplier: budgetLevel === 'premium' ? 6.67 : 1.0,
          duration: apiResult.duration,
          model: apiResult.model,
          usage: apiResult.usage,
          costs: apiResult.costs
        })
      } else {
        throw new Error('Resposta inválida da API')
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com IA')
    } finally {
      setLoading(false)
    }
  }

  const calculateCost = (response: AIResponse) => {
    if (!response.usage) return 0
    
    // OpenRouter GPT-4o-mini pricing
    const inputCost = (response.usage.prompt_tokens / 1000000) * 0.15
    const outputCost = (response.usage.completion_tokens / 1000000) * 0.60
    return inputCost + outputCost
  }

  const calculateSavings = (response: AIResponse) => {
    const currentCost = calculateCost(response)
    const openaiDirectCost = currentCost * 6.67 // 6.67x mais caro
    return openaiDirectCost - currentCost
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          🧪 Teste de IA com OpenRouter
        </h1>
        <p className="text-white/70">
          Demonstração da integração OpenRouter com 85% de economia vs OpenAI direto
        </p>
      </div>

      {/* Cost Savings Alert */}
      <Alert className="bg-green-500/10 border-green-500/30">
        <TrendingDown className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-400">
          <strong>85% de economia</strong> implementada com OpenRouter vs OpenAI direto
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Teste de Prompt</CardTitle>
            <CardDescription className="text-white/60">
              Digite um prompt para testar a IA com diferentes níveis de orçamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite seu prompt aqui..."
              className="bg-surface-base border-surface-stroke text-white placeholder-white/50"
              rows={4}
            />

            <div className="space-y-3">
              <Button
                onClick={() => testAI('economy')}
                disabled={loading || !prompt.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Economia (Mais Barato)
              </Button>

              <Button
                onClick={() => testAI('standard')}
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Padrão (Balanceado)
              </Button>

              <Button
                onClick={() => testAI('premium')}
                disabled={loading || !prompt.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Premium (Máxima Qualidade)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Section */}
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Resposta da IA</CardTitle>
            <CardDescription className="text-white/60">
              Resultado do processamento com métricas de custo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-start"></div>
                  Processando com IA...
                </div>
                <Progress value={33} className="h-2" />
              </div>
            )}

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-base rounded-lg p-3">
                    <div className="text-white/70 text-xs">Provider</div>
                    <div className="text-white font-medium">
                      {response.provider}
                      {response.provider === 'openrouter' && (
                        <Badge className="ml-2 bg-green-500 text-white text-xs">
                          85% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface-base rounded-lg p-3">
                    <div className="text-white/70 text-xs">Tempo</div>
                    <div className="text-white font-medium">
                      {(response.duration / 1000).toFixed(2)}s
                    </div>
                  </div>

                  {(response.usage || response.costs) && (
                    <>
                      <div className="bg-surface-base rounded-lg p-3">
                        <div className="text-white/70 text-xs">Custo</div>
                        <div className="text-green-400 font-medium">
                          ${response.costs ? response.costs.openrouter.toFixed(6) : calculateCost(response).toFixed(6)}
                        </div>
                      </div>

                      <div className="bg-surface-base rounded-lg p-3">
                        <div className="text-white/70 text-xs">Economia</div>
                        <div className="text-green-400 font-medium">
                          {response.costs ? (
                            <>
                              ${response.costs.savings.toFixed(6)}
                              <div className="text-xs text-green-300">
                                ({response.costs.savingsPercentage}%)
                              </div>
                            </>
                          ) : (
                            `$${calculateSavings(response).toFixed(6)}`
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Response Content */}
                <div className="bg-surface-base rounded-lg p-4 border border-surface-stroke">
                  <div className="text-white/90 text-sm whitespace-pre-wrap">
                    {response.content}
                  </div>
                </div>

                {/* Usage Details */}
                {response.usage && (
                  <div className="text-xs text-white/50">
                    <div>Modelo: {response.model}</div>
                    <div>Tokens: {response.usage.total_tokens} ({response.usage.prompt_tokens} entrada + {response.usage.completion_tokens} saída)</div>
                    <div>Multiplicador de custo vs OpenAI: {response.costMultiplier}x</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Benefícios da Integração OpenRouter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">85%</div>
              <div className="text-sm text-white/60">Economia de Custos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">300+</div>
              <div className="text-sm text-white/60">Modelos Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-white/60">Uptime com Fallback</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}