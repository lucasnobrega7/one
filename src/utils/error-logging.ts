import { trackEvent } from "@/lib/analytics"

export function logError(error: unknown, context?: Record<string, any>) {
  console.error(error)
  try {
    trackEvent("error", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    })
  } catch (err) {
    console.error("Failed to send error to analytics:", err)
  }
}