'use client';

/**
 * Componente de Teste Unificado - OpenRouter Integration
 * Sistema completo com 300+ modelos e custos otimizados
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Send, 
  Zap, 
  Brain, 
  Code, 
  Eye, 
  Globe, 
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { useAI, useChat, useModels, useAIStatus } from '@/hooks/use-ai-unified';

export function AITestUnified() {
  const { models, economical, balanced, premium, isLoading: modelsLoading } = useModels();
  const { status, isHealthy, refresh: refreshStatus } = useAIStatus();
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [testMessage, setTestMessage] = useState('Explique o conceito de inteligência artificial em poucas palavras.');
  const [useStreaming, setUseStreaming] = useState(true);

  const { 
    messages, 
    isLoading: chatLoading, 
    error: chatError,
    send, 
    stream, 
    clear,
    setCurrentModel 
  } = useChat(selectedModel);

  // Atualizar modelo do chat quando seleção mudar
  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel, setCurrentModel]);

  // Enviar mensagem de teste
  const handleTest = async () => {
    if (!testMessage.trim()) return;

    try {
      if (useStreaming) {
        await stream(testMessage);
      } else {
        await send(testMessage);
      }
    } catch (error: any) {
      console.error('Test failed:', error);
    }
  };

  // Categorizar modelos
  const categorizeModels = () => {
    if (!models.length) return { fast: [], balanced: [], premium: [] };

    return {
      fast: models.filter(m => 
        m.id.includes('mini') || 
        m.id.includes('haiku') || 
        m.id.includes('flash') ||
        m.id.includes('8b')
      ),
      balanced: models.filter(m => 
        m.id.includes('gpt-4o') || 
        m.id.includes('sonnet') || 
        m.id.includes('pro') ||
        m.id.includes('70b')
      ),
      premium: models.filter(m => 
        m.id.includes('o1') || 
        m.id.includes('opus') || 
        m.id.includes('405b')
      )
    };
  };

  const categorizedModels = categorizeModels();

  // Status dos providers
  const getProviderStatus = (provider: string) => {
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
      {/* Header com Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Sistema de IA Unificado
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy ? "Ativo" : "Inativo"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status OpenRouter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">OpenRouter</p>
                    <p className="text-sm text-gray-500">
                      {models.length} modelos disponíveis
                    </p>
                  </div>
                  <StatusIcon status={getProviderStatus('openrouter')} />
                </div>
                {status?.openrouter?.credits && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      Créditos: ${status.openrouter.credits.limit || 'Unlimited'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status OpenAI */}
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
                    <p className="font-medium">Custos</p>
                    <p className="text-sm text-gray-500">Otimizados</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Eficiente
                  </Badge>
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
          <CardTitle>Seletor de Modelos IA</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="fast">
                <Zap className="w-4 h-4 mr-1" />
                Rápidos
              </TabsTrigger>
              <TabsTrigger value="balanced">
                <BarChart3 className="w-4 h-4 mr-1" />
                Balanceados
              </TabsTrigger>
              <TabsTrigger value="premium">
                <Brain className="w-4 h-4 mr-1" />
                Premium
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
                        <span>{model.name || model.id}</span>
                        {model.pricing && (
                          <Badge variant="outline" className="text-xs">
                            ${(model.pricing.prompt * 1000000).toFixed(2)}/M
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
                {categorizedModels.fast.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {model.name || model.id}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="balanced" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categorizedModels.balanced.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {model.name || model.id}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="premium" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categorizedModels.premium.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "outline"}
                    onClick={() => setSelectedModel(model.id)}
                    className="justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {model.name || model.id}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {modelsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando modelos...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teste de Chat */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configurações */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              Modelo: {selectedModel}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseStreaming(!useStreaming)}
            >
              {useStreaming ? "Streaming: ON" : "Streaming: OFF"}
            </Button>
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
                Nenhuma mensagem ainda. Teste o sistema abaixo!
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
                <span>IA está pensando...</span>
              </div>
            )}
          </div>

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
              disabled={chatLoading || !testMessage.trim()}
              className="w-full"
            >
              {chatLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {useStreaming ? 'Testar Streaming' : 'Testar Envio'}
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
                    <h4 className="font-medium mb-2">Informações Básicas</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {model.id}</p>
                      <p><strong>Nome:</strong> {model.name || 'N/A'}</p>
                      <p><strong>Contexto:</strong> {model.context_length?.toLocaleString() || 'N/A'} tokens</p>
                    </div>
                  </div>
                  
                  {model.pricing && (
                    <div>
                      <h4 className="font-medium mb-2">Preços</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Input:</strong> ${(model.pricing.prompt * 1000000).toFixed(4)}/M tokens</p>
                        <p><strong>Output:</strong> ${(model.pricing.completion * 1000000).toFixed(4)}/M tokens</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AITestUnified;