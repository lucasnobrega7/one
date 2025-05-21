import { type NextRequest, NextResponse } from "next/server"
import { agentService } from "../services/agent-service"
import { logError } from "@/src/utils/error-logging"
import { getCurrentUser } from "@/domains/auth/services/authService"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agents = await agentService.getAgents(user.organizationId)

    return NextResponse.json(agents)
  } catch (error) {
    logError(error, { action: "get-agents" })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agents" },
      { status: 500 },
    )
  }
}
