'use client';

/**
 * Componente de Teste - Integração Backend AI
 * Conecta frontend com backend usando OpenRouter (custos otimizados)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Send, 
  Zap, 
  Brain, 
  Code, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Server,
  Globe
} from 'lucide-react';
import { useBackendAI, useBackendChat, useBackendModels, useBackendAIStatus } from '@/hooks/use-backend-ai';

export function BackendAITest() {
  const { models, fast, balanced, premium, isLoading: modelsLoading } = useBackendModels();
  const { status, isHealthy, refresh: refreshStatus } = useBackendAIStatus();
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [testMessage, setTestMessage] = useState('Explique como funciona a inteligência artificial em poucas palavras.');

  const { 
    messages, 
    isLoading: chatLoading, 
    error: chatError,
    lastResponse,
    send, 
    clear,
    setCurrentModel 
  } = useBackendChat(selectedModel);

  // Atualizar modelo do chat quando seleção mudar
  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel, setCurrentModel]);

  // Enviar mensagem de teste
  const handleTest = async () => {
    if (!testMessage.trim()) return;

    try {
      await send(testMessage);
    } catch (error: any) {
      console.error('Test failed:', error);
    }
  };

  // Status dos providers
  const getProviderStatus = (provider: 'openrouter' | 'openai') => {
    if (!status || !status[provider]) return 'unknown';
    if (status[provider].healthy) return 'healthy';
    if (status[provider].enabled) return 'error';
    return 'disabled';
  };

  const StatusIcon = ({ status: providerStatus }: { status: string }) => {
    switch (providerStatus) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled': return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Status da API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6" />
            Backend AI Integration
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy ? "Online" : "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status OpenRouter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">OpenRouter</p>
                    <p className="text-sm text-gray-500">
                      {models.length} modelos
                    </p>
                  </div>
                  <StatusIcon status={getProviderStatus('openrouter')} />
                </div>
                {status?.openrouter?.credits && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      Créditos disponíveis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status OpenAI Fallback */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">OpenAI</p>
                    <p className="text-sm text-gray-500">Fallback</p>
                  </div>
                  <StatusIcon status={getProviderStatus('openai')} />
                </div>
              </CardContent>
            </Card>

            {/* Margem de Lucro */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Margem</p>
                    <p className="text-sm text-gray-500">OpenRouter</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    87%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Status Backend */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backend</p>
                    <p className="text-sm text-gray-500">v2.0</p>
                  </div>
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={refreshStatus} 
            variant="outline" 
            size="sm" 
            className="mt-4"
          >
            <Activity className="w-4 h-4 mr-2" />
            Atualizar Status
          </Button>
        </CardContent>
      </Card>

      {/* Seletor de Modelos */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos ({models.length})</TabsTrigger>
              <TabsTrigger value="fast">
                <Zap className="w-4 h-4 mr-1" />
                Rápidos ({fast.length})
              </TabsTrigger>
              <TabsTrigger value="balanced">
                <Brain className="w-4 h-4 mr-1" />
                Balanceados ({balanced.length})
              </TabsTrigger>
              <TabsTrigger value="premium">
                <TrendingUp className="w-4 h-4 mr-1" />
                Premium ({premium.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.category}
                        </Badge>
                        {model.supports_tools && (
                          <Badge variant="secondary" className="text-xs">
                            Tools
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="fast" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fast.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {model.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="balanced" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {balanced.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {model.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="premium" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {premium.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {model.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {modelsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando modelos do backend...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teste de Chat */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Chat Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configurações */}
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary">
              Modelo: {selectedModel}
            </Badge>
            <Badge variant="outline">
              Provider: {lastResponse?.provider || 'Nenhum'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
            >
              Limpar Chat
            </Button>
          </div>

          {/* Mensagens */}
          <div className="border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Nenhuma mensagem ainda. Teste a integração backend!
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <p className="font-medium text-sm mb-1">
                    {message.role === 'user' ? 'Você' : 'IA'}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ))
            )}

            {chatLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando no backend...</span>
              </div>
            )}
          </div>

          {/* Análise de Custos da Última Resposta */}
          {lastResponse?.cost_analysis && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Análise de Custos (87% Margem)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">OpenAI Direto:</p>
                    <p className="font-bold">${lastResponse.cost_analysis.openai_estimated_cost.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">OpenRouter:</p>
                    <p className="font-bold text-green-600">${lastResponse.cost_analysis.openrouter_cost.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Economia:</p>
                    <p className="font-bold text-green-600">
                      ${lastResponse.cost_analysis.savings.toFixed(6)} (87%)
                    </p>
                  </div>
                </div>
                {lastResponse.usage && (
                  <div className="border-t pt-2 text-xs text-gray-600">
                    Tokens: {lastResponse.usage.total_tokens} ({lastResponse.usage.prompt_tokens} input + {lastResponse.usage.completion_tokens} output)
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {chatError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {chatError}
              </AlertDescription>
            </Alert>
          )}

          {/* Input */}
          <div className="space-y-2">
            <Textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Digite sua mensagem de teste..."
              rows={3}
            />
            <Button 
              onClick={handleTest} 
              disabled={chatLoading || !testMessage.trim() || !isHealthy}
              className="w-full"
            >
              {chatLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Testar via Backend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Modelo Selecionado */}
      {models.find(m => m.id === selectedModel) && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const model = models.find(m => m.id === selectedModel);
              if (!model) return null;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informações</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {model.id}</p>
                      <p><strong>Nome:</strong> {model.name}</p>
                      <p><strong>Categoria:</strong> {model.category}</p>
                      <p><strong>Contexto:</strong> {model.context_length?.toLocaleString() || 'N/A'} tokens</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Capacidades</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        {model.supports_tools ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span>Function Calling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {model.supports_vision ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span>Visão/Imagens</span>
                      </div>
                    </div>
                    
                    {model.pricing && (
                      <div className="mt-3">
                        <h5 className="font-medium text-sm mb-1">Preços</h5>
                        <div className="text-xs space-y-1">
                          <p>Input: ${(model.pricing.prompt * 1000000).toFixed(4)}/M tokens</p>
                          <p>Output: ${(model.pricing.completion * 1000000).toFixed(4)}/M tokens</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BackendAITest;