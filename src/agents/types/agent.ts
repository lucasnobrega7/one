import type { Tool } from "@/integrations/types/tool"
import type { DatastoreType } from "@/datastores/types/datastore"

export type AgentModelName =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4o"
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"

export type AgentVisibility = "public" | "private"

export interface AgentInterfaceConfig {
  primaryColor?: string
  textColor?: string
  fontSize?: string
  fontFamily?: string
  chatBubbleStyle?: string
  showBranding?: boolean
  customCss?: string
  instagramURL?: string
  twitterURL?: string
  githubURL?: string
  websiteURL?: string
  youtubeURL?: string
  tiktokURL?: string
}

export interface Agent {
  id: string
  organizationId: string
  name: string
  description: string
  instructions: string
  modelName: AgentModelName
  temperature: number
  iconUrl?: string
  handle?: string
  visibility: AgentVisibility
  interfaceConfig?: AgentInterfaceConfig
  includeSources?: boolean
  tools?: Tool[]
  createdAt: Date
  updatedAt: Date
}

export interface AgentWithDatastores extends Agent {
  datastores?: {
    id: string
    name: string
    type: DatastoreType
  }[]
}
