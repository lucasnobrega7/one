import { z } from 'zod'

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  image: z.string().url().optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
})

export const UserUpdateSchema = UserSchema.partial().omit({ id: true })

// Agent schemas
export const AgentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  system_prompt: z.string().max(2000, "Prompt muito longo").optional(),
  model_id: z.string().default('gpt-3.5-turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(1).max(4000).default(1000),
  user_id: z.string().uuid(),
  knowledge_base_id: z.string().uuid().optional(),
  is_active: z.boolean().default(true),
  whatsapp_connected: z.boolean().default(false),
  whatsapp_number: z.string().optional(),
})

export const AgentCreateSchema = AgentSchema.omit({ id: true })
export const AgentUpdateSchema = AgentSchema.partial().omit({ id: true, user_id: true })

// Conversation schemas
export const ConversationSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  agent_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  whatsapp_chat_id: z.string().optional(),
  platform: z.enum(['web', 'whatsapp', 'telegram']).default('web'),
  is_active: z.boolean().default(true),
})

export const ConversationCreateSchema = ConversationSchema.omit({ id: true })
export const ConversationUpdateSchema = ConversationSchema.partial().omit({ id: true, user_id: true })

// Message schemas
export const MessageSchema = z.object({
  id: z.string().uuid().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório").max(10000, "Mensagem muito longa"),
  role: z.enum(['user', 'assistant', 'system']),
  conversation_id: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
})

export const MessageCreateSchema = MessageSchema.omit({ id: true })

// Knowledge base schemas
export const KnowledgeBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  index_name: z.string().min(1, "Nome do índice é obrigatório"),
  user_id: z.string().uuid(),
})

export const KnowledgeBaseCreateSchema = KnowledgeBaseSchema.omit({ id: true })
export const KnowledgeBaseUpdateSchema = KnowledgeBaseSchema.partial().omit({ id: true, user_id: true })

// Document schemas
export const DocumentSchema = z.object({
  id: z.string().uuid().optional(),
  knowledge_base_id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  metadata: z.record(z.any()).optional(),
  vectorized: z.boolean().default(false),
})

export const DocumentCreateSchema = DocumentSchema.omit({ id: true, vectorized: true })
export const DocumentUpdateSchema = DocumentSchema.partial().omit({ id: true, knowledge_base_id: true })

// WhatsApp integration schemas
export const WhatsAppIntegrationSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  phone_number: z.string().min(10, "Número de telefone inválido"),
  provider: z.enum(['zapi', 'evolution', 'official']),
  api_url: z.string().url().optional(),
  api_key: z.string().optional(),
  instance_id: z.string().optional(),
  is_connected: z.boolean().default(false),
})

export const WhatsAppIntegrationCreateSchema = WhatsAppIntegrationSchema.omit({ 
  id: true, 
  is_connected: true 
})

export const WhatsAppIntegrationUpdateSchema = WhatsAppIntegrationSchema.partial().omit({ 
  id: true, 
  user_id: true 
})

// User settings schemas
export const UserSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  theme: z.enum(['light', 'dark']).default('dark'),
  language: z.enum(['pt-BR', 'en-US']).default('pt-BR'),
  notifications_enabled: z.boolean().default(true),
  onboarding_completed: z.boolean().default(false),
  openai_api_key: z.string().optional(),
  anthropic_api_key: z.string().optional(),
  cohere_api_key: z.string().optional(),
  zapi_token: z.string().optional(),
  zapi_instance_id: z.string().optional(),
  evolution_api_url: z.string().url().optional(),
  evolution_api_key: z.string().optional(),
})

export const UserSettingsUpdateSchema = UserSettingsSchema.partial().omit({ 
  id: true, 
  user_id: true 
})

// API Key schemas
export const APIKeySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  key: z.string().min(10, "Chave muito curta"),
  expires_at: z.string().datetime().optional(),
})

export const APIKeyCreateSchema = APIKeySchema.omit({ id: true, key: true })

// Common validation schemas
export const UUIDSchema = z.string().uuid("ID inválido")
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const SearchSchema = z.object({
  query: z.string().min(1, "Query é obrigatória"),
  ...PaginationSchema.shape,
})

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  code: z.string().optional(),
})

// Success response schema
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
})

// Export types
export type User = z.infer<typeof UserSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>

export type Agent = z.infer<typeof AgentSchema>
export type AgentCreate = z.infer<typeof AgentCreateSchema>
export type AgentUpdate = z.infer<typeof AgentUpdateSchema>

export type Conversation = z.infer<typeof ConversationSchema>
export type ConversationCreate = z.infer<typeof ConversationCreateSchema>
export type ConversationUpdate = z.infer<typeof ConversationUpdateSchema>

export type Message = z.infer<typeof MessageSchema>
export type MessageCreate = z.infer<typeof MessageCreateSchema>

export type KnowledgeBase = z.infer<typeof KnowledgeBaseSchema>
export type KnowledgeBaseCreate = z.infer<typeof KnowledgeBaseCreateSchema>
export type KnowledgeBaseUpdate = z.infer<typeof KnowledgeBaseUpdateSchema>

export type Document = z.infer<typeof DocumentSchema>
export type DocumentCreate = z.infer<typeof DocumentCreateSchema>
export type DocumentUpdate = z.infer<typeof DocumentUpdateSchema>

export type WhatsAppIntegration = z.infer<typeof WhatsAppIntegrationSchema>
export type WhatsAppIntegrationCreate = z.infer<typeof WhatsAppIntegrationCreateSchema>
export type WhatsAppIntegrationUpdate = z.infer<typeof WhatsAppIntegrationUpdateSchema>

export type UserSettings = z.infer<typeof UserSettingsSchema>
export type UserSettingsUpdate = z.infer<typeof UserSettingsUpdateSchema>

export type APIKey = z.infer<typeof APIKeySchema>
export type APIKeyCreate = z.infer<typeof APIKeyCreateSchema>

export type Pagination = z.infer<typeof PaginationSchema>
export type Search = z.infer<typeof SearchSchema>

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>