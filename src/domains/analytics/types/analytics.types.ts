import type React from "react"
export interface MetricCard {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  description?: string
  icon?: React.ReactNode
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface AnalyticsFilter {
  timeRange: TimeRange
  granularity: "hour" | "day" | "week" | "month"
  segment?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

export interface EventCount {
  name: string
  count: number
  previousCount?: number
}

export interface UserSegment {
  id: string
  name: string
  count: number
  criteria: Record<string, any>
}
