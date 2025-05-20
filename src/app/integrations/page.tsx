import { getCurrentUser } from "@/domains/auth/services/authService"
import { integrationService } from "@/domains/integrations/services/integrationService"
import { IntegrationCard } from "@/domains/integrations/components/IntegrationCard"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function IntegrationsPage() {
  const user = await getCurrentUser()

  if (!user || !user.organizationId) {
    redirect("/dashboard")
  }

  const integrations = await integrationService.getIntegrations(user.organizationId)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Integrações</h1>
        <Button asChild>
          <Link href="/integrations/create">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Integração
          </Link>
        </Button>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-12 bg-[#1a1a1d] border border-[#27272a] rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Nenhuma integração encontrada</h2>
          <p className="text-gray-400 mb-4">Adicione sua primeira integração para começar</p>
          <Button asChild>
            <Link href="/integrations/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Integração
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={(integration) => `/integrations/${integration.id}/edit`}
              onDelete={(integration) => `/integrations/${integration.id}/delete`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
