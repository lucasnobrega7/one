"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Dados de exemplo para os gráficos
const conversationData = [
  { name: "Seg", value: 24 },
  { name: "Ter", value: 32 },
  { name: "Qua", value: 28 },
  { name: "Qui", value: 42 },
  { name: "Sex", value: 38 },
  { name: "Sáb", value: 20 },
  { name: "Dom", value: 16 },
]

const conversionData = [
  { name: "Seg", value: 8 },
  { name: "Ter", value: 12 },
  { name: "Qua", value: 10 },
  { name: "Qui", value: 15 },
  { name: "Sex", value: 14 },
  { name: "Sáb", value: 7 },
  { name: "Dom", value: 5 },
]

const agentPerformanceData = [
  { name: "Agente de Vendas", value: 45 },
  { name: "Agente de Suporte", value: 35 },
  { name: "Agente de Onboarding", value: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function AnalyticsDashboard() {
  // Simulação de dados para métricas
  const metrics = {
    totalConversations: 1248,
    totalConversions: 231,
    conversionRate: 18.5,
    averageResponseTime: "45s",
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total de Conversas</h3>
          <div className="text-3xl font-bold">{metrics.totalConversations}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total de Conversões</h3>
          <div className="text-3xl font-bold">{metrics.totalConversions}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Taxa de Conversão</h3>
          <div className="text-3xl font-bold">{metrics.conversionRate}%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Tempo Médio de Resposta</h3>
          <div className="text-3xl font-bold">{metrics.averageResponseTime}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Conversas por Dia</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Conversões por Dia</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Desempenho por Hora do Dia</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { hour: "00:00", conversas: 5, conversoes: 1 },
                  { hour: "03:00", conversas: 3, conversoes: 0 },
                  { hour: "06:00", conversas: 8, conversoes: 2 },
                  { hour: "09:00", conversas: 25, conversoes: 6 },
                  { hour: "12:00", conversas: 18, conversoes: 4 },
                  { hour: "15:00", conversas: 30, conversoes: 8 },
                  { hour: "18:00", conversas: 22, conversoes: 5 },
                  { hour: "21:00", conversas: 12, conversoes: 3 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="hour" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="conversas" name="Conversas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Desempenho por Agente</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {agentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
