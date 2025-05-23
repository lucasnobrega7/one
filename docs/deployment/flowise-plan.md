# 🔗 FLOWISE INTEGRATION PLAN - PROJETO 'ONE'

**Status**: Flowise já deployado em Railway  
**Repositório**: https://github.com/lucasnobrega7/Flowise2  
**Objetivo**: Integração + Customização + White-label  

## 📋 TAREFAS DE INTEGRAÇÃO

### **1. 🎨 CUSTOMIZAÇÃO FLOWISE (6-8 horas)**

#### **Frontend React (ui/)**
```javascript
// ui/src/assets/
- Substituir logo Flowise → Logo "Agentes de Conversão"
- Atualizar favicon → Ícone da marca

// ui/src/styles/ ou ui/src/themes/
- Cores primárias: #46B2E0 → #8A53D2 → #E056A0
- Background: #0e0e10 (surface.base)
- Cards: #1a1a1d (surface.raised)
- Border: #27272a (surface.stroke)

// ui/src/components/
- Navbar: Título "Agentes de Conversão"
- Footer: Remover links Flowise
- Login page: Branding customizado
- Dashboard: Textos em PT-BR
```

#### **Textos PT-BR**
```javascript
// ui/src/locales/pt-BR.json (criar se não existir)
{
  "welcome": "Bem-vindo aos Agentes de Conversão",
  "create_flow": "Criar Fluxo",
  "chatbots": "Agentes",
  "knowledge_base": "Base de Conhecimento",
  "settings": "Configurações"
}
```

### **2. 🔗 INTEGRAÇÃO COM PROJETO 'ONE' (4-6 horas)**

#### **API Connection**
```typescript
// projeto-one/lib/flowise-client.ts
export class FlowiseClient {
  private baseUrl = process.env.FLOWISE_URL
  
  async createChatflow(data: ChatflowData) {
    return fetch(`${this.baseUrl}/api/v1/chatflows`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.FLOWISE_API_KEY}` },
      body: JSON.stringify(data)
    })
  }
  
  async executeFlow(flowId: string, message: string) {
    return fetch(`${this.baseUrl}/api/v1/prediction/${flowId}`, {
      method: 'POST',
      body: JSON.stringify({ question: message })
    })
  }
}
```

#### **Environment Variables**
```bash
# projeto-one/.env.local
FLOWISE_URL=https://your-railway-flowise.up.railway.app
FLOWISE_API_KEY=your-api-key
FLOWISE_WEBHOOK_SECRET=your-webhook-secret
```

#### **API Routes Integration**
```typescript
// projeto-one/app/api/agents/[id]/execute/route.ts
import { FlowiseClient } from '@/lib/flowise-client'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { message } = await req.json()
  const flowise = new FlowiseClient()
  
  // Buscar agente no banco
  const agent = await supabase.from('agents').select().eq('id', params.id).single()
  
  // Executar no Flowise
  const response = await flowise.executeFlow(agent.flowise_flow_id, message)
  
  return NextResponse.json(response)
}
```

### **3. ⚙️ N8N DEPLOY (2-3 horas)**

#### **Railway Template Deploy**
```bash
# Usar template N8N Railway
https://railway.app/template/n8n

# Environment variables
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password
```

#### **Integration Workflow**
```json
// N8N Workflow: Flowise → WhatsApp
{
  "nodes": [
    {
      "name": "Flowise Webhook",
      "type": "webhook", 
      "url": "/webhook/flowise"
    },
    {
      "name": "Process Message",
      "type": "function"
    },
    {
      "name": "Send WhatsApp",
      "type": "http-request",
      "url": "https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text"
    }
  ]
}
```

### **4. 🧪 TESTES END-TO-END (2-3 horas)**

#### **Fluxo de Teste**
1. **Criar agente** no projeto 'one'
2. **Criar fluxo** no Flowise customizado  
3. **Conectar** agente → fluxo
4. **Testar chat** via projeto 'one'
5. **Verificar** automação N8N
6. **Testar** WhatsApp integration

#### **Checklist de Validação**
- [ ] Logo "Agentes de Conversão" aparece no Flowise
- [ ] Cores da marca aplicadas
- [ ] Textos em PT-BR funcionando
- [ ] API integration projeto 'one' → Flowise
- [ ] Chat funcional end-to-end
- [ ] N8N automação ativa
- [ ] WhatsApp integration operacional

## 🚀 CRONOGRAMA DE EXECUÇÃO

### **Dia 1 (6-8 horas)**
- **Manhã**: Customização visual Flowise
- **Tarde**: Integração API projeto 'one'

### **Dia 2 (4-6 horas)**  
- **Manhã**: Deploy N8N + configuração
- **Tarde**: Testes end-to-end + validação

## 📈 RESULTADO ESPERADO

**Stack Completo Funcionando**:
```
projeto-one.railway.app (Dashboard ✅)
    ↓ API calls
flowise-customizado.railway.app (Editor Visual ✅)
    ↓ webhooks  
n8n.railway.app (Automation ✅)
    ↓ integrations
WhatsApp Z-API (Messaging ✅)
```

**SAAS 100% FUNCIONAL** em 1-2 dias! 🎯

---
**🤖 Next Actions**: Iniciar customização Flowise UI  
**📍 Priority**: High - caminho crítico para finalização  
**⏱️ ETA**: 1-2 dias para stack completo