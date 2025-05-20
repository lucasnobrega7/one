"use client"

import { useState, useEffect } from "react"
import { messageService } from "../services/messageService"
import type { Message } from "../types"
import { useToast } from "@/components/ui/use-toast"

/**
 * Hook para gerenciar mensagens de uma conversa
 */
export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  // Carregar mensagens
  useEffect(() => {
    if (!conversationId) return

    const loadMessages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await messageService.getMessages(conversationId)
        setMessages(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar mensagens"
        setError(new Error(errorMessage))
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  // Adicionar uma mensagem
  const addMessage = async (message: Omit<Message, "id" | "createdAt">) => {
    if (!conversationId) {
      toast({
        title: "Erro",
        description: "ID da conversa não fornecido",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      const newMessage = await messageService.addMessage(conversationId, message)
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar mensagem"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Excluir uma mensagem
  const deleteMessage = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId)
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir mensagem"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  return {
    messages,
    isLoading,
    error,
    addMessage,
    deleteMessage,
  }
}
