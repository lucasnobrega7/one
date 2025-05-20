import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetricsCards } from "@/domains/analytics/components/DashboardMetricsCards"
import { AgentList } from "@/domains/agents/components/AgentList"
import { getCurrentUser } from "@/domains/auth/services/authService"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard | AI Platform",
  description: "Visão geral da sua plataforma de agentes de IA",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardMetricsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agentes Recentes</CardTitle>
            <CardDescription>Seus agentes mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <AgentList limit={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas interações com seus agentes</CardDescription>
          </CardHeader>
          <CardContent>{/* Componente de atividade recente */}</CardContent>
        </Card>
      </div>
    </div>
  )
}
