import { getCurrentUser } from "@/domains/auth/services/authService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Slack } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CreateIntegrationPage() {
  const user = await getCurrentUser()

  if (!user || !user.organizationId) {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Integração</h1>
      <p className="text-gray-400 mb-8">Selecione o tipo de integração que deseja adicionar</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0] transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-6 w-6 text-green-500 mr-2" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Conecte seu agente ao WhatsApp para interagir com seus usuários através do aplicativo de mensagens.
            </p>
            <Button asChild>
              <Link href="/integrations/create/whatsapp">Configurar WhatsApp</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a] hover:border-[#46B2E0] transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Slack className="h-6 w-6 text-blue-500 mr-2" />
              Slack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Integre seu agente ao Slack para responder perguntas e interagir com sua equipe.
            </p>
            <Button asChild>
              <Link href="/integrations/create/slack">Configurar Slack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
