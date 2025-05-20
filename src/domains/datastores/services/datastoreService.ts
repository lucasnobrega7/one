import { supabaseClient } from "@/utils/supabase"
import type { Datastore, DatastoreCreate } from "../types"

/**
 * Serviço para gerenciar datastores
 */
export const datastoreService = {
  /**
   * Obtém todos os datastores de uma organização
   */
  async getDatastores(organizationId: string): Promise<Datastore[]> {
    const { data, error } = await supabaseClient
      .from("datastores")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch datastores: ${error.message}`)
    }

    return data.map(transformDatastoreFromDB)
  },

  /**
   * Obtém um datastore pelo ID
   */
  async getDatastoreById(id: string): Promise<Datastore | null> {
    const { data, error } = await supabaseClient.from("datastores").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch datastore: ${error.message}`)
    }

    return transformDatastoreFromDB(data)
  },

  /**
   * Cria um novo datastore
   */
  async createDatastore(organizationId: string, params: DatastoreCreate): Promise<Datastore> {
    const { data, error } = await supabaseClient
      .from("datastores")
      .insert([
        {
          organization_id: organizationId,
          name: params.name,
          description: params.description,
          type: params.type || "vector",
          visibility: params.visibility || "private",
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create datastore: ${error.message}`)
    }

    return transformDatastoreFromDB(data)
  },

  /**
   * Atualiza um datastore existente
   */
  async updateDatastore(id: string, params: Partial<DatastoreCreate>): Promise<Datastore> {
    const updateData: Record<string, any> = {}

    if (params.name) updateData.name = params.name
    if (params.description) updateData.description = params.description
    if (params.type) updateData.type = params.type
    if (params.visibility) updateData.visibility = params.visibility

    const { data, error } = await supabaseClient.from("datastores").update(updateData).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update datastore: ${error.message}`)
    }

    return transformDatastoreFromDB(data)
  },

  /**
   * Remove um datastore
   */
  async deleteDatastore(id: string): Promise<void> {
    const { error } = await supabaseClient.from("datastores").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete datastore: ${error.message}`)
    }
  },
}

// Helper function to transform database record to Datastore type
function transformDatastoreFromDB(record: any): Datastore {
  return {
    id: record.id,
    organizationId: record.organization_id,
    name: record.name,
    description: record.description,
    type: record.type,
    visibility: record.visibility,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}
