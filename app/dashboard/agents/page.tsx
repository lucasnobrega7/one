import { PermissionGate } from "@/components/features/auth/permission-gate"
import { Permission } from "@/lib/auth/permissions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AgentsList } from "@/components/features/dashboard/agents-list"

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <PermissionGate permission={Permission.ViewAgents}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white/90 mb-2">Seus Agentes</h1>
            <p className="text-white/70">Gerencie seus agentes conversacionais e configure suas funcionalidades</p>
          </div>

          <PermissionGate permission={Permission.CreateAgent}>
            <Button className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" asChild>
              <Link href="/dashboard/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Agente
              </Link>
            </Button>
          </PermissionGate>
        </div>

        <AgentsList />
      </PermissionGate>
    </div>
  )
}
