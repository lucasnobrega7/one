"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { Agent } from "../types/agent.types"

interface AgentCardProps {
  agent: Agent
  onDelete?: (agent: Agent) => void
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
  const router = useRouter()

  const handleChatClick = () => {
    router.push(`/agents/${agent.id}/chat`)
  }

  const handleSettingsClick = () => {
    router.push(`/agents/${agent.id}/settings`)
  }

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(agent)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          {agent.iconUrl && (
            <img src={agent.iconUrl || "/placeholder.svg"} alt={agent.name} className="w-8 h-8 rounded-full mr-2" />
          )}
          {agent.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 line-clamp-2">{agent.description}</p>
        <div className="flex mt-4 space-x-2">
          <Badge variant="outline">{agent.modelName}</Badge>
          <Badge variant={agent.visibility === "public" ? "success" : "secondary"}>{agent.visibility}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleChatClick}>
          Chat
        </Button>
        <Button variant="outline" onClick={handleSettingsClick}>
          Configurações
        </Button>
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
            Excluir
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
