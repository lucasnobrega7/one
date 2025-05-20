import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth/get-current-user"
import { agentService } from "../services/agent-service"
import { queryService } from "@/src/conversations/services/query-service"
import { z } from "zod"

const queryAgentSchema = z.object({
  query: z.string().min(1, "Query is required"),
  conversationId: z.string().optional(),
})

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

    // For public agents, anyone can query
    // For private agents, check organization access
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
