import { supabaseClient } from "@/lib/supabase/client"
import type { MessageSource } from "../types/message"

interface QueryAgentParams {
  agentId: string
  query: string
  userId: string
  conversationId?: string
}

interface QueryResponse {
  answer: string
  conversationId: string
  messageId: string
  sources?: MessageSource[]
}

export const queryService = {
  async queryAgent({ agentId, query, userId, conversationId }: QueryAgentParams): Promise<QueryResponse> {
    // Call the API endpoint
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

  async createConversation(agentId: string, userId: string, title?: string): Promise<string> {
    const { data, error } = await supabaseClient
      .from("conversations")
      .insert([
        {
          agent_id: agentId,
          user_id: userId,
          title: title || "New Conversation",
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`)
    }

    return data.id
  },

  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const { error } = await supabaseClient.from("conversations").update({ title }).eq("id", conversationId)

    if (error) {
      throw new Error(`Failed to update conversation title: ${error.message}`)
    }
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabaseClient.from("conversations").delete().eq("id", conversationId)

    if (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`)
    }
  },
}
