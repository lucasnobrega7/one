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
