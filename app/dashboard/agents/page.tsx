import { ProtectedRoute } from "@/components/auth/protected-route"
import { Permission } from "@/lib/auth/permissions"
import { AgentsList } from "@/components/dashboard/agents-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PermissionGate } from "@/components/auth/permission-gate"

export default function AgentsPage() {
  return (
    <ProtectedRoute permission={Permission.ViewAgents}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agentes</h1>

          <PermissionGate permission={Permission.CreateAgent}>
            <Button asChild>
              <Link href="/dashboard/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agente
              </Link>
            </Button>
          </PermissionGate>
        </div>

        <AgentsList />
      </div>
    </ProtectedRoute>
  )
}
