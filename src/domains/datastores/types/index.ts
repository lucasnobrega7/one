// Tipos relacionados ao domínio de datastores

export type DatastoreType = "vector" | "hybrid" | "graph"

export interface Datastore {
  id: string
  organizationId: string
  name: string
  description: string
  type: DatastoreType
  visibility: "public" | "private" | "organization"
  createdAt: Date
  updatedAt: Date
}

export interface DatastoreCreate {
  name: string
  description: string
  type?: DatastoreType
  visibility?: "public" | "private" | "organization"
}

export interface DatastoreQuery {
  query: string
  topK?: number
  filters?: Record<string, any>
}
