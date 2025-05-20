import { type NextRequest, NextResponse } from "next/server"
import { agentService } from "../services/agentService"
import { getCurrentUser } from "@/domains/auth/services/authService"

/**
 * Endpoint para obter um agente específico pelo ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agentId = params.id
    const agent = await agentService.getAgentById(agentId)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Verificar se o usuário tem acesso a este agente
    if (agent.organizationId !== user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agent" },
      { status: 500 },
    )
  }
}
