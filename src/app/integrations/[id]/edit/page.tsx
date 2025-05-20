import { getCurrentUser } from "@/domains/auth/services/authService"
import { integrationService } from "@/domains/integrations/services/integrationService"
import { WhatsAppConfigForm } from "@/domains/integrations/components/WhatsAppConfigForm"
import { redirect } from "next/navigation"
import type { WhatsAppIntegration } from "@/domains/integrations/types"

export default async function EditIntegrationPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user || !user.organizationId) {
    redirect("/dashboard")
  }

  const integration = await integrationService.getIntegrationById(params.id)

  if (!integration) {
    redirect("/integrations")
  }

  // Verificar se o usuário tem acesso a esta integração
  if (integration.organizationId !== user.organizationId) {
    redirect("/integrations")
  }

  // Renderizar formulário específico com base no tipo de integração
  if (integration.type === "whatsapp") {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editar Integração WhatsApp</h1>
        <WhatsAppConfigForm integration={integration as WhatsAppIntegration} organizationId={user.organizationId} />
      </div>
    )
  }

  // Para outros tipos de integração, adicionar formulários específicos
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Integração</h1>
      <p>Formulário para o tipo {integration.type} ainda não implementado.</p>
    </div>
  )
}
