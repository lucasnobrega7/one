import { authenticatedRequest } from "@/src/lib/api/api-client"
import type { Datasource, DatasourceCreate } from "@/src/types/api"

export const datasourcesApiService = {
  /**
   * Cria uma nova fonte de dados
   */
  async createDatasource(data: DatasourceCreate): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "POST",
      path: "/datasources",
      body: data,
    })
  },

  /**
   * Obtém uma fonte de dados pelo ID
   */
  async getDatasource(datasourceId: string): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "GET",
      path: `/datasources/${datasourceId}`,
    })
  },

  /**
   * Remove uma fonte de dados
   */
  async deleteDatasource(datasourceId: string): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "DELETE",
      path: `/datasources/${datasourceId}`,
    })
  },

  /**
   * Lista todas as fontes de dados
   * Nota: Este endpoint não está na especificação OpenAPI, mas é comum ter um endpoint de listagem
   */
  async listDatasources(): Promise<Datasource[]> {
    return authenticatedRequest<Datasource[]>({
      method: "GET",
      path: "/datasources",
    })
  },
}
