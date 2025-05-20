import type { Metric, ChartData, AnalyticsFilter } from "../types"

/**
 * Serviço para gerenciar métricas e análises
 */
export const metricsService = {
  /**
   * Obtém métricas resumidas para o dashboard
   */
  async getDashboardMetrics(organizationId: string): Promise<Metric[]> {
    // Implementação simplificada - em um cenário real, isso consultaria o banco de dados
    return [
      {
        id: "total-agents",
        name: "Total de Agentes",
        value: 12,
        unit: "agentes",
        change: 2,
        period: "month",
      },
      {
        id: "total-conversations",
        name: "Total de Conversas",
        value: 1234,
        unit: "conversas",
        change: 15,
        period: "month",
      },
      {
        id: "active-users",
        name: "Usuários Ativos",
        value: 342,
        unit: "usuários",
        change: 5,
        period: "month",
      },
      {
        id: "kb-size",
        name: "Tamanho da Base de Conhecimento",
        value: 2.4,
        unit: "GB",
        change: 0.3,
        period: "month",
      },
    ]
  },

  /**
   * Obtém dados para gráficos de conversas
   */
  async getConversationsChartData(organizationId: string, filter?: AnalyticsFilter): Promise<ChartData> {
    // Implementação simplificada - em um cenário real, isso consultaria o banco de dados
    return {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Conversas",
          data: [120, 190, 300, 250, 400, 380],
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 1,
        },
      ],
    }
  },

  /**
   * Obtém dados para gráficos de uso de agentes
   */
  async getAgentUsageChartData(organizationId: string, filter?: AnalyticsFilter): Promise<ChartData> {
    // Implementação simplificada - em um cenário real, isso consultaria o banco de dados
    return {
      labels: ["Agente 1", "Agente 2", "Agente 3", "Agente 4", "Agente 5"],
      datasets: [
        {
          label: "Consultas",
          data: [500, 320, 280, 250, 200],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  },

  /**
   * Obtém dados para gráficos de uso de datastores
   */
  async getDatastoreUsageChartData(organizationId: string, filter?: AnalyticsFilter): Promise<ChartData> {
    // Implementação simplificada - em um cenário real, isso consultaria o banco de dados
    return {
      labels: ["Datastore 1", "Datastore 2", "Datastore 3", "Datastore 4"],
      datasets: [
        {
          label: "Consultas",
          data: [400, 300, 200, 100],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  },
}
