// Interface unificada para agentes
export interface UnifiedAgent {
  id: string           // UUID padrão para todos os sistemas
  name: string
  description?: string
  instructions?: string // Padronizar nome do campo
  systemPrompt?: string // Alias para instructions
  modelId?: string      // Unified field name
  temperature?: number
  isPublic: boolean    // Padronizar naming convention
  userId: string
  createdAt: Date
  updatedAt: Date
  tools?: string[]     // Tools/functions available
  
  // Campos adicionais para sincronização
  externalId?: string  // ID na API externa
  syncStatus?: 'synced' | 'pending' | 'error'
  lastSyncAt?: Date
}

// Interface para mensagens
export interface UnifiedMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  metadata?: Record<string, any>
}

// Interface para conversas
export interface UnifiedConversation {
  id: string
  agentId: string
  userId: string
  title?: string
  messages: UnifiedMessage[]
  createdAt: Date
  updatedAt: Date
  
  // Campos de sincronização
  externalId?: string
  syncStatus?: 'synced' | 'pending' | 'error'
}

// Adaptador para diferentes formatos
export class AgentDataAdapter {
  // Converter do formato Supabase para formato unificado
  static fromSupabase(data: any): UnifiedAgent {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      instructions: data.system_prompt || data.instructions,
      modelId: data.model_id || data.model,
      temperature: data.temperature || 0.7,
      isPublic: data.is_public || false,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      externalId: data.external_id,
      syncStatus: data.sync_status,
      lastSyncAt: data.last_sync_at ? new Date(data.last_sync_at) : undefined
    }
  }
  
  // Converter para formato da API externa
  static toApiRequest(agent: UnifiedAgent): any {
    return {
      uuid: agent.externalId || agent.id,
      name: agent.name,
      description: agent.description,
      system_prompt: agent.instructions,
      model: agent.modelId,
      temperature: agent.temperature,
      is_public: agent.isPublic,
      metadata: {
        local_id: agent.id,
        user_id: agent.userId
      }
    }
  }
  
  // Converter resposta da API externa para formato unificado
  static fromApiResponse(data: any): UnifiedAgent {
    return {
      id: data.metadata?.local_id || data.uuid,
      name: data.name,
      description: data.description,
      instructions: data.system_prompt,
      modelId: data.model,
      temperature: data.temperature || 0.7,
      isPublic: data.is_public || false,
      userId: data.metadata?.user_id || data.user_uuid,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      externalId: data.uuid,
      syncStatus: 'synced',
      lastSyncAt: new Date()
    }
  }
  
  // Converter para formato de armazenamento local (Supabase)
  static toSupabase(agent: UnifiedAgent): any {
    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      system_prompt: agent.instructions,
      model_id: agent.modelId,
      temperature: agent.temperature,
      is_public: agent.isPublic,
      user_id: agent.userId,
      external_id: agent.externalId,
      sync_status: agent.syncStatus,
      last_sync_at: agent.lastSyncAt?.toISOString()
    }
  }
}

// Adaptador para conversas
export class ConversationDataAdapter {
  static fromSupabase(data: any): UnifiedConversation {
    return {
      id: data.id,
      agentId: data.agent_id,
      userId: data.user_id,
      title: data.title,
      messages: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      externalId: data.external_id,
      syncStatus: data.sync_status
    }
  }
  
  static toApiRequest(conversation: UnifiedConversation): any {
    return {
      uuid: conversation.externalId || conversation.id,
      agent_uuid: conversation.agentId,
      user_uuid: conversation.userId,
      title: conversation.title,
      metadata: {
        local_id: conversation.id
      }
    }
  }
  
  static fromApiResponse(data: any): UnifiedConversation {
    return {
      id: data.metadata?.local_id || data.uuid,
      agentId: data.agent_uuid,
      userId: data.user_uuid,
      title: data.title,
      messages: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      externalId: data.uuid,
      syncStatus: 'synced'
    }
  }
}

// Adaptador para mensagens
export class MessageDataAdapter {
  static fromSupabase(data: any): UnifiedMessage {
    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role,
      content: data.content,
      createdAt: new Date(data.created_at),
      metadata: data.metadata
    }
  }
  
  static toApiRequest(message: UnifiedMessage): any {
    return {
      conversation_uuid: message.conversationId,
      role: message.role,
      content: message.content,
      metadata: {
        ...message.metadata,
        local_id: message.id
      }
    }
  }
  
  static fromApiResponse(data: any): UnifiedMessage {
    return {
      id: data.metadata?.local_id || data.uuid,
      conversationId: data.conversation_uuid,
      role: data.role,
      content: data.content,
      createdAt: new Date(data.created_at),
      metadata: data.metadata
    }
  }
}