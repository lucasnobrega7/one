import { PermissionGate } from "@/components/features/auth/permission-gate"
import { Permission } from "@/lib/auth/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <PermissionGate permission={Permission.ViewAnalytics}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white/90">Analytics</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0]/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Conversas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/90">1,234</div>
              <p className="text-xs text-green-400">
                +20% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0]/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Agentes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/90">23</div>
              <p className="text-xs text-green-400">
                +15% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0]/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/90">85%</div>
              <p className="text-xs text-green-400">
                +5% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0]/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Tempo de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/90">1.2s</div>
              <p className="text-xs text-green-400">
                -10% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader>
            <CardTitle className="text-white/90">Dashboard Avançado</CardTitle>
            <CardDescription className="text-white/60">
              Analytics detalhado em desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70">
              Gráficos e métricas avançadas serão implementados em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  )
}
