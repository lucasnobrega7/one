import { authenticatedRequest } from "@/utils/api"
import type { Datastore, DatastoreCreate, DatastoreQuery } from "../types"

/**
 * Serviço para interação com a API externa de datastores
 */
export const datastoreApiService = {
  /**
   * Cria um novo datastore via API
   */
  async createDatastore(data: DatastoreCreate): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "POST",
      path: "/datastores",
      body: data,
    })
  },

  /**
   * Obtém um datastore pelo ID via API
   */
  async getDatastore(datastoreId: string): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "GET",
      path: `/datastores/${datastoreId}`,
    })
  },

  /**
   * Atualiza um datastore existente via API
   */
  async updateDatastore(datastoreId: string, data: DatastoreCreate): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "PATCH",
      path: `/datastores/${datastoreId}`,
      body: data,
    })
  },

  /**
   * Remove um datastore via API
   */
  async deleteDatastore(datastoreId: string): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "DELETE",
      path: `/datastores/${datastoreId}`,
    })
  },

  /**
   * Consulta um datastore para encontrar documentos similares via API
   */
  async queryDatastore(datastoreId: string, query: DatastoreQuery): Promise<Record<string, any>[]> {
    return authenticatedRequest<Record<string, any>[]>({
      method: "POST",
      path: `/datastores/${datastoreId}/query`,
      body: query,
    })
  },

  /**
   * Lista todos os datastores via API
   */
  async listDatastores(): Promise<Datastore[]> {
    return authenticatedRequest<Datastore[]>({
      method: "GET",
      path: "/datastores",
    })
  },
}
