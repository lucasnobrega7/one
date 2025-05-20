import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/domains/auth/services/authService"
import { agentService } from "../services/agentService"
import { queryService } from "@/domains/conversations/services/queryService"
import { z } from "zod"

const queryAgentSchema = z.object({
  query: z.string().min(1, "Query is required"),
  conversationId: z.string().optional(),
})

/**
 * Endpoint para consultar um agente com uma pergunta
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Para agentes públicos, qualquer um pode consultar
    // Para agentes privados, verificar acesso da organização
    if (agent.visibility === "private" && agent.organizationId !== user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const validationResult = queryAgentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 })
    }

    const { query, conversationId } = validationResult.data

    const response = await queryService.queryAgent({
      agentId,
      query,
      userId: user.id,
      conversationId,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error querying agent:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to query agent" },
      { status: 500 },
    )
  }
}
