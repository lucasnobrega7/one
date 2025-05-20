export type AgentVisibility = "public" | "private" | "organization"

export interface AgentModel {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPer1kTokens: number
}

export interface AgentInterfaceConfig {
  primaryColor?: string
  showSources?: boolean
  avatarUrl?: string
  customCss?: string
}

export interface Agent {
  id: string
  organizationId: string
  name: string
  description: string
  instructions: string
  modelName: string
  temperature: number
  iconUrl?: string
  handle?: string
  visibility: AgentVisibility
  interfaceConfig?: AgentInterfaceConfig
  includeSources: boolean
  tools: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateAgentParams {
  name: string
  description: string
  instructions: string
  modelName: string
  temperature: number
  visibility: AgentVisibility
  iconUrl?: string
  handle?: string
  includeSources: boolean
  interfaceConfig?: AgentInterfaceConfig
}

export interface UpdateAgentParams {
  id: string
  name?: string
  description?: string
  instructions?: string
  modelName?: string
  temperature?: number
  visibility?: AgentVisibility
  iconUrl?: string
  handle?: string
  includeSources?: boolean
  interfaceConfig?: AgentInterfaceConfig
}

export interface AgentQueryParams {
  agentId: string
  message: string
  conversationId?: string
  includeHistory?: boolean
}

export interface AgentQueryResponse {
  answer: string
  conversationId: string
  messageId: string
  sources?: {
    id: string
    text: string
    metadata: Record<string, any>
  }[]
}
