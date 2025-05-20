import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentForm } from "@/components/agents/agent-form"

export const metadata: Metadata = {
  title: "Create Agent",
  description: "Create a new AI agent",
}

export default function CreateAgentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Agent" text="Create a new AI agent with custom capabilities." />
      <div className="grid gap-8">
        <AgentForm />
      </div>
    </DashboardShell>
  )
}
