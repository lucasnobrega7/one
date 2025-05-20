import { AgentList } from "@/domains/agents/components/AgentList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agentes | AI Platform",
  description: "Gerencie seus agentes de IA",
}

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-6">
      <AgentList />
    </div>
  )
}
