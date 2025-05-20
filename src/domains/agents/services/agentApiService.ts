import { authenticatedRequest } from "@/utils/api"
import type { Agent, CreateAgentParams, AgentQuery, AgentResponse } from "../types"

/**
 * Serviço para interação com a API externa de agentes
 */
export const agentApiService = {
  /**
   * Cria um novo agente via API
   */
  async createAgent(data: CreateAgentParams): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "POST",
      path: "/agents",
      body: data,
    })
  },

  /**
   * Obtém um agente pelo ID via API
   */
  async getAgent(agentId: string): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "GET",
      path: `/agents/${agentId}`,
    })
  },

  /**
   * Atualiza um agente existente via API
   */
  async updateAgent(agentId: string, data: Partial<CreateAgentParams>): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "PATCH",
      path: `/agents/${agentId}`,
      body: data,
    })
  },

  /**
   * Remove um agente via API
   */
  async deleteAgent(agentId: string): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "DELETE",
      path: `/agents/${agentId}`,
    })
  },

  /**
   * Consulta um agente com uma pergunta via API
   */
  async queryAgent(agentId: string, query: AgentQuery): Promise<AgentResponse> {
    return authenticatedRequest<AgentResponse>({
      method: "POST",
      path: `/agents/${agentId}/query`,
      body: query,
    })
  },

  /**
   * Lista todos os agentes via API
   */
  async listAgents(): Promise<Agent[]> {
    return authenticatedRequest<Agent[]>({
      method: "GET",
      path: "/agents",
    })
  },
}
