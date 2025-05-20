import type { ChartData, EventCount, TimeRange, UserSegment } from "../types/analytics.types"

/**
 * Service for fetching and processing analytics data
 */
export const analyticsService = {
  /**
   * Get event counts for the specified time range
   */
  async getEventCounts(
    eventNames: string[],
    timeRange: TimeRange,
    previousTimeRange?: TimeRange,
  ): Promise<EventCount[]> {
    // In a real implementation, this would use PostHog's API
    // For now, we'll simulate with random data

    const counts = eventNames.map((name) => {
      const count = Math.floor(Math.random() * 1000)
      const previousCount = previousTimeRange ? Math.floor(Math.random() * 1000) : undefined

      return {
        name,
        count,
        previousCount,
      }
    })

    return counts
  },

  /**
   * Get chart data for events over time
   */
  async getEventTrends(
    eventNames: string[],
    timeRange: TimeRange,
    granularity: "hour" | "day" | "week" | "month",
  ): Promise<ChartData> {
    // Generate labels based on granularity
    const labels = generateTimeLabels(timeRange, granularity)

    // Generate random data for each event
    const datasets = eventNames.map((name, index) => {
      const data = labels.map(() => Math.floor(Math.random() * 100))

      return {
        label: name,
        data,
        borderColor: getColorForIndex(index),
        backgroundColor: getColorForIndex(index, 0.2),
      }
    })

    return {
      labels,
      datasets,
    }
  },

  /**
   * Get active users for different time periods
   */
  async getActiveUsers(timeRange: TimeRange): Promise<Record<string, number>> {
    // Simulate data
    return {
      daily: Math.floor(Math.random() * 500),
      weekly: Math.floor(Math.random() * 2000),
      monthly: Math.floor(Math.random() * 5000),
    }
  },

  /**
   * Get user segments
   */
  async getUserSegments(): Promise<UserSegment[]> {
    // Simulate data
    return [
      {
        id: "1",
        name: "Power Users",
        count: Math.floor(Math.random() * 500),
        criteria: { events_performed: ">10 per week" },
      },
      {
        id: "2",
        name: "New Users",
        count: Math.floor(Math.random() * 300),
        criteria: { created_at: "last 7 days" },
      },
      {
        id: "3",
        name: "Inactive Users",
        count: Math.floor(Math.random() * 1000),
        criteria: { last_seen: ">30 days ago" },
      },
    ]
  },

  /**
   * Get conversion funnel data
   */
  async getFunnelData(steps: string[], timeRange: TimeRange): Promise<number[]> {
    // Simulate funnel data with decreasing values
    let currentValue = Math.floor(Math.random() * 1000) + 500
    return steps.map(() => {
      const stepValue = currentValue
      currentValue = Math.floor(currentValue * (0.7 + Math.random() * 0.2))
      return stepValue
    })
  },
}

// Helper functions
function generateTimeLabels(timeRange: TimeRange, granularity: "hour" | "day" | "week" | "month"): string[] {
  const { start, end } = timeRange
  const labels: string[] = []
  const current = new Date(start)

  while (current <= end) {
    let label = ""

    switch (granularity) {
      case "hour":
        label = current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        current.setHours(current.getHours() + 1)
        break
      case "day":
        label = current.toLocaleDateString([], { month: "short", day: "numeric" })
        current.setDate(current.getDate() + 1)
        break
      case "week":
        label = `Week ${Math.ceil((current.getDate() + current.getDay()) / 7)}`
        current.setDate(current.getDate() + 7)
        break
      case "month":
        label = current.toLocaleDateString([], { month: "short" })
        current.setMonth(current.getMonth() + 1)
        break
    }

    labels.push(label)
  }

  return labels
}

function getColorForIndex(index: number, alpha = 1): string {
  const colors = [
    `rgba(70, 178, 224, ${alpha})`, // Blue
    `rgba(138, 83, 210, ${alpha})`, // Purple
    `rgba(224, 86, 160, ${alpha})`, // Pink
    `rgba(99, 102, 241, ${alpha})`, // Indigo
    `rgba(16, 185, 129, ${alpha})`, // Green
    `rgba(245, 158, 11, ${alpha})`, // Amber
    `rgba(239, 68, 68, ${alpha})`, // Red
  ]

  return colors[index % colors.length]
}
