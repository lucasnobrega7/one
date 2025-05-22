# Sistema de Autenticação e Controle de Acesso

Este documento descreve o sistema de autenticação e controle de acesso implementado no projeto "Agentes de Conversão".

## Visão Geral

O sistema utiliza NextAuth.js integrado com Supabase para fornecer autenticação robusta e um sistema de controle de acesso baseado em roles e permissões granulares.

## Componentes Principais

### 1. Middleware de Proteção de Rotas

O middleware (`middleware.ts`) protege automaticamente todas as rotas não-públicas, verificando:
- Se o usuário está autenticado
- Se o usuário tem as permissões necessárias para acessar a rota

### 2. Sistema de Roles e Permissões

Definido em `lib/auth/permissions.ts`, o sistema inclui:
- Enum `Permission`: Lista todas as permissões disponíveis
- Enum `Role`: Define os papéis de usuário (Admin, Manager, Editor, Viewer)
- Mapeamento `ROLE_PERMISSIONS`: Associa cada role às suas permissões

### 3. Componentes de Proteção

- `ProtectedRoute`: Protege rotas no lado do cliente
- `PermissionGate`: Renderiza conteúdo apenas se o usuário tiver permissão específica
- `RoleGate`: Renderiza conteúdo apenas se o usuário tiver role específico

## Fluxo de Autenticação

1. O usuário acessa uma rota protegida
2. O middleware verifica se há um token JWT válido
3. Se não houver token, redireciona para login
4. Se houver token, verifica se o usuário tem as permissões necessárias
5. Se não tiver permissões, redireciona para página de acesso negado

## Estrutura de Banco de Dados

- Tabela `users`: Armazena informações dos usuários
- Tabela `roles`: Define os roles disponíveis
- Tabela `user_roles`: Associa usuários a roles (muitos-para-muitos)

## Como Usar

### Proteger uma Rota

\`\`\`tsx
// Em um arquivo de layout ou página
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Permission } from "@/lib/auth/permissions";

export default function ProtectedPage() {
  return (
    <ProtectedRoute permission={Permission.ViewDashboard}>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}
\`\`\`

### Renderização Condicional por Permissão

\`\`\`tsx
import { PermissionGate } from "@/components/auth/permission-gate";
import { Permission } from "@/lib/auth/permissions";

export function MyComponent() {
  return (
    <div>
      <h1>Conteúdo visível para todos</h1>
      
      <PermissionGate permission={Permission.CreateAgent}>
        <button>Criar Agente (visível apenas para quem tem permissão)</button>
      </PermissionGate>
    </div>
  );
}
\`\`\`

### Verificar Permissões em Código

\`\`\`tsx
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@/lib/auth/permissions";

export function MyComponent() {
  const { hasPermission, isAdmin } = usePermissions();
  
  const handleAction = () => {
    if (hasPermission(Permission.DeleteAgent)) {
      // Executar ação que requer permissão
    }
  };
  
  return (
    <div>
      {isAdmin() && <div>Conteúdo exclusivo para administradores</div>}
    </div>
  );
}
\`\`\`

## Melhores Práticas

1. **Defesa em Profundidade**: Sempre implementar verificações de permissão tanto no cliente quanto no servidor
2. **Granularidade**: Criar permissões específicas para cada ação em vez de permissões genéricas
3. **Princípio do Menor Privilégio**: Atribuir apenas as permissões mínimas necessárias para cada role
4. **Auditoria**: Registrar tentativas de acesso não autorizado para análise de segurança
