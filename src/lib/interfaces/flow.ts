export interface IPosition {
  x: number
  y: number
}

export interface INodeData {
  label: string
  [key: string]: any
}

export interface INode {
  id: string
  type: string
  position: IPosition
  data: INodeData
  [key: string]: any
}

export interface IEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  animated?: boolean
  style?: Record<string, any>
  [key: string]: any
}

export interface IFlow {
  id: string
  name: string
  description?: string
  nodes: INode[]
  edges: IEdge[]
  type?: string
  isPublic?: boolean
  apiKey?: string
  chatbotConfig?: Record<string, any>
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export interface IFlowValidationResult {
  valid: boolean
  errors: string[]
}

export interface ITemplate {
  id: string
  name: string
  description: string
  nodes: INode[]
  edges: IEdge[]
  category: string
  thumbnail?: string
}
