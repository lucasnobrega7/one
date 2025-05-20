import { supabaseClient } from "@/utils/supabase"
import type { QueryAgentParams, QueryResponse } from "../types"

/**
 * Serviço para gerenciar consultas a agentes
 */
export const queryService = {
  /**
   * Consulta um agente com uma pergunta
   */
  async queryAgent({ agentId, query, userId, conversationId }: QueryAgentParams): Promise<QueryResponse> {
    // Chamar o endpoint da API
    const response = await fetch(`/api/agents/${agentId}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        conversationId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to query agent")
    }

    return await response.json()
  },

  /**
   * Obtém todas as conversas de um usuário
   */
  async getConversations(userId: string, agentId?: string): Promise<any[]> {
    let query = supabaseClient
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (agentId) {
      query = query.eq("agent_id", agentId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`)
    }

    return data
  },

  /**
   * Obtém uma conversa específica pelo ID
   */
  async getConversationById(conversationId: string): Promise<any> {
    const { data, error } = await supabaseClient
      .from("conversations")
      .select("*, messages(*)")
      .eq("id", conversationId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`)
    }

    return data
  },

  /**
   * Cria uma nova conversa
   */
  async createConversation(agentId: string, userId: string, title?: string): Promise<string> {
    const { data, error } = await supabaseClient
      .from("conversations")
      .insert([
        {
          agent_id: agentId,
          user_id: userId,
          title: title || "Nova Conversa",
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`)
    }

    return data.id
  },

  /**
   * Atualiza o título de uma conversa
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const { error } = await supabaseClient.from("conversations").update({ title }).eq("id", conversationId)

    if (error) {
      throw new Error(`Failed to update conversation title: ${error.message}`)
    }
  },

  /**
   * Exclui uma conversa
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabaseClient.from("conversations").delete().eq("id", conversationId)

    if (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`)
    }
  },
}
