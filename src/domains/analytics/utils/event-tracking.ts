import { trackEvent } from "@/lib/analytics"

/**
 * Utility functions for tracking common events
 */
export const trackingEvents = {
  // User events
  userSignedUp: (source?: string) => {
    trackEvent("user_signed_up", { source })
  },

  userLoggedIn: (userId: string) => {
    trackEvent("user_logged_in", { userId })
  },

  userUpdatedProfile: (userId: string, fields: string[]) => {
    trackEvent("user_updated_profile", { userId, fields })
  },

  // Agent events
  agentCreated: (agentId: string, agentType: string) => {
    trackEvent("agent_created", { agentId, agentType })
  },

  agentUpdated: (agentId: string, fields: string[]) => {
    trackEvent("agent_updated", { agentId, fields })
  },

  agentDeleted: (agentId: string) => {
    trackEvent("agent_deleted", { agentId })
  },

  agentQueried: (agentId: string, queryLength: number) => {
    trackEvent("agent_queried", { agentId, queryLength })
  },

  // Document events
  documentUploaded: (documentId: string, fileType: string, fileSize: number) => {
    trackEvent("document_uploaded", { documentId, fileType, fileSize })
  },

  documentProcessed: (documentId: string, processingTime: number) => {
    trackEvent("document_processed", { documentId, processingTime })
  },

  // Conversation events
  conversationStarted: (conversationId: string, agentId: string) => {
    trackEvent("conversation_started", { conversationId, agentId })
  },

  messageSent: (conversationId: string, messageType: "user" | "agent") => {
    trackEvent("message_sent", { conversationId, messageType })
  },

  // Integration events
  integrationConnected: (integrationType: string) => {
    trackEvent("integration_connected", { integrationType })
  },

  // Subscription events
  subscriptionChanged: (oldPlan: string, newPlan: string) => {
    trackEvent("subscription_changed", { oldPlan, newPlan })
  },

  // Feature usage events
  featureUsed: (featureName: string) => {
    trackEvent("feature_used", { featureName })
  },
}
