# Guia de Integração com API agentesdeconversao.com.br

Este documento descreve a integração completa do projeto com a API do agentesdeconversao.com.br, incluindo configuração, uso e testes.

## 🎯 Visão Geral

A integração oferece:
- **Cliente API centralizado** com suporte a todos os endpoints principais
- **Sincronização automática** entre dados locais e externos
- **Tratamento robusto de erros** com retry automático
- **Testes de integração** completos
- **Fallback local** quando a API externa não está disponível

## 📋 Endpoints Suportados

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/signup` - Registro de usuário
- `POST /auth/logout` - Logout
- `POST /auth/reset-password` - Reset de senha
- `GET /auth/verify-token` - Verificação de token

### IA e Chat
- `POST /ai/chat/completions` - Completions de chat (OpenAI/Anthropic)
- `GET /ai/models` - Lista de modelos disponíveis

### WhatsApp (Z-API)
- `POST /zapi/send-message` - Enviar mensagem
- `POST /zapi/forward-message` - Encaminhar mensagem
- `GET /zapi/messages` - Buscar mensagens
- `POST /zapi/webhook` - Webhook de mensagens

### Banco de Dados (Supabase)
- `POST /supabase/query` - Consultar dados
- `POST /supabase/insert` - Inserir dados
- `POST /supabase/update` - Atualizar dados
- `POST /supabase/delete` - Deletar dados

### Sistema de Saúde
- `GET /health` - Status da API

## 🔧 Configuração

### Variáveis de Ambiente

```env
# API Principal
NEXT_PUBLIC_API_URL=https://api.agentesdeconversao.com.br
USE_EXTERNAL_API=true

# Autenticação
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Banco de Dados Local (Fallback)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Configurações de Sync
ENABLE_AUTO_SYNC=true
SYNC_INTERVAL_MS=60000
RETRY_ATTEMPTS=3
RETRY_DELAY_MS=1000

# Cache
ENABLE_CACHE=true
CACHE_TTL_SECONDS=300

# Desenvolvimento
DEBUG_MODE=true
RUN_INTEGRATION_TESTS=false
```

### Instalação de Dependências

```bash
npm install
# ou
yarn install
```

## 🚀 Uso Básico

### Cliente API

```typescript
import { apiClient } from '@/lib/unified/api-client'

// Verificar saúde da API
const isHealthy = await apiClient.checkHealth()

// Autenticar usuário
const authResult = await apiClient.authenticate('user@example.com', 'password')
if (authResult.success) {
  console.log('Token:', authResult.data.token)
}

// Chat completion
const chatResult = await apiClient.chatCompletion([
  { role: 'user', content: 'Olá!' }
])

// Enviar mensagem WhatsApp
const whatsappResult = await apiClient.sendWhatsAppMessage(
  '5511999999999',
  'Olá! Como posso ajudar?'
)

// Operações de banco de dados
const queryResult = await apiClient.queryDatabase('agents', {
  select: '*',
  limit: 10
})
```

### Serviço de Sincronização

```typescript
import { syncService } from '@/lib/unified/sync-service'

// Sincronizar um agente específico
const syncResult = await syncService.syncAgent('agent-id', 'both')

// Sincronizar todos os agentes pendentes
const batchResult = await syncService.syncPendingAgents()

// Verificar status da sincronização
const health = await syncService.checkSyncHealth()

// Iniciar sincronização automática
syncService.startAutoSync()
```

### Tratamento de Erros

```typescript
import { ApiErrorHandler, ApiErrorType } from '@/lib/unified/error-handler'

const result = await apiClient.chatCompletion(messages)

if (!result.success) {
  // Log do erro para debugging
  ApiErrorHandler.logError(result.error, 'Chat completion')
  
  // Formatar erro para o usuário
  const userMessage = ApiErrorHandler.formatForUser(result.error)
  
  // Verificar se deve mostrar para o usuário
  if (ApiErrorHandler.shouldShowToUser(result.error)) {
    showErrorToUser(userMessage)
  }
  
  // Verificar se deve tentar novamente
  if (result.error.retryable) {
    const delay = ApiErrorHandler.getRetryDelay(result.error, attempt)
    setTimeout(() => retryOperation(), delay)
  }
}
```

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes com coverage
npm run test:coverage

# Testes de integração (requer API externa)
RUN_INTEGRATION_TESTS=true npm run test:integration

# Script completo de testes da API
npm run test:api

# Todos os testes
npm run test:all
```

