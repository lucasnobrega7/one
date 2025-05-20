import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChatInterface } from "@/domains/conversations/components/ChatInterface"
import { agentService } from "@/domains/agents/services/agentService"

interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const agent = await agentService.getAgentById(params.id)

  if (!agent) {
    return {
      title: "Agente não encontrado",
    }
  }

  return {
    title: `Chat com ${agent.name} | AI Platform`,
    description: agent.description,
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const agent = await agentService.getAgentById(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Chat com {agent.name}</h1>
      <p className="text-gray-500 mb-6">{agent.description}</p>

      <ChatInterface agentId={params.id} />
    </div>
  )
}
