import { supabaseClient } from "@/utils/supabase"
import type { Message } from "../types"

/**
 * Serviço para gerenciar mensagens de conversas
 */
export const messageService = {
  /**
   * Adiciona uma mensagem a uma conversa
   */
  async addMessage(conversationId: string, message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const { data, error } = await supabaseClient
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          sources: message.sources,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`)
    }

    return {
      id: data.id,
      role: data.role,
      content: data.content,
      sources: data.sources,
      createdAt: new Date(data.created_at),
    }
  },

  /**
   * Obtém todas as mensagens de uma conversa
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`)
    }

    return data.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      sources: message.sources,
      createdAt: new Date(message.created_at),
    }))
  },

  /**
   * Exclui uma mensagem
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabaseClient.from("messages").delete().eq("id", messageId)

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`)
    }
  },
}
