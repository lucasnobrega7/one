"use client"

import { useEffect, useState } from "react"
import { useAnalytics } from "@/domains/analytics/hooks/useAnalytics"
import { MetricCard } from "@/domains/analytics/components/MetricCard"
import { TimeRangeSelector } from "@/domains/analytics/components/TimeRangeSelector"
import { AnalyticsChart } from "@/domains/analytics/components/AnalyticsChart"
import type { ChartData, EventCount, MetricCard as MetricCardType } from "@/domains/analytics/types/analytics.types"
import { Users, MessageSquare, Bot, FileText } from "lucide-react"

export default function AnalyticsPage() {
  const { filter, setFilter, isLoading, error, getEventCounts, getEventTrends, getActiveUsers, getUserSegments } =
    useAnalytics()

  const [metrics, setMetrics] = useState<MetricCardType[]>([])
  const [eventCounts, setEventCounts] = useState<EventCount[]>([])
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] })

  useEffect(() => {
    async function loadData() {
      // Get active users
      const activeUsers = await getActiveUsers()

      // Get event counts
      const events = await getEventCounts([
        "agent_created",
        "agent_queried",
        "document_uploaded",
        "conversation_started",
      ])
      setEventCounts(events)

      // Get chart data
      const trends = await getEventTrends(["agent_queried", "conversation_started"])
      setChartData(trends)

      // Create metrics
      const newMetrics: MetricCardType[] = [
        {
          title: "Active Users",
          value: activeUsers.daily,
          change: {
            value: 12,
            isPositive: true,
          },
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "Total Conversations",
          value: events.find((e) => e.name === "conversation_started")?.count || 0,
          change: {
            value: 8,
            isPositive: true,
          },
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          title: "Agents Created",
          value: events.find((e) => e.name === "agent_created")?.count || 0,
          change: {
            value: 5,
            isPositive: true,
          },
          icon: <Bot className="h-4 w-4" />,
        },
        {
          title: "Documents Uploaded",
          value: events.find((e) => e.name === "document_uploaded")?.count || 0,
          change: {
            value: 3,
            isPositive: false,
          },
          icon: <FileText className="h-4 w-4" />,
        },
      ]

      setMetrics(newMetrics)
    }

    loadData()
  }, [filter])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <TimeRangeSelector filter={filter} onChange={setFilter} />
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsChart title="User Activity" data={chartData} type="line" />
        <AnalyticsChart
          title="Event Distribution"
          data={{
            labels: eventCounts.map((e) => e.name),
            datasets: [
              {
                label: "Count",
                data: eventCounts.map((e) => e.count),
                backgroundColor: "rgba(99, 102, 241, 0.5)",
                borderColor: "rgba(99, 102, 241, 1)",
              },
            ],
          }}
          type="bar"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Event Tracking Guide</h2>
        <div className="bg-gray-800 p-4 rounded-md">
          <pre className="text-gray-100 overflow-x-auto">
            <code>{`
// Track a simple event
import { trackEvent } from '@/lib/analytics';

trackEvent('button_clicked', { buttonName: 'create_agent' });

// Track a page view
import { trackPageView } from '@/lib/analytics';

trackPageView('/dashboard');

// Identify a user
import { identifyUser } from '@/lib/analytics';

identifyUser(user.id, {
  name: user.name,
  email: user.email,
  plan: user.subscription.plan
});
            `}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
