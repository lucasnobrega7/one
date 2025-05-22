import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Agentes de Conversão",
  description: "Painel de controle para gerenciar seus agentes de conversão",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Cartões de métricas */}
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Total de Conversas</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Taxa de Conversão</h3>
          <p className="text-3xl font-bold">23.5%</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Agentes Ativos</h3>
          <p className="text-3xl font-bold">8</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Tempo Médio de Resposta</h3>
          <p className="text-3xl font-bold">1.2s</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Gráficos e tabelas */}
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-4 text-xl font-medium">Atividade Recente</h3>
          {/* Tabela de atividades recentes */}
          <div className="h-80 rounded-lg bg-gray-100"></div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="mb-4 text-xl font-medium">Desempenho dos Agentes</h3>
          {/* Gráfico de desempenho */}
          <div className="h-80 rounded-lg bg-gray-100"></div>
        </div>
      </div>
    </div>
  )
}
