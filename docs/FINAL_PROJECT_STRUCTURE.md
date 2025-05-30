# 📐 Estrutura Final do Projeto - Agentes de Conversão

Este documento consolida a arquitetura completa de domínios, rotas do frontend (Next.js) e endpoints da API (FastAPI) planejada para a plataforma **Agentes de Conversão**. O objetivo é servir como referência única para a implementação.

## 1. Domínios e Subdomínios

- **Domínio principal:** `agentesdeconversao.ai` → redireciona para `lp.agentesdeconversao.ai`
- **Subdomínios:**
  - `lp.agentesdeconversao.ai` – Landing Page
  - `dash.agentesdeconversao.ai` – Dashboard principal
  - `docs.agentesdeconversao.ai` – Documentação
  - `login.agentesdeconversao.ai` – Autenticação
  - `api.agentesdeconversao.ai` – Backend API
  - `chat.agentesdeconversao.ai` – Widget de chat (embeddable)

## 2. Rotas do Frontend (Next.js App Router)

### 2.1 Públicas
```ts
/                    // Home da landing page
/sobre               // Sobre a empresa
/precos              // Planos e preços
/recursos            // Features detalhadas
/casos-de-uso        // Cases de sucesso
/blog                // Blog
/blog/[slug]         // Post individual
/contato             // Formulário de contato
/privacidade         // Política de privacidade
/termos              // Termos de uso
```

### Autenticação (`login.agentesdeconversao.ai`)
```ts
/                 // Login principal
/signup           // Criar conta
/forgot-password  // Recuperar senha
/reset-password   // Resetar senha com token
/verify-email     // Verificar email
/magic-link       // Login via link mágico
```

### 2.2 Protegidas – Dashboard (`dash.agentesdeconversao.ai`)
```ts
/                    // Visão geral
/onboarding          // Wizard de primeiro acesso
/profile             // Perfil do usuário
/settings            // Configurações da conta
/billing             // Faturamento e assinatura
/api-keys            // Tokens de API

/agents              // Lista de agentes
/agents/new          // Criar agente
/agents/[id]         // Detalhes
/agents/[id]/edit    // Editar agente
/agents/[id]/analytics // Analytics
/agents/[id]/test    // Testar agente

/agent-studio              // Lista de fluxos
/agent-studio/new          // Novo fluxo
/agent-studio/[agentId]    // Editor principal
/agent-studio/[agentId]/flow      // Editor visual
/agent-studio/[agentId]/prompts   // Prompts
/agent-studio/[agentId]/tools     // Ferramentas
/agent-studio/[agentId]/training  // Treinamento
/agent-studio/[agentId]/simulate  // Simulador
/agent-studio/templates     // Galeria de templates

/conversations              // Conversas
/conversations/[id]         // Conversa específica
/conversations/[id]/transcript // Transcrição
/monitoring                 // Monitoramento
/analytics                  // Dashboard de analytics
/knowledge                  // Base de conhecimento
/integrations               // Integrações
/team                       // Time e colaboração
```

### 2.3 Administrativas
```ts
/admin                // Dashboard admin
/admin/users          // Gerenciar usuários
/admin/organizations  // Organizações
/admin/agents         // Todos os agentes
/admin/conversations  // Todas as conversas
/admin/api-status     // Status das APIs
/admin/api-keys       // Chaves globais
/admin/config-check   // Verificação de sistema
/admin/logs           // Logs
/admin/metrics        // Métricas
/admin/billing        // Faturamento geral
/admin/subdomains     // Subdomínios
/admin/maintenance    // Modo manutenção
```

## 3. Endpoints da API (FastAPI)

A API é exposta em `api.agentesdeconversao.ai`.

### 3.1 Públicos
```http
GET  /              # Info e status
GET  /health        # Health check
GET  /status        # Status detalhado
POST /webhooks/{provider}  # Webhooks de entrada

POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
GET  /auth/me
```

### 3.2 Agentes
```http
GET    /agents                 # Listar agentes
POST   /agents                 # Criar
GET    /agents/:id             # Detalhes
PUT    /agents/:id             # Atualizar
DELETE /agents/:id             # Remover
POST   /agents/:id/duplicate   # Duplicar
GET    /agents/:id/config      # Config completo
PUT    /agents/:id/config      # Atualizar config
POST   /agents/:id/test        # Testar
GET    /agents/:id/logs        # Logs
GET    /agents/:id/analytics   # Analytics
GET    /agents/:id/metrics     # Métricas
GET    /agents/:id/performance # Performance
```

### 3.3 Conversas
```http
GET    /conversations                   # Listar
POST   /conversations                   # Iniciar
GET    /conversations/:id               # Detalhes
PUT    /conversations/:id               # Atualizar
DELETE /conversations/:id               # Deletar
POST   /conversations/:id/archive       # Arquivar
POST   /conversations/:id/unarchive     # Desarquivar

GET    /conversations/:id/messages      # Mensagens
POST   /conversations/:id/messages      # Enviar
PUT    /conversations/:id/messages/:msgId  # Editar
DELETE /conversations/:id/messages/:msgId  # Remover

POST   /conversations/:id/assign        # Atribuir humano
POST   /conversations/:id/transfer      # Transferir
POST   /conversations/:id/close         # Fechar
POST   /conversations/:id/reopen        # Reabrir
POST   /conversations/:id/rate          # Avaliar
```

