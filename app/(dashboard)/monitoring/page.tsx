import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Monitoramento - Agentes de Conversão',
  description: 'Monitore o desempenho e status dos seus agentes em tempo real.',
}

function SystemHealthCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
          <span className="text-2xl">⚡</span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-lg font-semibold">Operacional</span>
          </div>
          <p className="text-xs text-muted-foreground">Uptime: 99.97%</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
          <span className="text-2xl">🤖</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12/15</div>
          <Progress value={80} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">80% dos agentes online</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
          <span className="text-2xl">🚀</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.2s</div>
          <p className="text-xs text-muted-foreground">Médio nas últimas 24h</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AgentStatusList() {
  const agents = [
    {
      id: '1',
      name: 'Agente Vendas Pro',
      status: 'online',
      conversations: 8,
      responseTime: '0.8s',
      satisfaction: 4.8,
      uptime: '99.9%'
    },
    {
      id: '2',
      name: 'Agente Suporte',
      status: 'online',
      conversations: 12,
      responseTime: '1.1s',
      satisfaction: 4.9,
      uptime: '100%'
    },
    {
      id: '3',
      name: 'Agente Vendas Básico',
      status: 'warning',
      conversations: 3,
      responseTime: '2.1s',
      satisfaction: 4.2,
      uptime: '98.1%'
    },
    {
      id: '4',
      name: 'Agente FAQ',
      status: 'offline',
      conversations: 0,
      responseTime: '-',
      satisfaction: 4.7,
      uptime: '0%'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-500">Online</Badge>
      case 'warning': return <Badge className="bg-yellow-500">Atenção</Badge>
      case 'offline': return <Badge className="bg-red-500">Offline</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'border-l-green-500'
      case 'warning': return 'border-l-yellow-500'
      case 'offline': return 'border-l-red-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Card key={agent.id} className={`border-l-4 ${getStatusColor(agent.status)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  {getStatusBadge(agent.status)}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Conversas Ativas</span>
                    <div className="font-semibold">{agent.conversations}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tempo de Resposta</span>
                    <div className="font-semibold">{agent.responseTime}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Satisfação</span>
                    <div className="font-semibold">{agent.satisfaction}/5.0</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime 24h</span>
                    <div className="font-semibold">{agent.uptime}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
                {agent.status === 'offline' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Reiniciar
                  </Button>
                )}
                {agent.status === 'warning' && (
                  <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-600">
                    Investigar
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

function AlertsList() {
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Tempo de resposta elevado',
      description: 'Agente Vendas Básico com tempo médio de 2.1s',
      timestamp: '5 min atrás',
      agent: 'Agente Vendas Básico'
    },
    {
      id: '2',
      type: 'error',
      title: 'Agente offline',
      description: 'Agente FAQ não está respondendo há 15 minutos',
      timestamp: '15 min atrás',
      agent: 'Agente FAQ'
    },
    {
      id: '3',
      type: 'info',
      title: 'Pico de conversas',
      description: 'Volume 40% acima da média nas últimas 2 horas',
      timestamp: '1 hora atrás',
      agent: 'Sistema'
    }
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500'
      case 'warning': return 'border-l-yellow-500'
      case 'info': return 'border-l-blue-500'
      default: return 'border-l-gray-500'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <span className="text-xl">{getAlertIcon(alert.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{alert.timestamp}</span>
                  <span>•</span>
                  <span>{alert.agent}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Resolver
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MonitoringPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento</h1>
          <p className="text-muted-foreground">
            Acompanhe o status e desempenho dos seus agentes em tempo real
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            Configurar Alertas
          </Button>
          <Button>
            Relatório de Status
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Carregando status do sistema...</div>}>
        <SystemHealthCards />
      </Suspense>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agents">Status dos Agentes</TabsTrigger>
          <TabsTrigger value="alerts">Alertas (3)</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="live">Ao Vivo</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <Suspense fallback={<div>Carregando agentes...</div>}>
            <AgentStatusList />
          </Suspense>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alertas Recentes</h3>
            <Button variant="outline" size="sm">
              Marcar Todos como Lidos
            </Button>
          </div>
          <Suspense fallback={<div>Carregando alertas...</div>}>
            <AlertsList />
          </Suspense>
        </TabsContent>

        <TabsContent value="performance">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Métricas de Performance</h3>
            <p className="text-muted-foreground">Gráficos de desempenho e análises detalhadas</p>
          </div>
        </TabsContent>

        <TabsContent value="live">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Monitoramento Ao Vivo</h3>
            <p className="text-muted-foreground">Conversas em tempo real e atividade dos agentes</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}