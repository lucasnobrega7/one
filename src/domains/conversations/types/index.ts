// Tipos relacionados ao domínio de conversas

export interface MessageSource {
  title?: string
  url?: string
  content?: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
  sources?: MessageSource[]
}

export interface Conversation {
  id: string
  agentId: string
  userId: string
  title?: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface QueryAgentParams {
  agentId: string
  query: string
  userId: string
  conversationId?: string
}

export interface QueryResponse {
  answer: string
  conversationId: string
  messageId: string
  sources?: MessageSource[]
}
