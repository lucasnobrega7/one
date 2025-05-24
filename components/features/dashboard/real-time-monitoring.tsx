'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface ConversationActivity {
  id: string
  agentName: string
  status: 'active' | 'waiting' | 'resolved'
  lastMessage: string
  timestamp: Date
  platform: 'whatsapp' | 'website' | 'api'
}

export function RealTimeMonitoring() {
  const [activities, setActivities] = useState<ConversationActivity[]>([])
  const [stats, setStats] = useState({
    activeConversations: 12,
    totalUsers: 156,
    avgResponseTime: '2.3s',
    successRate: 94
  })

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular nova atividade
      const newActivity: ConversationActivity = {
        id: Math.random().toString(),
        agentName: `Agente ${Math.floor(Math.random() * 5) + 1}`,
        status: ['active', 'waiting', 'resolved'][Math.floor(Math.random() * 3)] as any,
        lastMessage: 'Nova conversa iniciada...',
        timestamp: new Date(),
        platform: ['whatsapp', 'website', 'api'][Math.floor(Math.random() * 3)] as any
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'waiting': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-blue-400" />
      default: return <AlertTriangle className="h-4 w-4 text-red-400" />
    }
  }

  const getPlatformBadge = (platform: string) => {
    const colors = {
      whatsapp: 'bg-green-500/20 text-green-400',
      website: 'bg-blue-500/20 text-blue-400', 
      api: 'bg-purple-500/20 text-purple-400'
    }
    return colors[platform as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hero-card-langflow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversas Ativas</p>
                <p className="text-2xl font-bold">{stats.activeConversations}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hero-card-langflow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hero-card-langflow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Resposta</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hero-card-langflow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card className="hero-card-langflow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Atividade em Tempo Real</span>
              </CardTitle>
              <CardDescription>
                Monitoramento de conversas e interações dos agentes
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Ao vivo</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="font-medium">{activity.agentName}</p>
                    <p className="text-sm text-muted-foreground">{activity.lastMessage}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={getPlatformBadge(activity.platform)}
                  >
                    {activity.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                  <Button variant="ghost" size="sm">
                    Intervir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}