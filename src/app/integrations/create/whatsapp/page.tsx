import { getCurrentUser } from "@/domains/auth/services/authService"
import { WhatsAppConfigForm } from "@/domains/integrations/components/WhatsAppConfigForm"
import { redirect } from "next/navigation"

export default async function CreateWhatsAppIntegrationPage() {
  const user = await getCurrentUser()

  if (!user || !user.organizationId) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configurar Integração WhatsApp</h1>
      <WhatsAppConfigForm organizationId={user.organizationId} />
    </div>
  )
}
