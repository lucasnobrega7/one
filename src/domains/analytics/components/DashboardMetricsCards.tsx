"use client"

import { Grid, Users, MessageSquare, FileText, Bot } from "lucide-react"
import { MetricCard } from "./MetricCard"
import type { Metric } from "../types/analytics.types"

interface DashboardMetricsCardsProps {
  metrics: Metric[]
}

export function DashboardMetricsCards({ metrics }: DashboardMetricsCardsProps) {
  // Renderizar ícone com base no ID da métrica
  const renderIcon = (id: string) => {
    switch (id) {
      case "total-users":
        return <Users className="h-4 w-4" />
      case "total-conversations":
        return <MessageSquare className="h-4 w-4" />
      case "total-agents":
        return <Bot className="h-4 w-4" />
      case "total-documents":
        return <FileText className="h-4 w-4" />
      default:
        return <Grid className="h-4 w-4" />
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={{
            ...metric,
            icon: renderIcon(metric.id),
          }}
        />
      ))}
    </div>
  )
}
