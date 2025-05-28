# 🚀 PROMPT PARA PRÓXIMA SESSÃO - AGENTES DE CONVERSÃO

**Status Atual:** 96% IMPLEMENTADO + PROJETO HIGIENIZADO  
**Próxima Prioridade:** Sistema de Pricing Otimizado (HIGH PRIORITY)

---

## 📋 **PROMPT EXATO PARA CONTINUAR**

```
Continue o projeto "Agentes de Conversão" localizado em /Users/lucasrnobrega/Claude-outputs/Projetos/one/.

CONTEXTO ATUAL:
- Status: 96% implementado, projeto higienizado e em produção
- Domínio: https://agentesdeconversao.ai (migração .ai completa)
- Stack: Next.js 15 + React 19 + Supabase + OpenRouter (87% margem)
- Deploy: Vercel (frontend) + Railway (backend API)

IMPLEMENTAÇÕES COMPLETAS:
✅ Flow Builder Enterprise (ReactFlow v12, custom nodes, properties panel)
✅ OpenRouter Integration (Smart AI Client, 300+ modelos, 85% economia)
✅ Migração Domínio .com.br → .ai (DNS, SSL, headers atualizados)  
✅ Layout OpenAI-Style (containers max-w-6xl, full-bleed backgrounds)
✅ Sistema de Autenticação (NextAuth v5 + Supabase + RBAC)
✅ Sistema de Onboarding (7 etapas, IA assistente, templates)
✅ Higienização Completa (configs legacy removidos, duplicações eliminadas)

TAREFA PRIORITÁRIA: 
Implementar o Sistema de Pricing Otimizado em lib/pricing/optimized-pricing.ts com:
- Lógica de billing com 87% margem de lucro
- Planos: R$39, R$149, R$399 (estrutura já definida)
- Integração Stripe + usage metering
- Dashboard de revenue tracking

Leia CLAUDE_CONTEXT_RESUMO_SESSAO.md para contexto detalhado e use as MCPs constantemente durante o desenvolvimento.
```

---

## 🎯 **DETALHAMENTO DA PRÓXIMA IMPLEMENTAÇÃO**

### **1. Sistema de Pricing Otimizado (HIGH PRIORITY)**

**Arquivo Principal:** `lib/pricing/optimized-pricing.ts`

**Features Necessárias:**
- ✅ Cálculo de margem 87% automático
- ✅ Plans structure: Starter (R$39), Pro (R$149), Enterprise (R$399)
- ✅ Usage metering (conversas, tokens, agentes)
- ✅ Billing cycles (mensal/anual com desconto)
- ✅ Stripe integration com webhooks
- ✅ Prorations e upgrades/downgrades
- ✅ Invoice generation automática

**Estrutura de Dados:**
```typescript
interface PricingPlan {
  id: string
  name: string
  price: number
  limits: {
    conversations: number
    agents: number
    tokens: number
  }
  features: string[]
  stripe_price_id: string
}

interface UsageMetrics {
  conversations_count: number
  tokens_used: number
  agents_created: number
  current_cycle_start: Date
  current_cycle_end: Date
}
```

**Componentes UI Necessários:**
- `components/pricing/pricing-plans.tsx` (atualizar existente)
- `components/pricing/usage-meter.tsx` (novo)
- `components/pricing/billing-history.tsx` (novo)
- `app/dashboard/billing/page.tsx` (novo)

### **2. Dashboard Analytics Avançado (MEDIUM PRIORITY)**

**Localização:** `app/dashboard/analytics/`

**Features Necessárias:**
- Revenue dashboard com charts
- Conversion rate tracking
- ROI calculator
- Real-time metrics
- Export functionality

### **3. Testing Suite (MEDIUM PRIORITY)**

**Estrutura:**
- Jest para unit tests
- Cypress para E2E tests
- Testing coverage mínimo: 80%

---

## 🔧 **INSTRUÇÕES TÉCNICAS ESPECÍFICAS**

### **Variáveis de Ambiente Adicionais Necessárias:**
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_***
STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***

# Pricing
PRICING_MARGIN_PERCENTAGE=87
OPENROUTER_COST_PER_1K_TOKENS=0.0002
```

### **Integrações Críticas:**
1. **Supabase Tables:** Adicionar tabelas de billing, subscriptions, usage
2. **Stripe Webhooks:** Configurar endpoints para subscription events
3. **OpenRouter Billing:** Implementar tracking de custos reais
4. **Usage Metering:** Sistema de contadores em tempo real

### **Arquivos de Referência:**
- `lib/ai/smart-ai-client.ts` - Para tracking de tokens
- `components/features/onboarding/pricing-plans.tsx` - Base existente
- `lib/unified/api-client.ts` - Para usage API calls
- `lib/supabase/client.ts` - Database operations

---

## 📚 **MCPs A USAR CONSTANTEMENTE**

### **Context7 MCP:**
```bash
# Documentação Stripe
/stripe/stripe-js

# Documentação Next.js
/vercel/next.js

# Documentação Supabase
/supabase/supabase
```

### **Desktop Commander:**
- Gerenciamento de arquivos
- Execução de comandos
- Testing e builds

### **Figma MCP (se necessário):**
- Design system components
- UI mockups

---

## ⚡ **WORKFLOW SUGERIDO**

### **Sprint 1: Pricing Engine (45 min)**
1. Criar `lib/pricing/optimized-pricing.ts`
2. Implementar cálculos de margem
3. Configurar plans structure
4. Adicionar usage metering

### **Sprint 2: Stripe Integration (30 min)**
1. Setup Stripe SDK
2. Criar webhooks endpoints
3. Implementar subscription logic
4. Testes de payment flow

### **Sprint 3: UI Components (30 min)**
1. Billing dashboard page
2. Usage meter component
3. Pricing plans atualizado
4. Billing history

### **Sprint 4: Testing & Polish (15 min)**
1. Unit tests do pricing engine
2. E2E tests do billing flow
3. Performance optimization
4. Documentation update

---

## 🎯 **OBJETIVOS DE SUCESSO**

### **Técnicos:**
- [ ] Sistema de pricing com 87% margem implementado
- [ ] Stripe integration 100% funcional
- [ ] Usage metering em tempo real
- [ ] Dashboard de revenue tracking
- [ ] Tests coverage > 80%

### **Business:**
- [ ] Margem de lucro de 87% garantida
- [ ] Billing automático funcionando
- [ ] Escalabilidade para 1000+ usuários
- [ ] Revenue tracking preciso
- [ ] Customer experience otimizada

---

## 🚨 **COMANDOS ESSENCIAIS PARA COMEÇAR**

```bash
# Navegar para o projeto
cd /Users/lucasrnobrega/Claude-outputs/Projetos/one

# Verificar status atual
npm run build
npm run lint
npm run typecheck

# Iniciar desenvolvimento
npm run dev

# Teste do pricing system
curl http://localhost:3000/api/pricing/calculate
```

---

**🎯 RESUMO:** Implementar Sistema de Pricing Otimizado (lib/pricing/optimized-pricing.ts) como próxima prioridade alta, usando MCPs constantemente e mantendo margem de 87% de lucro.

**Ready to implement! 🚀**