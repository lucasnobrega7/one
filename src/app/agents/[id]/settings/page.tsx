import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentForm } from "@/components/agents/agent-form"

export const metadata: Metadata = {
  title: "Agent Settings",
  description: "Configure your AI agent",
}

interface SettingsPageProps {
  params: {
    id: string
  }
}

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Agent Settings" text="Configure your AI agent's behavior and capabilities." />
      <div className="grid gap-8">
        <AgentForm agentId={params.id} />
      </div>
    </DashboardShell>
  )
}
