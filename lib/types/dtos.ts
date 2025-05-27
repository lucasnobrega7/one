import { z } from 'zod'

export const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  topK: z.number().min(1).max(100).default(5),
  filters: z.record(z.any()).optional(),
  threshold: z.number().min(0).max(1).default(0.7),
  include_metadata: z.boolean().default(true),
})

export type SearchRequest = z.infer<typeof SearchRequestSchema>

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversation_id: z.string().optional(),
  agent_id: z.string(),
  include_sources: z.boolean().default(true),
  stream: z.boolean().default(false),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>

export const AgentCreateSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().min(1, 'Agent description is required'),
  system_prompt: z.string().optional(),
  user_prompt: z.string().optional(),
  model_name: z.enum([
    'gpt_3_5_turbo',
    'gpt_4',
    'gpt_4_turbo',
    'gpt_4o',
    'claude_3_haiku',
    'claude_3_sonnet',
    'claude_3_opus',
    'claude_3_5_sonnet',
    'mixtral_8x7b',
    'mixtral_8x22b',
    'gemini_pro',
    'gemini_flash_1_5',
    'llama_3_8b_instruct',
    'llama_3_70b_instruct',
  ]).default('gpt_3_5_turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(1).max(4000).default(1000),
  include_sources: z.boolean().default(true),
  restrict_knowledge: z.boolean().default(true),
  datastore_id: z.string().optional(),
})

export type AgentCreate = z.infer<typeof AgentCreateSchema>

export const DatastoreCreateSchema = z.object({
  name: z.string().min(1, 'Datastore name is required'),
  description: z.string().optional(),
  type: z.enum(['qdrant', 'pinecone', 'supabase_vector']).default('supabase_vector'),
  config: z.record(z.any()).optional(),
})

export type DatastoreCreate = z.infer<typeof DatastoreCreateSchema>