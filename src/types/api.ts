// Tipos compartilhados para a API

// Tipos de Agente
export interface Agent {
  id: string
  name: string
  description: string
  modelName: string
  temperature: number
  systemPrompt?: string
  userPrompt?: string
  visibility: string
}

export interface AgentCreate {
  name: string
  description: string
  modelName?: string
  temperature?: number
  systemPrompt?: string
  userPrompt?: string
  visibility?: string
}

export interface AgentQuery {
  query: string
  conversationId?: string
  visitorId?: string
  temperature?: number
  streaming?: boolean
  modelName?: string
  maxTokens?: number
  presencePenalty?: number
  frequencyPenalty?: number
  topP?: number
  filters?: Record<string, any>
  systemPrompt?: string
  userPrompt?: string
}

export interface AgentResponse {
  answer: string
  conversationId: string
  visitorId: string
  sources: Record<string, any>[]
}

// Tipos de Datastore
export interface Datastore {
  id: string
  name: string
  description: string
  type: string
  visibility: string
}

export interface DatastoreCreate {
  name: string
  description: string
  type?: string
  visibility?: string
}

export interface DatastoreQuery {
  query: string
  topK?: number
  filters?: Record<string, any>
}

// Tipos de Datasource
export interface Datasource {
  id: string
  type: string
  name?: string
  status: string
  config?: Record<string, any>
}

export interface DatasourceCreate {
  type: string
  datastoreId: string
  custom_id?: string
  config?: Record<string, any>
}

// Tipos de erro
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}
