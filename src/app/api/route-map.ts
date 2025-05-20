/**
 * API Route Map
 *
 * This file serves as a central registry of all API routes in the application.
 * It helps maintain an overview of available endpoints and their purposes.
 */

export const API_ROUTES = {
  // Agent routes
  AGENTS: {
    LIST: "/api/agents",
    CREATE: "/api/agents",
    GET: (id: string) => `/api/agents/${id}`,
    UPDATE: (id: string) => `/api/agents/${id}`,
    DELETE: (id: string) => `/api/agents/${id}`,
    QUERY: (id: string) => `/api/agents/${id}/query`,
  },

  // Datastore routes
  DATASTORES: {
    LIST: "/api/datastores",
    CREATE: "/api/datastores",
    GET: (id: string) => `/api/datastores/${id}`,
    UPDATE: (id: string) => `/api/datastores/${id}`,
    DELETE: (id: string) => `/api/datastores/${id}`,
    SEARCH: (id: string) => `/api/datastores/${id}/search`,
  },

  // Datasource routes
  DATASOURCES: {
    LIST: "/api/datasources",
    UPLOAD: "/api/datasources/upload",
    GET: (id: string) => `/api/datasources/${id}`,
    DELETE: (id: string) => `/api/datasources/${id}`,
    STATUS: (id: string) => `/api/datasources/${id}/status`,
  },

  // Conversation routes
  CONVERSATIONS: {
    LIST: "/api/conversations",
    CREATE: "/api/conversations",
    GET: (id: string) => `/api/conversations/${id}`,
    UPDATE: (id: string) => `/api/conversations/${id}`,
    DELETE: (id: string) => `/api/conversations/${id}`,
    MESSAGES: (id: string) => `/api/conversations/${id}/messages`,
  },

  // Integration routes
  INTEGRATIONS: {
    LIST: "/api/integrations",
    CREATE: "/api/integrations",
    GET: (id: string) => `/api/integrations/${id}`,
    UPDATE: (id: string) => `/api/integrations/${id}`,
    DELETE: (id: string) => `/api/integrations/${id}`,
  },

  // Webhook routes
  WEBHOOKS: {
    CLERK: "/api/webhooks/clerk",
    WHATSAPP: "/api/webhooks/whatsapp",
    TELEGRAM: "/api/webhooks/telegram",
    ZENDESK: "/api/webhooks/zendesk",
    CRISP: "/api/webhooks/crisp",
  },

  // Analytics routes
  ANALYTICS: {
    OVERVIEW: "/api/analytics",
    CONVERSATIONS: "/api/analytics/conversations",
    AGENTS: "/api/analytics/agents",
  },

  // User routes
  USERS: {
    PROFILE: "/api/users/profile",
    SETTINGS: "/api/users/settings",
  },

  // Organization routes
  ORGANIZATIONS: {
    GET: "/api/organizations",
    MEMBERS: "/api/organizations/members",
    INVITE: "/api/organizations/invite",
  },
}
