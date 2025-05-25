export interface AnalyticsOverview {
  totalAgents: number
  totalConversations: number
  totalMessages: number
  conversionRate: number
  averageResponseTime: number
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date
    end: Date
  }
  agentIds?: string[]
  userId?: string
}

export interface ConversationMetrics {
  daily: Array<{
    date: string
    conversations: number
    messages: number
  }>
  hourly: Array<{
    hour: number
    conversations: number
  }>
}

export interface AgentPerformance {
  agentId: string
  agentName: string
  conversations: number
  messages: number
  avgResponseTime: number
  satisfactionScore: number
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  conversationMetrics: ConversationMetrics
  agentPerformance: AgentPerformance[]
  realTimeData: {
    activeUsers: number
    ongoingConversations: number
    messagesLastHour: number
  }
}
