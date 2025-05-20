import { type NextRequest, NextResponse } from "next/server"
import { agentService } from "../services/agentService"
import { getCurrentUser } from "@/domains/auth/services/authService"
import { z } from "zod"

const createAgentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  modelName: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4o", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]),
  temperature: z.number().min(0).max(1),
  visibility: z.enum(["public", "private", "organization"]),
  handle: z.string().optional(),
  includeSources: z.boolean().default(true),
  iconUrl: z.string().optional(),
  interfaceConfig: z.record(z.any()).optional(),
})

/**
 * Endpoint para criar um novo agente
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const validationResult = createAgentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 })
    }

    const agent = await agentService.createAgent(user.organizationId, validationResult.data)

    return NextResponse.json(agent)
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create agent" },
      { status: 500 },
    )
  }
}
