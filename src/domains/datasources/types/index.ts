// Tipos relacionados ao domínio de datasources

export type DatasourceType = "file" | "web" | "text" | "api"
export type DatasourceStatus = "pending" | "processing" | "completed" | "failed"

export interface Datasource {
  id: string
  datastoreId: string
  type: DatasourceType
  name?: string
  status: DatasourceStatus
  config?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface DatasourceCreate {
  type: DatasourceType
  datastoreId: string
  customId?: string
  config?: Record<string, any>
}
