"use client"

import { useState, useEffect, useCallback } from "react"
import { agentService } from "@/domains/agents/services/agentService"
import { conversationService } from "../services/conversationService"
import type { Message } from "../types/conversation.types"

/**
 * Hook para gerenciar uma conversa com um agente
 */
export function useConversation(agentId: string, initialConversationId?: string) {
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Carregar mensagens existentes se houver um conversationId
  useEffect(() => {
    async function loadMessages() {
      if (!conversationId) return

      try {
        setIsLoading(true)
        const loadedMessages = await conversationService.getMessages(conversationId)
        setMessages(loadedMessages)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load messages"))
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  /**
   * Envia uma mensagem para o agente
   */
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true)
        setError(null)

        // Adicionar mensagem do usuário imediatamente para feedback visual
        const userMessage: Message = {
          id: `temp-${Date.now()}`,
          conversationId: conversationId || "",
          role: "user",
          content,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])

        // Enviar mensagem para o agente
        const response = await agentService.queryAgent({
          agentId,
          message: content,
          conversationId,
        })

        // Atualizar conversationId se for uma nova conversa
        if (!conversationId) {
          setConversationId(response.conversationId)
        }

        // Buscar mensagens atualizadas
        const updatedMessages = await conversationService.getMessages(response.conversationId)
        setMessages(updatedMessages)

        return response
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to send message"))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [agentId, conversationId],
  )

  /**
   * Reinicia a conversa
   */
  const resetConversation = useCallback(() => {
    setConversationId(undefined)
    setMessages([])
    setError(null)
  }, [])

  return {
    conversationId,
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  }
}
