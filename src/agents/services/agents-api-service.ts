import { authenticatedRequest } from "@/src/lib/api/api-client"
import type { Agent, AgentCreate, AgentQuery, AgentResponse } from "@/src/types/api"

export const agentsApiService = {
  /**
   * Cria um novo agente
   */
  async createAgent(data: AgentCreate): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "POST",
      path: "/agents",
      body: data,
    })
  },

  /**
   * Obtém um agente pelo ID
   */
  async getAgent(agentId: string): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "GET",
      path: `/agents/${agentId}`,
    })
  },

  /**
   * Atualiza um agente existente
   */
  async updateAgent(agentId: string, data: AgentCreate): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "PATCH",
      path: `/agents/${agentId}`,
      body: data,
    })
  },

  /**
   * Remove um agente
   */
  async deleteAgent(agentId: string): Promise<Agent> {
    return authenticatedRequest<Agent>({
      method: "DELETE",
      path: `/agents/${agentId}`,
    })
  },

  /**
   * Consulta um agente com uma pergunta
   */
  async queryAgent(agentId: string, query: AgentQuery): Promise<AgentResponse> {
    return authenticatedRequest<AgentResponse>({
      method: "POST",
      path: `/agents/${agentId}/query`,
      body: query,
    })
  },

  /**
   * Lista todos os agentes
   * Nota: Este endpoint não está na especificação OpenAPI, mas é comum ter um endpoint de listagem
   */
  async listAgents(): Promise<Agent[]> {
    return authenticatedRequest<Agent[]>({
      method: "GET",
      path: "/agents",
    })
  },
}
