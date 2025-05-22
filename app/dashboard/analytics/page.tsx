import { AuthCheck } from "@/components/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <AuthCheck>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 border border-gray-600 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500">
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="12m">Últimos 12 meses</option>
              </select>
              <button className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded-md transition-colors">
                Exportar
              </button>
            </div>
          </div>

          <AnalyticsDashboard />
        </div>
      </DashboardLayout>
    </AuthCheck>
  )
}
