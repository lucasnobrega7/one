// Definição de todas as permissões disponíveis no sistema
export enum Permission {
  // Permissões de Dashboard
  ViewDashboard = "view_dashboard",

  // Permissões de Agentes
  ViewAgents = "view_agents",
  CreateAgent = "create_agent",
  EditAgent = "edit_agent",
  DeleteAgent = "delete_agent",

  // Permissões de Bases de Conhecimento
  ViewKnowledgeBases = "view_knowledge_bases",
  CreateKnowledgeBase = "create_knowledge_base",
  EditKnowledgeBase = "edit_knowledge_base",
  DeleteKnowledgeBase = "delete_knowledge_base",
  UploadDocuments = "upload_documents",

  // Permissões de Conversas
  ViewConversations = "view_conversations",
  DeleteConversations = "delete_conversations",

  // Permissões de Analytics
  ViewAnalytics = "view_analytics",
  ExportAnalytics = "export_analytics",

  // Permissões de Usuários
  ViewUsers = "view_users",
  CreateUser = "create_user",
  EditUser = "edit_user",
  DeleteUser = "delete_user",

  // Permissões de Configurações
  ManageSettings = "manage_settings",
  ManageApiKeys = "manage_api_keys",

  // Permissões de IA e Integrações
  ManageAIProviders = "manage_ai_providers",
  ViewUsageMetrics = "view_usage_metrics",
  ManageIntegrations = "manage_integrations",
}

// Definição dos roles disponíveis no sistema
export enum Role {
  Admin = "admin",
  Manager = "manager",
  Editor = "editor",
  Viewer = "viewer",
}

// Mapeamento de roles para permissões
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Admin]: Object.values(Permission), // Admin tem todas as permissões

  [Role.Manager]: [
    Permission.ViewDashboard,
    Permission.ViewAgents,
    Permission.CreateAgent,
    Permission.EditAgent,
    Permission.ViewKnowledgeBases,
    Permission.CreateKnowledgeBase,
    Permission.EditKnowledgeBase,
    Permission.UploadDocuments,
    Permission.ViewConversations,
    Permission.DeleteConversations,
    Permission.ViewAnalytics,
    Permission.ExportAnalytics,
    Permission.ViewUsers,
    Permission.ViewUsageMetrics,
    Permission.ManageIntegrations,
  ],

  [Role.Editor]: [
    Permission.ViewDashboard,
    Permission.ViewAgents,
    Permission.CreateAgent,
    Permission.EditAgent,
    Permission.ViewKnowledgeBases,
    Permission.CreateKnowledgeBase,
    Permission.EditKnowledgeBase,
    Permission.UploadDocuments,
    Permission.ViewConversations,
    Permission.ViewAnalytics,
    Permission.ViewUsageMetrics,
  ],

  [Role.Viewer]: [
    Permission.ViewDashboard,
    Permission.ViewAgents,
    Permission.ViewKnowledgeBases,
    Permission.ViewConversations,
    Permission.ViewAnalytics,
  ],
}

// Função para verificar se um role tem uma permissão específica
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}

// Função para verificar se um usuário tem uma permissão específica
export function userHasPermission(userRoles: Role[], permission: Permission): boolean {
  return userRoles.some((role) => hasPermission(role, permission))
}

// Função para verificar se um role tem pelo menos uma das permissões
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

// Função para verificar se um role tem todas as permissões
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

// Função para obter todas as permissões de um role
export function getAllPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

// Compatibilidade com sistema anterior (type aliases)
export type LegacyRole = 'admin' | 'manager' | 'user' | 'viewer'
export type LegacyPermission = 
  | 'agents:create'
  | 'agents:read' 
  | 'agents:update'
  | 'agents:delete'
  | 'analytics:read'
  | 'analytics:export'
  | 'knowledge:upload'
  | 'knowledge:read'
  | 'knowledge:delete'
  | 'users:manage'
  | 'billing:read'
  | 'billing:manage'
  | 'settings:read'
  | 'settings:write'
  | 'integrations:manage'

// Mapeamento de compatibilidade
export const LEGACY_ROLE_MAPPING: Record<LegacyRole, Role> = {
  admin: Role.Admin,
  manager: Role.Manager,
  user: Role.Editor,
  viewer: Role.Viewer,
}

export const LEGACY_PERMISSION_MAPPING: Record<LegacyPermission, Permission> = {
  'agents:create': Permission.CreateAgent,
  'agents:read': Permission.ViewAgents,
  'agents:update': Permission.EditAgent,
  'agents:delete': Permission.DeleteAgent,
  'analytics:read': Permission.ViewAnalytics,
  'analytics:export': Permission.ExportAnalytics,
  'knowledge:upload': Permission.UploadDocuments,
  'knowledge:read': Permission.ViewKnowledgeBases,
  'knowledge:delete': Permission.DeleteKnowledgeBase,
  'users:manage': Permission.ViewUsers,
  'billing:read': Permission.ViewUsageMetrics,
  'billing:manage': Permission.ManageSettings,
  'settings:read': Permission.ViewDashboard,
  'settings:write': Permission.ManageSettings,
  'integrations:manage': Permission.ManageIntegrations,
}