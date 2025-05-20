import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentList } from "@/components/agents/agent-list"

export const metadata: Metadata = {
  title: "Agents",
  description: "Manage your AI agents",
}

export default function AgentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Agents" text="Create and manage your AI agents.">
        <Link href="/agents/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        </Link>
      </DashboardHeader>
      <AgentList />
    </DashboardShell>
  )
}
