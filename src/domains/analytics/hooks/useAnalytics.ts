"use client"

import { useState, useEffect } from "react"
import type { Metric, ChartData, AnalyticsFilter } from "../types/analytics.types"
import { useToast } from "@/hooks/use-toast"

interface UseAnalyticsProps {
  organizationId: string
  filter?: AnalyticsFilter
}

/**
 * Hook para gerenciar dados de análise
 */
export function useAnalytics({ organizationId, filter }: UseAnalyticsProps) {
  const [dashboardMetrics, setDashboardMetrics] = useState<Metric[]>([])
  const [conversationsChartData, setConversationsChartData] = useState<ChartData | null>(null)
  const [agentUsageChartData, setAgentUsageChartData] = useState<ChartData | null>(null)
  const [datastoreUsageChartData, setDatastoreUsageChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulação de dados para demonstração
        // Em um ambiente real, esses dados viriam de uma API

        // Métricas do dashboard
        setDashboardMetrics([
          {
            id: "total-users",
            name: "Usuários Ativos",
            value: 1250,
            change: { value: 12.5, isPositive: true },
            icon: "users",
          },
          {
            id: "total-conversations",
            name: "Conversas",
            value: 8432,
            change: { value: 8.2, isPositive: true },
            icon: "message-square",
          },
          {
            id: "total-agents",
            name: "Agentes",
            value: 24,
            change: { value: 4.1, isPositive: true },
            icon: "bot",
          },
          {
            id: "total-documents",
            name: "Documentos",
            value: 156,
            change: { value: 2.3, isPositive: false },
            icon: "file-text",
          },
        ])

        // Dados de gráficos
        setConversationsChartData({
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
          datasets: [
            {
              label: "Conversas",
              data: [320, 420, 380, 520, 490, 550, 620],
              borderColor: "#8A53D2",
              backgroundColor: "rgba(138, 83, 210, 0.1)",
            },
          ],
        })

        setAgentUsageChartData({
          labels: ["Assistente Geral", "FAQ", "Vendas", "Suporte", "Outros"],
          datasets: [
            {
              label: "Uso de Agentes",
              data: [45, 25, 15, 10, 5],
              backgroundColor: ["#46B2E0", "#8A53D2", "#E056A0", "#5D5FEF", "#9747FF"],
            },
          ],
        })

        setDatastoreUsageChartData({
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
          datasets: [
            {
              label: "Documentos Adicionados",
              data: [12, 19, 15, 22, 18, 25, 30],
              borderColor: "#46B2E0",
              backgroundColor: "rgba(70, 178, 224, 0.1)",
            },
            {
              label: "Consultas",
              data: [65, 85, 90, 120, 110, 130, 150],
              borderColor: "#E056A0",
              backgroundColor: "rgba(224, 86, 160, 0.1)",
            },
          ],
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados de análise"
        setError(new Error(errorMessage))
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [organizationId, filter, toast])

  return {
    dashboardMetrics,
    conversationsChartData,
    agentUsageChartData,
    datastoreUsageChartData,
    isLoading,
    error,
  }
}
