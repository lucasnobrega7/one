export interface UnifiedAgent {
  id: string
  name: string
  description?: string
  systemPrompt?: string
  isPublic: boolean
  tools?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateAgentRequest {
  name: string
  description?: string
  systemPrompt?: string
  isPublic?: boolean
  tools?: string[]
}

export interface UpdateAgentRequest {
  name?: string
  description?: string
  systemPrompt?: string
  isPublic?: boolean
  tools?: string[]
}
