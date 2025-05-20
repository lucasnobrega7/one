// Tipos relacionados ao domínio de analytics

export interface Metric {
  id: string
  name: string
  value: number
  unit: string
  change?: number
  period: "day" | "week" | "month" | "year"
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

export interface AnalyticsFilter {
  startDate?: Date
  endDate?: Date
  agentId?: string
  datastoreId?: string
  groupBy?: "day" | "week" | "month"
}
