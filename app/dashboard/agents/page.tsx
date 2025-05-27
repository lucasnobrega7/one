import { PermissionGate } from "@/components/features/auth/permission-gate"
import { Permission } from "@/lib/auth/permissions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AgentsList } from "@/components/features/dashboard/agents-list"

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PermissionGate permission={Permission.ViewAgents}>
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Seus Agentes</h1>
              <p className="text-slate-600">Gerencie seus agentes conversacionais e configure suas funcionalidades</p>
            </div>

            <PermissionGate permission={Permission.CreateAgent}>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all" asChild>
                <Link href="/dashboard/agents/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Agente
                </Link>
              </Button>
            </PermissionGate>
          </div>

          <AgentsList />
        </div>
      </PermissionGate>
    </div>
  )
}
