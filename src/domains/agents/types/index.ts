// Tipos relacionados ao domínio de agentes

export type AgentModelName =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4o"
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"

export type AgentVisibility = "public" | "private" | "organization"

export interface AgentInterfaceConfig {
  primaryColor?: string
  textColor?: string
  fontSize?: string
  fontFamily?: string
  chatBubbleStyle?: string
  showBranding?: boolean
  customCss?: string
  instagramURL?: string
  twitterURL?: string
  githubURL?: string
  websiteURL?: string
  youtubeURL?: string
  tiktokURL?: string
}

export interface Agent {
  id: string
  organizationId: string
  name: string
  description: string
  instructions: string
  modelName: AgentModelName
  temperature: number
  iconUrl?: string
  handle?: string
  visibility: AgentVisibility
  interfaceConfig?: AgentInterfaceConfig
  includeSources?: boolean
  tools?: any[] // Referência ao tipo Tool do domínio de integrações
  createdAt: Date
  updatedAt: Date
}

export interface AgentWithDatastores extends Agent {
  datastores?: {
    id: string
    name: string
    type: string // Referência ao tipo DatastoreType do domínio de datastores
  }[]
}

export interface CreateAgentParams {
  name: string
  description: string
  instructions: string
  modelName: AgentModelName
  temperature: number
  visibility: AgentVisibility
  iconUrl?: string
  handle?: string
  includeSources?: boolean
  interfaceConfig?: Record<string, any>
}

export interface UpdateAgentParams extends Partial<CreateAgentParams> {
  id: string
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
