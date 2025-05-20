"use client"

import { trackingEvents } from "@/domains/analytics/utils/event-tracking"
import { useEffect } from "react"

interface AgentActionTrackerProps {
  agentId: string
  agentType: string
  action: "created" | "updated" | "deleted" | "queried"
  queryLength?: number
  fields?: string[]
}

/**
 * Component to track agent-related actions
 * This is a utility component with no UI
 */
export function AgentActionTracker({ agentId, agentType, action, queryLength, fields }: AgentActionTrackerProps) {
  useEffect(() => {
    switch (action) {
      case "created":
        trackingEvents.agentCreated(agentId, agentType)
        break
      case "updated":
        trackingEvents.agentUpdated(agentId, fields || [])
        break
      case "deleted":
        trackingEvents.agentDeleted(agentId)
        break
      case "queried":
        if (queryLength !== undefined) {
          trackingEvents.agentQueried(agentId, queryLength)
        }
        break
    }
  }, [agentId, agentType, action, queryLength, fields])

  return null // This component doesn't render anything
}
