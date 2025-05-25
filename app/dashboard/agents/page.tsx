import { RoleGuard } from "@/components/auth/role-guard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AgentsPage() {
  return (
    <RoleGuard requiredPermission="agents:read">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agentes</h1>

          <RoleGuard requiredPermission="agents:create">
            <Button asChild>
              <Link href="/dashboard/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agente
              </Link>
            </Button>
          </RoleGuard>
        </div>

        <div className="grid gap-4">
          <p className="text-muted-foreground">Lista de agentes em desenvolvimento...</p>
        </div>
      </div>
    </RoleGuard>
  )
}