### Configuração de Testes de Integração

Para executar testes de integração completos:

1. Configure as variáveis de ambiente necessárias
2. Certifique-se de que a API externa está acessível
3. Execute: `RUN_INTEGRATION_TESTS=true npm run test:integration`

### Script de Teste da API

O script `test-api-integration.ts` oferece:
- ✅ Verificação de pré-requisitos
- 🧪 Execução de testes unitários
- 🔗 Testes de integração (opcional)
- 🏥 Verificações de saúde da API
- 📊 Relatório detalhado de resultados

```bash
# Execução básica
npm run test:api

# Com output detalhado
VERBOSE_OUTPUT=true npm run test:api

# Com testes de integração
RUN_INTEGRATION_TESTS=true npm run test:api
```

## 🔄 Fluxo de Sincronização

### Sincronização Automática

O sistema oferece sincronização automática em duas direções:

1. **Push (Local → Externa)**: Envia dados locais para a API externa
2. **Pull (Externa → Local)**: Busca dados da API externa para local
3. **Both**: Combina push e pull

### Status de Sincronização

- `pending`: Aguardando sincronização
- `synced`: Sincronizado com sucesso
- `error`: Erro na sincronização

### Tratamento de Conflitos

O sistema prioriza:
1. Dados mais recentes (baseado em `updated_at`)
2. Dados externos em caso de empate
3. Fallback para dados locais se API externa indisponível

## 🛡️ Segurança

### Autenticação

- Tokens JWT para autenticação
- Renovação automática de tokens
- Logout seguro

### Headers de Segurança

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'X-API-Version': '1.0',
  'User-Agent': 'AgentesDeConversao-Client/1.0'
}
```

## 📊 Monitoramento

### Métricas Disponíveis

- Status de saúde da API
- Taxa de sucesso de sincronização
- Tempo de resposta das requisições
- Erros por tipo
- Cache hit rate

### Logs

O sistema registra:
- Operações de sync bem-sucedidas
- Falhas de API com detalhes
- Tentativas de retry
- Mudanças de status de saúde

## 🔧 Desenvolvimento

### Estrutura dos Arquivos

```
lib/unified/
├── api-client.ts          # Cliente principal da API
├── sync-service.ts        # Serviço de sincronização
├── error-handler.ts       # Tratamento de erros
├── config.ts             # Configurações unificadas
├── auth-adapter.ts       # Adaptador de autenticação
├── fallback-service.ts   # Serviço de fallback
├── cache-service.ts      # Serviço de cache
├── dto/
│   └── agent.dto.ts      # DTOs e adaptadores de dados
└── __tests__/
    ├── api-client.test.ts
    ├── sync-service.test.ts
    ├── error-handler.test.ts
    └── integration.test.ts
```

### Adicionando Novos Endpoints

1. Adicione o método no `api-client.ts`
2. Implemente tratamento de erros adequado
3. Adicione testes unitários
4. Atualize a documentação

### Depuração

```typescript
// Habilitar logs detalhados
process.env.DEBUG_MODE = 'true'

// Verificar status da API
const health = await apiClient.checkHealth()

// Verificar configuração
import { unifiedConfig } from '@/lib/unified/config'
console.log('Config:', unifiedConfig)
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### API Externa Indisponível
- O sistema automaticamente usa fallback local
- Sincronização será retomada quando API voltar

#### Erro de Autenticação
- Verifique tokens de acesso
- Renove credenciais se necessário

#### Falhas de Sincronização
- Verifique logs para detalhes do erro
- Execute sincronização manual: `syncService.syncAgent(id)`

#### Testes Falhando
- Verifique variáveis de ambiente
- Confirme conectividade com APIs externas
- Execute `npm run test:api` para diagnóstico

### Logs Úteis

```bash
# Logs da aplicação
tail -f logs/app.log

# Logs de sync
grep "sync" logs/app.log

# Logs de erro
grep "ERROR" logs/app.log
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte os logs de erro
2. Execute o script de diagnóstico: `npm run test:api`
3. Verifique a documentação da API externa
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Janeiro 2025  
**Versão da API**: 1.0.0  
**Compatibilidade**: Next.js 15.x, TypeScript 5.x