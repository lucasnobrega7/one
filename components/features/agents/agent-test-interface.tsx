'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  Send, 
  Settings, 
  TestTube, 
  CheckCircle,
  AlertCircle,
  Bot,
  Globe,
  Smartphone,
  Code
} from 'lucide-react'

interface TestResult {
  id: string
  type: 'api' | 'whatsapp' | 'knowledge' | 'webhook'
  status: 'success' | 'error' | 'pending'
  message: string
  responseTime: number
  timestamp: Date
}

export function AgentTestInterface() {
  const [testMessage, setTestMessage] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async (type: string) => {
    setIsLoading(true)
    
    // Simular teste
    const newResult: TestResult = {
      id: Math.random().toString(),
      type: type as any,
      status: Math.random() > 0.3 ? 'success' : 'error',
      message: type === 'api' ? 'API respondeu corretamente' : 
               type === 'whatsapp' ? 'Mensagem enviada via WhatsApp' :
               type === 'knowledge' ? 'Base de conhecimento consultada' :
               'Webhook executado com sucesso',
      responseTime: Math.floor(Math.random() * 2000) + 100,
      timestamp: new Date()
    }
    
    setTestResults(prev => [newResult, ...prev])
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />
      default: return <div className="h-4 w-4 bg-yellow-400 rounded-full animate-pulse" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Code className="h-4 w-4" />
      case 'whatsapp': return <Smartphone className="h-4 w-4" />
      case 'knowledge': return <Bot className="h-4 w-4" />
      case 'webhook': return <Globe className="h-4 w-4" />
      default: return <TestTube className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="hero-card-langflow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Teste de Integrações</span>
          </CardTitle>
          <CardDescription>
            Teste suas integrações antes de ativar os atendimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat Test</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mensagem de Teste</label>
                  <Textarea
                    placeholder="Digite uma mensagem para testar o agente..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => runTest('api')}
                    disabled={isLoading || !testMessage}
                    className="btn-primary-langflow flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Testar via API
                  </Button>
                  <Button 
                    onClick={() => runTest('whatsapp')}
                    disabled={isLoading || !testMessage}
                    variant="outline"
                    className="btn-outline-langflow flex-1"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Testar WhatsApp
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hero-card-langflow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">Base de Conhecimento</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Ativo
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Testar consultas à base de conhecimento
                    </p>
                    <Button 
                      onClick={() => runTest('knowledge')}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Testar Conhecimento
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hero-card-langflow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <span className="font-medium">Webhooks</span>
                      </div>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        Configurar
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Testar chamadas de webhook
                    </p>
                    <Button 
                      onClick={() => runTest('webhook')}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Testar Webhook
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hero-card-langflow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-green-400" />
                        <span className="font-medium">Z-API WhatsApp</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Conectado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Status da integração WhatsApp
                    </p>
                    <Button 
                      onClick={() => runTest('whatsapp')}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Testar WhatsApp
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hero-card-langflow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">API Endpoints</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Online
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Testar endpoints da API
                    </p>
                    <Button 
                      onClick={() => runTest('api')}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Testar API
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum teste executado ainda</p>
                    <p className="text-sm">Execute testes para ver os resultados aqui</p>
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/20"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        {getTypeIcon(result.type)}
                        <div>
                          <p className="font-medium capitalize">{result.type}</p>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">{result.responseTime}ms</p>
                        <p className="text-xs text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}