### 3.4 Conhecimento
```http
GET    /knowledge/documents             # Listar docs
POST   /knowledge/documents/upload      # Upload
GET    /knowledge/documents/:id         # Detalhes
DELETE /knowledge/documents/:id         # Remover
POST   /knowledge/documents/:id/process # Reprocessar

GET    /knowledge/sources               # Fontes
POST   /knowledge/sources               # Adicionar
PUT    /knowledge/sources/:id           # Atualizar
DELETE /knowledge/sources/:id           # Remover
POST   /knowledge/sources/:id/sync      # Sincronizar

GET    /knowledge/mcp                   # Conectores MCP
POST   /knowledge/mcp/:type/connect     # Conectar
GET    /knowledge/mcp/:id/status        # Status
PUT    /knowledge/mcp/:id/config        # Configurar
DELETE /knowledge/mcp/:id               # Desconectar
POST   /knowledge/mcp/:id/test          # Testar
```

### 3.5 AgentStudio
```http
GET    /flows                      # Listar fluxos
POST   /flows                      # Criar
GET    /flows/:id                  # Detalhes
PUT    /flows/:id                  # Atualizar
DELETE /flows/:id                  # Deletar
POST   /flows/:id/publish          # Publicar
POST   /flows/:id/draft            # Salvar rascunho
GET    /flows/:id/versions         # Histórico
POST   /flows/:id/rollback/:version  # Reverter

GET    /flows/templates            # Templates
GET    /flows/templates/:category  # Por categoria
POST   /flows/templates/:id/use    # Usar template
```

### 3.6 Analytics
```http
GET /analytics/overview         # Overview
GET /analytics/real-time        # Dados em tempo real
GET /analytics/historical       # Dados históricos
GET /analytics/conversations    # Por conversa
GET /analytics/agents           # Por agente
GET /analytics/users            # Por usuário
GET /analytics/conversion       # Funil
GET /analytics/satisfaction     # Satisfação
GET /analytics/trends           # Tendências
POST /analytics/reports/generate  # Gerar relatório
GET  /analytics/reports/:id       # Baixar
GET  /analytics/reports           # Listar
```

### 3.7 Integrações
```http
POST   /integrations/whatsapp/qr      # Gerar QR
POST   /integrations/whatsapp/verify  # Verificar
GET    /integrations/whatsapp/status  # Status
POST   /integrations/whatsapp/send    # Enviar
POST   /integrations/whatsapp/webhook # Webhook

GET    /integrations/webhooks         # Listar webhooks
POST   /integrations/webhooks         # Criar
PUT    /integrations/webhooks/:id     # Atualizar
DELETE /integrations/webhooks/:id     # Deletar
POST   /integrations/webhooks/:id/test # Testar
```

### 3.8 Admin
```http
GET  /admin/users            # Todos usuários
GET  /admin/organizations    # Todas as organizações
GET  /admin/metrics          # Métricas do sistema
POST /admin/broadcast        # Comunicado
PUT  /admin/config           # Configuração global
POST /admin/maintenance      # Modo manutenção
GET  /admin/logs             # Logs
POST /admin/cache/clear      # Limpar cache
```

## 4. Widgets e Embeds
```ts
/widget/:agentId           // Widget de chat
/widget/:agentId/bubble    // Versão bubble
/widget/:agentId/fullscreen // Tela cheia
/widget/:agentId/inline    // Inline

/embed/js/:agentId         // JavaScript do widget
/embed/css/:agentId        // CSS customizado
```

## 5. Documentação (`docs.agentesdeconversao.ai`)
```ts
/                      // Home
/quickstart            // Guia rápido
/tutorials             // Tutoriais
/tutorials/[slug]      // Tutorial específico
/api-reference         // Referência da API
/api-reference/[endpoint] // Endpoint específico
/sdks                  // SDKs
/sdks/[language]       // SDK específico
/guides                // Guias avançados
/guides/[topic]        // Guia específico
/changelog             // Histórico
/support               // Suporte
```

## 6. Rotas Especiais
```ts
/404            // Página não encontrada
/500            // Erro do servidor
/maintenance    // Modo manutenção

/privacy        // Política de privacidade
/terms          // Termos de serviço
/cookies        // Política de cookies
/gdpr           // GDPR compliance
/security       // Segurança

/affiliate      // Programa de afiliados
/partners       // Parceiros
/press          // Imprensa
/careers        // Carreiras
```

## 7. Estrutura de Pastas Next.js (App Router)
```ts
app/
├── (public)/
│   ├── page.tsx
│   ├── sobre/page.tsx
│   ├── precos/page.tsx
│   └── contato/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── agents/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── edit/page.tsx
│   │       └── analytics/page.tsx
│   ├── conversations/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── agent-studio/
│   │   ├── page.tsx
│   │   └── [agentId]/
│   │       ├── page.tsx
│   │       ├── flow/page.tsx
│   │       └── prompts/page.tsx
│   └── analytics/
│       ├── page.tsx
│       └── [type]/page.tsx
├── admin/
│   ├── layout.tsx
│   └── [...admin pages]
└── api/
    └── [...endpoints]
```

---

Este guia resume a organização pretendida para todo o ecossistema **Agentes de Conversão**, servindo como referência para desenvolvimento e futuras auditorias.
