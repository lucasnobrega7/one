import { supabase } from "@/lib/supabase"
import type { IFlow } from "@/lib/interfaces/flow"

export const chatflowsService = {
  async getChatflows() {
    const { data, error } = await supabase.from("chatflows").select("*").order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching chatflows:", error)
      throw error
    }

    return { data }
  },

  async getSpecificChatflow(id: string) {
    const { data, error } = await supabase.from("chatflows").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching chatflow with id ${id}:`, error)
      throw error
    }

    return { data }
  },

  async createChatflow(flow: Partial<IFlow>) {
    const { data, error } = await supabase.from("chatflows").insert([flow]).select()

    if (error) {
      console.error("Error creating chatflow:", error)
      throw error
    }

    return { data: data[0] }
  },

  async updateChatflow(id: string, flow: Partial<IFlow>) {
    const { data, error } = await supabase
      .from("chatflows")
      .update({ ...flow, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`Error updating chatflow with id ${id}:`, error)
      throw error
    }

    return { data: data[0] }
  },

  async deleteChatflow(id: string) {
    const { error } = await supabase.from("chatflows").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting chatflow with id ${id}:`, error)
      throw error
    }

    return { success: true }
  },
}
