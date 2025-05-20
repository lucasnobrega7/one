"use client"

import { UserProfile as ClerkUserProfile, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

interface UserProfileProps {
  path?: string
}

export function UserProfile({ path = "/profile" }: UserProfileProps) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium w-24">Email:</span>
              <span>{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Nome:</span>
              <span>{user?.fullName}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">ID:</span>
              <span>{user?.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkUserProfile path={path} routing="path" />
        </CardContent>
      </Card>
    </div>
  )
}
