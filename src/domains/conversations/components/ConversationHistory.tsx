"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { queryService } from "../services/queryService"
import type { Conversation } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConversationHistoryProps {
  userId: string
  agentId?: string
}

/**
 * Componente para exibir o histórico de conversas
 */
export function ConversationHistory({ userId, agentId }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true)
      try {
        const data = await queryService.getConversations(userId, agentId)
        setConversations(
          data.map((conv) => ({
            id: conv.id,
            agentId: conv.agent_id,
            userId: conv.user_id,
            title: conv.title,
            createdAt: new Date(conv.created_at),
            updatedAt: new Date(conv.updated_at),
            messages: [],
          })),
        )
      } catch (error) {
        console.error("Erro ao buscar conversas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [userId, agentId])

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await queryService.deleteConversation(id)
      setConversations((prev) => prev.filter((conv) => conv.id !== id))
    } catch (error) {
      console.error("Erro ao excluir conversa:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Conversas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma conversa encontrada. Inicie uma nova conversa.
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer"
                onClick={() => router.push(`/agents/${conversation.agentId}/chat/${conversation.id}`)}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{conversation.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conversation.updatedAt, { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
