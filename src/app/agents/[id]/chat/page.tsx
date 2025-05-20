import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata: Metadata = {
  title: "Chat with Agent",
  description: "Interact with your AI agent",
}

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Chat with Agent" text="Interact with your AI agent in real-time." />
      <div className="grid gap-8">
        <ChatInterface agentId={params.id} />
      </div>
    </DashboardShell>
  )
}
