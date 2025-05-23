import { AuthCheck } from "@/components/features/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileForm } from "@/components/features/dashboard/profile-form"
import { auth } from "@/config/auth"

export default async function ProfilePage() {
  const session = await auth()

  return (
    <AuthCheck>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>

          <div className="bg-gray-800 rounded-lg p-6">
            <ProfileForm user={session?.user} />
          </div>
        </div>
      </DashboardLayout>
    </AuthCheck>
  )
}
