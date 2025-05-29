import { AuthCheck } from "@/components/features/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsForm } from "@/components/features/dashboard/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white/90">Configurações</h1>

      <div className="bg-[#1a1a1d] border border-[#27272a] rounded-lg p-6">
        <SettingsForm />
      </div>
    </div>
  )
}
