import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Conversas - Agentes de Conversão',
  description: 'Gerencie e monitore todas as conversas dos seus agentes em tempo real.',
}

function ConversationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
          <span className="text-2xl">💬</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,429</div>
          <p className="text-xs text-muted-foreground">+12% vs ontem</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativas Agora</CardTitle>
          <span className="text-2xl">🟢</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">Em andamento</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa Resolução</CardTitle>
          <span className="text-2xl">✅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.2%</div>
          <p className="text-xs text-muted-foreground">+2.1% vs semana passada</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <span className="text-2xl">⏱️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.4min</div>
          <p className="text-xs text-muted-foreground">-18s vs média</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ConversationList() {
  const conversations = [
    {
      id: '1',
      customer: 'Lucas Silva',
      agent: 'Agente Vendas',
      status: 'active',
      lastMessage: 'Preciso de informações sobre o plano Pro',
      timestamp: '2 min atrás',
      priority: 'high'
    },
    {
      id: '2',
      customer: 'Maria Santos',
      agent: 'Agente Suporte',
      status: 'resolved',
      lastMessage: 'Obrigada! Problema resolvido.',
      timestamp: '15 min atrás',
      priority: 'low'
    },
    {
      id: '3',
      customer: 'João Oliveira',
      agent: 'Agente Vendas',
      status: 'waiting',
      lastMessage: 'Como posso integrar com meu sistema?',
      timestamp: '1 hora atrás',
      priority: 'medium'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Ativa</Badge>
      case 'waiting': return <Badge className="bg-yellow-500">Aguardando</Badge>
      case 'resolved': return <Badge className="bg-gray-500">Resolvida</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className={`border-l-4 ${getPriorityColor(conversation.priority)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold">{conversation.customer}</h3>
                  {getStatusBadge(conversation.status)}
                  <span className="text-sm text-muted-foreground">via {conversation.agent}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{conversation.lastMessage}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{conversation.timestamp}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ver Conversa
                </Button>
                {conversation.status === 'active' && (
                  <Button size="sm">
                    Responder
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ConversationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conversas</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie todas as conversas dos seus agentes
          </p>
        </div>
        <div className="flex gap-4">
          <Input 
            placeholder="Buscar conversas..." 
            className="w-80"
          />
          <Button>
            Filtros
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <ConversationStats />
      </Suspense>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Ativas (23)</TabsTrigger>
          <TabsTrigger value="waiting">Aguardando (7)</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
          <TabsTrigger value="archived">Arquivadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Suspense fallback={<div>Carregando conversas...</div>}>
            <ConversationList />
          </Suspense>
        </TabsContent>

        <TabsContent value="active">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Conversas Ativas</h3>
            <p className="text-muted-foreground">23 conversas em andamento</p>
          </div>
        </TabsContent>

        <TabsContent value="waiting">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Aguardando Resposta</h3>
            <p className="text-muted-foreground">7 conversas aguardando atendimento</p>
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Conversas Resolvidas</h3>
            <p className="text-muted-foreground">Últimas conversas concluídas</p>
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Conversas Arquivadas</h3>
            <p className="text-muted-foreground">Histórico de conversas arquivadas</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}