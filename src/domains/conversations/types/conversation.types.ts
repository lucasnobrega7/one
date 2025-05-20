export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  agentId: string
  userId: string
  title?: string
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
  messageCount: number
}

export interface CreateMessageParams {
  conversationId: string
  content: string
  role: MessageRole
  metadata?: Record<string, any>
}

export interface CreateConversationParams {
  agentId: string
  title?: string
  initialMessage?: string
}
