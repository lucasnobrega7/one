import { type NextRequest, NextResponse } from "next/server"
import { agentService } from "../services/agentService"
import { getCurrentUser } from "@/domains/auth/services/authService"

/**
 * Endpoint para listar todos os agentes de uma organização
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agents = await agentService.getAgents(user.organizationId)

    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agents" },
      { status: 500 },
    )
  }
}
