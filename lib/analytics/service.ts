import type { AnalyticsData, AnalyticsFilters, ConversationMetrics, AgentPerformance } from "@/types/analytics"

export class AnalyticsService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.agentesdeconversao.com.br"
  }

  async getAnalyticsData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      return response.json()
    } catch (error) {
      // Return mock data for development
      return this.getMockAnalyticsData()
    }
  }

  async getConversationMetrics(filters: AnalyticsFilters): Promise<ConversationMetrics[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch conversation metrics")
      }

      return response.json()
    } catch (error) {
      return this.getMockConversationMetrics()
    }
  }

  async getAgentPerformance(filters: AnalyticsFilters): Promise<AgentPerformance[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch agent performance")
      }

      return response.json()
    } catch (error) {
      return this.getMockAgentPerformance()
    }
  }

  async exportAnalytics(filters: AnalyticsFilters, format: "csv" | "pdf" | "xlsx"): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/analytics/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...filters, format }),
    })

    if (!response.ok) {
      throw new Error("Failed to export analytics")
    }

    return response.blob()
  }

  // Mock data for development
  private getMockAnalyticsData(): AnalyticsData {
    const today = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return {
      overview: {
        totalConversations: 15234,
        totalUsers: 8567,
        totalAgents: 23,
        totalRevenue: 125430,
        conversationGrowth: 12.5,
        userGrowth: 8.3,
        agentGrowth: 15.2,
        revenueGrowth: 22.1,
      },
      conversationMetrics: last30Days.map((date, index) => ({
        id: `conv-${index}`,
        date,
        totalConversations: Math.floor(Math.random() * 100) + 50,
        activeAgents: Math.floor(Math.random() * 20) + 5,
        responseTime: Math.floor(Math.random() * 5000) + 1000,
        satisfactionScore: Math.random() * 2 + 3,
        conversionRate: Math.random() * 20 + 10,
      })),
      agentPerformance: this.getMockAgentPerformance(),
      userEngagement: last30Days.map((date) => ({
        date,
        newUsers: Math.floor(Math.random() * 50) + 10,
        returningUsers: Math.floor(Math.random() * 100) + 50,
        sessionDuration: Math.floor(Math.random() * 600) + 300,
        pageViews: Math.floor(Math.random() * 1000) + 500,
        bounceRate: Math.random() * 30 + 20,
      })),
      revenueMetrics: last30Days.map((date) => ({
        date,
        totalRevenue: Math.floor(Math.random() * 10000) + 5000,
        newSubscriptions: Math.floor(Math.random() * 20) + 5,
        churnRate: Math.random() * 5 + 2,
        averageRevenuePerUser: Math.floor(Math.random() * 100) + 50,
        monthlyRecurringRevenue: Math.floor(Math.random() * 50000) + 25000,
      })),
      realTimeData: {
        activeUsers: Math.floor(Math.random() * 200) + 50,
        ongoingConversations: Math.floor(Math.random() * 50) + 10,
        systemLoad: Math.random() * 80 + 10,
        responseLatency: Math.floor(Math.random() * 500) + 100,
      },
    }
  }

  private getMockConversationMetrics(): ConversationMetrics[] {
    const today = new Date()
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      return {
        id: `conv-${i}`,
        date: date.toISOString().split('T')[0],
        totalConversations: Math.floor(Math.random() * 100) + 50,
        activeAgents: Math.floor(Math.random() * 20) + 5,
        responseTime: Math.floor(Math.random() * 5000) + 1000,
        satisfactionScore: Math.random() * 2 + 3,
        conversionRate: Math.random() * 20 + 10,
      }
    }).reverse()
  }

  private getMockAgentPerformance(): AgentPerformance[] {
    const agents = [
      "Agente de Vendas",
      "Agente de Suporte",
      "Agente de Marketing",
      "Agente de Conhecimento",
      "Agente de Onboarding",
    ]

    return agents.map((name, index) => ({
      id: `agent-${index}`,
      name,
      conversationsHandled: Math.floor(Math.random() * 500) + 100,
      averageResponseTime: Math.floor(Math.random() * 3000) + 1000,
      satisfactionScore: Math.random() * 2 + 3,
      successfulConversions: Math.floor(Math.random() * 50) + 10,
      totalInteractions: Math.floor(Math.random() * 1000) + 200,
    }))
  }
}

export const analyticsService = new AnalyticsService()