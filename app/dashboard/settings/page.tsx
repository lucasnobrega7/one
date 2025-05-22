import { AuthCheck } from "@/components/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default function SettingsPage() {
  return (
    <AuthCheck>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Configurações</h1>

          <div className="bg-gray-800 rounded-lg p-6">
            <SettingsForm />
          </div>
        </div>
      </DashboardLayout>
    </AuthCheck>
  )
}
