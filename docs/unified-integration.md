# Guia de Integração Unificada - Agentes de Conversão

Este documento explica como a nova camada de integração unificada funciona, conectando o projeto local com a API principal em `api.agentesdeconversao.com.br`.

## Visão Geral da Arquitetura

A integração é construída em camadas para maximizar a resiliência e flexibilidade:

```
┌─────────────────────────────────────────────────┐
│            Aplicação (Next.js)                  │
├─────────────────────────────────────────────────┤
│         Fallback Service (Orquestrador)         │
├─────────────────────────────────────────────────┤
│   Cache Service  │  API Client  │  Sync Service │
├─────────────────────────────────────────────────┤
│  Auth Adapter    │     DTOs     │    Config     │
├─────────────────────────────────────────────────┤
│   Supabase DB    │  External API │   AI Services│
└─────────────────────────────────────────────────┘
```

## Componentes Principais

### 1. Adaptador de Autenticação (`auth-adapter.ts`)

Unifica a autenticação entre NextAuth e a API externa:

```typescript
import { authAdapter } from '@/lib/unified/auth-adapter'

// Obter headers para chamadas à API
const headers = await authAdapter.getApiHeaders()

// Autenticar com API externa
const result = await authAdapter.authenticateWithExternalApi({
  email: 'user@example.com',
  password: 'password'
})
```

### 2. DTOs (Data Transfer Objects)

Padroniza os formatos de dados entre sistemas:

```typescript
import { AgentDataAdapter, type UnifiedAgent } from '@/lib/unified/dto/agent.dto'

// Converter dados do Supabase para formato unificado
const unifiedAgent = AgentDataAdapter.fromSupabase(supabaseData)

// Converter para formato da API externa
const apiData = AgentDataAdapter.toApiRequest(unifiedAgent)
```

### 3. Cliente da API (`api-client.ts`)

Interface unificada para todas as operações com a API externa:

```typescript
import { apiClient } from '@/lib/unified/api-client'

// Criar agente
const response = await apiClient.createAgent(agentData)

// Invocar agente (chat)
const message = await apiClient.invokeAgent(agentId, "Olá!")

// Streaming
for await (const chunk of apiClient.invokeAgentStream(agentId, "Olá!")) {
  console.log(chunk)
}
```

### 4. Serviço de Sincronização (`sync-service.ts`)

Mantém dados sincronizados entre local e API externa:

```typescript
import { syncService } from '@/lib/unified/sync-service'

// Sincronizar um agente específico
await syncService.syncAgent(agentId)

// Sincronizar todos os dados pendentes
await syncService.syncAll()

// Verificar saúde da sincronização
const health = await syncService.checkSyncHealth()
```

### 5. Serviço de Cache (`cache-service.ts`)

Otimiza performance com cache em memória e banco local:

```typescript
import { cacheService } from '@/lib/unified/cache-service'

// Cache é gerenciado automaticamente, mas pode ser invalidado
cacheService.invalidateAgent(agentId)

// Limpar todo o cache
cacheService.clearAll()
```

### 6. Serviço de Fallback (`fallback-service.ts`)

Orquestra todas as operações com fallback automático:

```typescript
import { fallbackService } from '@/lib/unified/fallback-service'

// Buscar agente (tenta API, cai para cache/local se necessário)
const agent = await fallbackService.getAgent(agentId)

// Invocar agente com fallback para IA local
const response = await fallbackService.invokeAgent(agentId, message)

// Operações com retry automático
const result = await fallbackService.withRetry(
  () => apiClient.createAgent(data),
  3 // número de tentativas
)
```

## Configuração

### Variáveis de Ambiente

Configure no arquivo `.env.local`:

```env
# API Principal
NEXT_PUBLIC_API_URL=https://api.agentesdeconversao.com.br

# Feature Toggles
USE_LOCAL_DB=true          # Usar banco local como fallback
USE_EXTERNAL_API=true      # Usar API externa
USE_LOCAL_AI=true          # Usar IA local como fallback
ENABLE_CACHE=true          # Habilitar cache
ENABLE_AUTO_SYNC=true      # Sincronização automática

# Configuração de Performance
CACHE_TTL_SECONDS=300      # Tempo de vida do cache
SYNC_INTERVAL_MS=60000     # Intervalo de sincronização
RETRY_ATTEMPTS=3           # Tentativas em caso de erro
```

### Migração do Banco de Dados

Execute a migração para adicionar campos de sincronização:

```bash
# Via Supabase CLI
supabase migration up

# Ou execute diretamente no Supabase Dashboard:
# supabase/migrations/001_add_sync_fields.sql
```

## Uso nos Componentes

### Hook de Agentes Atualizado

O hook `useAgents` foi atualizado para usar a camada unificada:

```typescript
import { useAgents } from '@/hooks/use-agents'

function MyComponent() {
  const { agents, loading, createAgent, syncAgents } = useAgents()
  
  // Criar agente (sincroniza automaticamente)
  const handleCreate = async (data) => {
    const agent = await createAgent(data)
    // Agent é criado localmente e sincronizado com API
  }
  
  // Forçar sincronização
  const handleSync = async () => {
    await syncAgents()
  }
}
```

### Fluxo de Dados

1. **Criação de Agente:**
   - Salva localmente primeiro (resposta imediata)
   - Sincroniza com API em background
   - Atualiza status de sincronização

2. **Busca de Agentes:**
   - Verifica cache em memória
   - Tenta API externa
   - Cai para banco local se necessário
   - Atualiza cache para próximas requisições

3. **Chat/Invocação:**
   - Prioriza API externa para tempo real
   - Cai para IA local se API indisponível
   - Salva histórico localmente

## Monitoramento e Debug

### Status de Sincronização

Verifique o status de sincronização no banco:

```sql
-- Ver agentes pendentes de sincronização
SELECT id, name, sync_status, last_sync_at 
FROM agents 
WHERE sync_status != 'synced';

-- Ver logs de sincronização
SELECT * FROM sync_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

### Debug Mode

Ative o modo debug para logs detalhados:

```env
DEBUG_MODE=true
```

### Health Check

Endpoint para verificar saúde da integração:

```typescript
// Em uma API route
import { apiClient } from '@/lib/unified/api-client'
import { syncService } from '@/lib/unified/sync-service'

export async function GET() {
  const [apiHealth, syncHealth] = await Promise.all([
    apiClient.checkHealth(),
    syncService.checkSyncHealth()
  ])
  
  return Response.json({
    api: apiHealth,
    sync: syncHealth
  })
}
```

## Migração Gradual

A arquitetura permite migração gradual:

1. **Fase 1:** Use apenas banco local (USE_EXTERNAL_API=false)
2. **Fase 2:** Ative API com fallback (USE_EXTERNAL_API=true, USE_LOCAL_DB=true)
3. **Fase 3:** API como fonte principal (ajuste ordem no fallbackService)

## Tratamento de Erros

O sistema trata erros graciosamente:

- **API indisponível:** Cai para cache/local automaticamente
- **Falha de sincronização:** Marca como 'pending' para retry
- **Timeout:** Configurável por operação
- **Rate limiting:** Retry com backoff exponencial

## Performance

Otimizações implementadas:

- Cache em memória para reduzir latência
- Requisições paralelas quando possível
- Sincronização assíncrona em background
- Compressão de dados em cache
- Invalidação inteligente de cache

## Segurança

- Tokens armazenados seguramente
- Refresh automático de tokens
- Validação de dados em todas as camadas
- Logs de auditoria para sincronização
- Isolamento de dados por usuário