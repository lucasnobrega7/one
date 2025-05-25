export interface ConversationMetrics {
  id: string
  date: string
  totalConversations: number
  activeAgents: number
  responseTime: number
  satisfactionScore: number
  conversionRate: number
}

export interface AgentPerformance {
  id: string
  name: string
  conversationsHandled: number
  averageResponseTime: number
  satisfactionScore: number
  successfulConversions: number
  totalInteractions: number
}

export interface UserEngagement {
  date: string
  newUsers: number
  returningUsers: number
  sessionDuration: number
  pageViews: number
  bounceRate: number
}

export interface RevenueMetrics {
  date: string
  totalRevenue: number
  newSubscriptions: number
  churnRate: number
  averageRevenuePerUser: number
  monthlyRecurringRevenue: number
}

export interface AnalyticsData {
  overview: {
    totalConversations: number
    totalUsers: number
    totalAgents: number
    totalRevenue: number
    conversationGrowth: number
    userGrowth: number
    agentGrowth: number
    revenueGrowth: number
  }
  conversationMetrics: ConversationMetrics[]
  agentPerformance: AgentPerformance[]
  userEngagement: UserEngagement[]
  revenueMetrics: RevenueMetrics[]
  realTimeData: {
    activeUsers: number
    ongoingConversations: number
    systemLoad: number
    responseLatency: number
  }
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date
    end: Date
  }
  agentIds?: string[]
  userSegments?: string[]
  metrics?: string[]
}