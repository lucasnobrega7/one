import { type NextRequest, NextResponse } from "next/server"
import { agentService } from "../services/agent-service"
import { getCurrentUser } from "@/src/lib/auth/get-current-user"
import { z } from "zod"

const updateAgentSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  instructions: z.string().min(1, "Instructions are required").optional(),
  modelName: z
    .enum(["gpt-3.5-turbo", "gpt-4", "gpt-4o", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"])
    .optional(),
  temperature: z.number().min(0).max(1).optional(),
  visibility: z.enum(["public", "private"]).optional(),
  handle: z.string().optional(),
  includeSources: z.boolean().optional(),
  iconUrl: z.string().optional(),
  interfaceConfig: z.record(z.any()).optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user has access to this agent
    if (agent.organizationId !== user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const validationResult = updateAgentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 })
    }

    const updatedAgent = await agentService.updateAgent({
      id: agentId,
      ...validationResult.data,
    })

    return NextResponse.json(updatedAgent)
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update agent" },
      { status: 500 },
    )
  }
}
