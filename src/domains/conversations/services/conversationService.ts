import { supabaseClient } from "@/lib/supabase"
import type {
  Conversation,
  Message,
  CreateConversationParams,
  SendMessageParams,
  ConversationWithMessages,
} from "../types/conversation.types"

/**
 * Serviço para gerenciar conversas e mensagens
 */
export const conversationService = {
  /**
   * Obtém todas as conversas de um usuário
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabaseClient
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`)
    }

    return data.map(transformConversationFromDB)
  },

  /**
   * Obtém uma conversa pelo ID
   */
  async getConversationById(id: string): Promise<ConversationWithMessages | null> {
    // Obter a conversa
    const { data: conversation, error: conversationError } = await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single()

    if (conversationError) {
      if (conversationError.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch conversation: ${conversationError.message}`)
    }

    // Obter as mensagens da conversa
    const { data: messages, error: messagesError } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      throw new Error(`Failed to fetch messages: ${messagesError.message}`)
    }

    return {
      ...transformConversationFromDB(conversation),
      messages: messages.map(transformMessageFromDB),
    }
  },

  /**
   * Cria uma nova conversa
   */
  async createConversation(params: CreateConversationParams): Promise<Conversation> {
    const { data, error } = await supabaseClient
      .from("conversations")
      .insert([
        {
          user_id: params.userId,
          agent_id: params.agentId,
          title: params.title || "Nova conversa",
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`)
    }

    return transformConversationFromDB(data)
  },

  /**
   * Envia uma mensagem em uma conversa
   */
  async sendMessage(params: SendMessageParams): Promise<Message> {
    // Inserir a mensagem
    const { data: message, error: messageError } = await supabaseClient
      .from("messages")
      .insert([
        {
          conversation_id: params.conversationId,
          role: params.role,
          content: params.content,
          attachments: params.attachments,
        },
      ])
      .select()
      .single()

    if (messageError) {
      throw new Error(`Failed to send message: ${messageError.message}`)
    }

    // Atualizar a data de atualização da conversa
    const { error: updateError } = await supabaseClient
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", params.conversationId)

    if (updateError) {
      console.error("Failed to update conversation timestamp:", updateError)
    }

    return transformMessageFromDB(message)
  },

  /**
   * Atualiza o título de uma conversa
   */
  async updateConversationTitle(id: string, title: string): Promise<void> {
    const { error } = await supabaseClient.from("conversations").update({ title }).eq("id", id)

    if (error) {
      throw new Error(`Failed to update conversation title: ${error.message}`)
    }
  },

  /**
   * Remove uma conversa
   */
  async deleteConversation(id: string): Promise<void> {
    // Primeiro, remover todas as mensagens da conversa
    const { error: messagesError } = await supabaseClient.from("messages").delete().eq("conversation_id", id)

    if (messagesError) {
      throw new Error(`Failed to delete conversation messages: ${messagesError.message}`)
    }

    // Em seguida, remover a conversa
    const { error: conversationError } = await supabaseClient.from("conversations").delete().eq("id", id)

    if (conversationError) {
      throw new Error(`Failed to delete conversation: ${conversationError.message}`)
    }
  },
}

// Helper function to transform database record to Conversation type
function transformConversationFromDB(record: any): Conversation {
  return {
    id: record.id,
    userId: record.user_id,
    agentId: record.agent_id,
    title: record.title,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}

// Helper function to transform database record to Message type
function transformMessageFromDB(record: any): Message {
  return {
    id: record.id,
    conversationId: record.conversation_id,
    role: record.role,
    content: record.content,
    attachments: record.attachments || [],
    createdAt: new Date(record.created_at),
  }
}
