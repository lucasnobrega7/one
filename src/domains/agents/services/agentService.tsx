import { supabaseClient } from "@/lib/supabase"
import type {
  Agent,
  CreateAgentParams,
  UpdateAgentParams,
  AgentQueryParams,
  AgentQueryResponse,
} from "../types/agent.types"

/**
 * Serviço responsável por gerenciar operações relacionadas a agentes
 */
export const agentService = {
  /**
   * Obtém todos os agentes de uma organização
   */
  async getAgents(organizationId: string): Promise<Agent[]> {
    const { data, error } = await supabaseClient
      .from("agents")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch agents: ${error.message}`)
    }

    return data.map(transformAgentFromDB)
  },

  /**
   * Obtém um agente pelo ID
   */
  async getAgentById(id: string): Promise<Agent | null> {
    const { data, error } = await supabaseClient.from("agents").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch agent: ${error.message}`)
    }

    return transformAgentFromDB(data)
  },

  /**
   * Cria um novo agente
   */
  async createAgent(organizationId: string, params: CreateAgentParams): Promise<Agent> {
    const { data, error } = await supabaseClient
      .from("agents")
      .insert([
        {
          organization_id: organizationId,
          name: params.name,
          description: params.description,
          instructions: params.instructions,
          model_name: params.modelName,
          temperature: params.temperature,
          visibility: params.visibility,
          icon_url: params.iconUrl,
          handle: params.handle,
          include_sources: params.includeSources,
          interface_config: params.interfaceConfig,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create agent: ${error.message}`)
    }

    return transformAgentFromDB(data)
  },

  /**
   * Atualiza um agente existente
   */
  async updateAgent(params: UpdateAgentParams): Promise<Agent> {
    const updateData: Record<string, any> = {}

    if (params.name) updateData.name = params.name
    if (params.description) updateData.description = params.description
    if (params.instructions) updateData.instructions = params.instructions
    if (params.modelName) updateData.model_name = params.modelName
    if (params.temperature !== undefined) updateData.temperature = params.temperature
    if (params.visibility) updateData.visibility = params.visibility
    if (params.iconUrl !== undefined) updateData.icon_url = params.iconUrl
    if (params.handle !== undefined) updateData.handle = params.handle
    if (params.includeSources !== undefined) updateData.include_sources = params.includeSources
    if (params.interfaceConfig) updateData.interface_config = params.interfaceConfig

    const { data, error } = await supabaseClient.from("agents").update(updateData).eq("id", params.id).select().single()

    if (error) {
      throw new Error(`Failed to update agent: ${error.message}`)
    }

    return transformAgentFromDB(data)
  },

  /**
   * Remove um agente
   */
  async deleteAgent(id: string): Promise<void> {
    const { error } = await supabaseClient.from("agents").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete agent: ${error.message}`)
    }
  },

  /**
   * Consulta um agente com uma mensagem
   */
  async queryAgent(params: AgentQueryParams): Promise<AgentQueryResponse> {
    // Implementação da consulta ao agente via API
    const response = await fetch("/api/agents/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to query agent: ${error.message}`)
    }

    return response.json()
  },
}

// Helper function to transform database record to Agent type
function transformAgentFromDB(record: any): Agent {
  return {
    id: record.id,
    organizationId: record.organization_id,
    name: record.name,
    description: record.description,
    instructions: record.instructions,
    modelName: record.model_name,
    temperature: record.temperature,
    iconUrl: record.icon_url,
    handle: record.handle,
    visibility: record.visibility,
    interfaceConfig: record.interface_config,
    includeSources: record.include_sources,
    tools: record.tools || [],
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  }
}

// Re-export from agentService.ts from "./agentService"
