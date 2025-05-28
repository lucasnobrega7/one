"use client"

import { AuthCheck } from "@/components/features/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileForm } from "@/components/features/dashboard/profile-form"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()

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

export const dynamic = 'force-dynamic'
