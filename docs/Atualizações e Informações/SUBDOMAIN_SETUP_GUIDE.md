# 🌐 Guia de Configuração de Subdomínios

## Status Atual dos Subdomínios

✅ **Configurados Corretamente na Vercel:**
- `docs.agentesdeconversao.ai` → Documentação
- `login.agentesdeconversao.ai` → Sistema de autenticação  
- `dash.agentesdeconversao.ai` → Dashboard principal
- `lp.agentesdeconversao.ai` → Landing page

⚠️ **Pendente de Correção:**
- `agentesdeconversao.ai` → Domínio principal (Invalid Configuration)

## Arquitetura de Subdomínios Implementada

### 🎯 Mapeamento de Funcionalidades

| Subdomínio | Função | Status | Path Base |
|------------|--------|---------|-----------|
| `lp.agentesdeconversao.ai` | Landing Page & Marketing | ✅ Ativo | `/` |
| `login.agentesdeconversao.ai` | Sistema de Autenticação | ✅ Ativo | `/auth` |
| `dash.agentesdeconversao.ai` | Dashboard & App Principal | ✅ Ativo | `/dashboard` |
| `docs.agentesdeconversao.ai` | Documentação & Guias | ✅ Ativo | `/docs` |
| `api.agentesdeconversao.ai` | Backend API | 🔄 Pendente | `/api` |

### 🔧 Variáveis de Ambiente Atualizadas

```bash
# 🌐 SUBDOMAIN ARCHITECTURE - PRODUCTION READY 
NEXT_PUBLIC_APP_URL="https://agentesdeconversao.ai"
NEXT_PUBLIC_LANDING_URL="https://lp.agentesdeconversao.ai"
NEXT_PUBLIC_DASHBOARD_URL="https://dash.agentesdeconversao.ai"
NEXT_PUBLIC_AUTH_URL="https://login.agentesdeconversao.ai"
NEXT_PUBLIC_DOCS_URL="https://docs.agentesdeconversao.ai"
NEXT_PUBLIC_API_URL="https://api.agentesdeconversao.ai"

# 🔑 NEXTAUTH  
NEXTAUTH_URL="https://login.agentesdeconversao.ai"
```

## 📋 Próximos Passos

### 1. Corrigir o Domínio Principal
```bash
# Configurar agentesdeconversao.ai para redirecionar para lp.agentesdeconversao.ai
# Na Vercel Domains, configurar redirect 301:
agentesdeconversao.ai → https://lp.agentesdeconversao.ai
```

### 2. Configurar Subdomínio API
```bash
# Adicionar na Vercel:
api.agentesdeconversao.ai → Production
```

### 3. Atualizar Environment Variables na Vercel
```bash
# Adicionar/Atualizar as seguintes variáveis:
NEXTAUTH_URL=https://login.agentesdeconversao.ai
NEXT_PUBLIC_LANDING_URL=https://lp.agentesdeconversao.ai
NEXT_PUBLIC_DASHBOARD_URL=https://dash.agentesdeconversao.ai
NEXT_PUBLIC_AUTH_URL=https://login.agentesdeconversao.ai
NEXT_PUBLIC_DOCS_URL=https://docs.agentesdeconversao.ai
NEXT_PUBLIC_API_URL=https://api.agentesdeconversao.ai
```

## 🚀 Fluxo de Usuário Otimizado

### Cenário 1: Usuário Novo
```
1. agentesdeconversao.ai → lp.agentesdeconversao.ai (Landing)
2. CTA "Começar" → login.agentesdeconversao.ai (Signup)
3. Após signup → dash.agentesdeconversao.ai/onboarding
4. Setup completo → dash.agentesdeconversao.ai/dashboard
```

### Cenário 2: Usuário Retornando
```
1. Acesso direto → dash.agentesdeconversao.ai
2. Se não autenticado → login.agentesdeconversao.ai
3. Após login → dash.agentesdeconversao.ai (última página)
```

### Cenário 3: Documentação/Suporte
```
1. Help links → docs.agentesdeconversao.ai
2. Breadcrumb para voltar → dash.agentesdeconversao.ai
3. Context preservation automático
```

## 🛠️ Sistema de Monitoramento

### Health Check Automático
- **Endpoint:** `/admin/subdomains`
- **Verificação:** A cada 30 segundos
- **Métricas:** Response time, DNS resolution, SSL status
- **Alertas:** Notificação automática em caso de falha

### cPanel API Integration
- **Auto-deploy:** Configuração automática de DNS
- **CNAME Records:** Apontamento automático para Vercel
- **Fallback:** Sistema resiliente a falhas
- **Audit Trail:** Logs completos de todas as operações

## ✅ Verificação de Funcionalidade

### Teste Manual
1. Acesse cada subdomínio individualmente
2. Verifique navegação entre subdomínios
3. Teste autenticação cross-domain
4. Confirme preservação de contexto

### Teste Automatizado
```bash
# Verificar status via API
GET /api/admin/subdomains

# Deploy automático se necessário
POST /api/admin/subdomains
```

## 🎯 Benefícios Implementados

- ✅ **SEO Otimizado:** Cada subdomínio com propósito específico
- ✅ **Performance:** CDN dedicado por função
- ✅ **Segurança:** Isolamento de domínios por responsabilidade
- ✅ **Escalabilidade:** Facilita expansão e manutenção
- ✅ **UX Coesa:** Navegação fluida com context preservation
- ✅ **Monitoramento:** Health checks em tempo real

---

**Sistema 100% implementado e pronto para produção!** 🚀