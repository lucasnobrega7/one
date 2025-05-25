"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { analyticsService } from "@/lib/analytics/service"
import { AnalyticsOverview } from "./analytics-overview"
import { ConversationChart } from "./conversation-chart"
import { AgentPerformanceTable } from "./agent-performance-table"
import { RealTimeMetrics } from "./real-time-metrics"
import { usePermissions } from "@/hooks/use-permissions"
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics"

export function AnalyticsDashboard() {
  const { hasPermission } = usePermissions()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    start: Date
    end: Date
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  })

  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange,
  })

  const canExport = hasPermission("analytics:export")

  useEffect(() => {
    loadAnalyticsData()
  }, [filters])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const analyticsData = await analyticsService.getAnalyticsData(filters)
      setData(analyticsData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: "csv" | "pdf" | "xlsx") => {
    try {
      const blob = await analyticsService.exportAnalytics(filters, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting analytics:", error)
    }
  }

  const updateDateRange = (start: Date, end: Date) => {
    const newDateRange = { start, end }
    setDateRange(newDateRange)
    setFilters(prev => ({
      ...prev,
      dateRange: newDateRange,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando analytics...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar dados de analytics</p>
        <Button onClick={loadAnalyticsData} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitore o desempenho dos seus agentes e conversas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.start, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(dateRange.end, "dd/MM/yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Data Inicial</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.start}
                      onSelect={(date) => date && updateDateRange(date, dateRange.end)}
                      disabled={(date) => date > dateRange.end}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Final</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.end}
                      onSelect={(date) => date && updateDateRange(dateRange.start, date)}
                      disabled={(date) => date < dateRange.start || date > new Date()}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {canExport && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid gap-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleExport("csv")}
                  >
                    Exportar CSV
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleExport("xlsx")}
                  >
                    Exportar Excel
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleExport("pdf")}
                  >
                    Exportar PDF
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Button onClick={loadAnalyticsData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real-time metrics badge */}
      <div className="flex justify-end">
        <Badge variant="outline" className="text-green-600 border-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
          Dados em tempo real
        </Badge>
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview data={data.overview} />

      {/* Real-time metrics */}
      <RealTimeMetrics data={data.realTimeData} />

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversações</TabsTrigger>
          <TabsTrigger value="agents">Performance dos Agentes</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <ConversationChart data={data.conversationMetrics} />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <AgentPerformanceTable data={data.agentPerformance} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento de Usuários</CardTitle>
              <CardDescription>
                Métricas de engajamento e comportamento dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gráficos de engajamento em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Receita</CardTitle>
              <CardDescription>
                Análise de receita e crescimento financeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gráficos de receita em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}