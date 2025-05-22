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
