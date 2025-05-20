import { UserProfile } from "@/src/components/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
      <UserProfile path="/profile" />
    </div>
  )
}
