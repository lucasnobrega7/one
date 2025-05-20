import { authenticatedRequest } from "@/lib/api/api-client"
import type { Datastore, DatastoreCreate, DatastoreQuery } from "@/types/api"

export const datastoresApiService = {
  /**
   * Cria um novo datastore
   */
  async createDatastore(data: DatastoreCreate): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "POST",
      path: "/datastores",
      body: data,
    })
  },

  /**
   * Obtém um datastore pelo ID
   */
  async getDatastore(datastoreId: string): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "GET",
      path: `/datastores/${datastoreId}`,
    })
  },

  /**
   * Atualiza um datastore existente
   */
  async updateDatastore(datastoreId: string, data: DatastoreCreate): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "PATCH",
      path: `/datastores/${datastoreId}`,
      body: data,
    })
  },

  /**
   * Remove um datastore
   */
  async deleteDatastore(datastoreId: string): Promise<Datastore> {
    return authenticatedRequest<Datastore>({
      method: "DELETE",
      path: `/datastores/${datastoreId}`,
    })
  },

  /**
   * Consulta um datastore para encontrar documentos similares
   */
  async queryDatastore(datastoreId: string, query: DatastoreQuery): Promise<Record<string, any>[]> {
    return authenticatedRequest<Record<string, any>[]>({
      method: "POST",
      path: `/datastores/${datastoreId}/query`,
      body: query,
    })
  },

  /**
   * Lista todos os datastores
   * Nota: Este endpoint não está na especificação OpenAPI, mas é comum ter um endpoint de listagem
   */
  async listDatastores(): Promise<Datastore[]> {
    return authenticatedRequest<Datastore[]>({
      method: "GET",
      path: "/datastores",
    })
  },
}
