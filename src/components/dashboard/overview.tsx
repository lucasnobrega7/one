"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Calendar, MessageSquare, Users, Bot } from "lucide-react"
import { Loader2 } from "lucide-react" // Import Loader2

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnalyticsData {
  overview: {
    total_agents: number
    total_conversations: number
    total_messages: number
    active_users: number
  }
  time_series: Array<{
    date: string
    conversations: number
    messages: number
  }>
}

export function Overview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics?timeRange=${timeRange}`)

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }

        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : data?.overview.total_agents || 0}</div>
            <p className="text-xs text-muted-foreground">AI agents ready to assist</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : data?.overview.total_conversations || 0}</div>
            <p className="text-xs text-muted-foreground">Conversations with your agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : data?.overview.total_messages || 0}</div>
            <p className="text-xs text-muted-foreground">Messages exchanged with agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : data?.overview.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">Users engaging with your agents</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversations Over Time</CardTitle>
              <CardDescription>
                Number of conversations with your agents over the past{" "}
                {timeRange === "30d" ? "30 days" : timeRange === "7d" ? "7 days" : "24 hours"}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Button
                  variant={timeRange === "24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("24h")}
                >
                  24h
                </Button>
                <Button
                  variant={timeRange === "7d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("7d")}
                >
                  7d
                </Button>
                <Button
                  variant={timeRange === "30d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("30d")}
                >
                  30d
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : data?.time_series ? (
                  <ChartContainer
                    config={{
                      conversations: {
                        label: "Conversations",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.time_series}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          }}
                        />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="conversations"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            style: { fill: "var(--color-conversations)", opacity: 0.8 },
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages Over Time</CardTitle>
              <CardDescription>
                Number of messages exchanged with your agents over the past{" "}
                {timeRange === "30d" ? "30 days" : timeRange === "7d" ? "7 days" : "24 hours"}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Button
                  variant={timeRange === "24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("24h")}
                >
                  24h
                </Button>
                <Button
                  variant={timeRange === "7d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("7d")}
                >
                  7d
                </Button>
                <Button
                  variant={timeRange === "30d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("30d")}
                >
                  30d
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : data?.time_series ? (
                  <ChartContainer
                    config={{
                      messages: {
                        label: "Messages",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.time_series}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          }}
                        />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="messages"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            style: { fill: "var(--color-messages)", opacity: 0.8 },
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Button({ children, variant = "outline", size = "default", onClick }) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
        ${
          variant === "default"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        }
        ${size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 py-2"}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
