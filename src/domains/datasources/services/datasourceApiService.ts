import { authenticatedRequest } from "@/utils/api"
import type { Datasource, DatasourceCreate } from "../types"

/**
 * Serviço para interação com a API externa de datasources
 */
export const datasourceApiService = {
  /**
   * Cria uma nova fonte de dados via API
   */
  async createDatasource(data: DatasourceCreate): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "POST",
      path: "/datasources",
      body: data,
    })
  },

  /**
   * Obtém uma fonte de dados pelo ID via API
   */
  async getDatasource(datasourceId: string): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "GET",
      path: `/datasources/${datasourceId}`,
    })
  },

  /**
   * Remove uma fonte de dados via API
   */
  async deleteDatasource(datasourceId: string): Promise<Datasource> {
    return authenticatedRequest<Datasource>({
      method: "DELETE",
      path: `/datasources/${datasourceId}`,
    })
  },

  /**
   * Lista todas as fontes de dados via API
   */
  async listDatasources(): Promise<Datasource[]> {
    return authenticatedRequest<Datasource[]>({
      method: "GET",
      path: "/datasources",
    })
  },
}
