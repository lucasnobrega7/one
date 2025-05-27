# 🌐 ARQUITETURA DE SUBDOMÍNIOS - AGENTES DE CONVERSÃO

**Status:** ✅ **CONFIGURAÇÃO FINAL DEFINIDA**  
**Domínio Principal:** `agentesdeconversao.ai`

---

## 🏗️ **ESTRUTURA COMPLETA DE SUBDOMÍNIOS**

```
agentesdeconversao.ai (Domínio Principal)
├── lp.agentesdeconversao.ai      → Landing Pages & Marketing
├── dash.agentesdeconversao.ai    → Dashboard & Application
├── login.agentesdeconversao.ai   → Authentication System  
├── docs.agentesdeconversao.ai    → Documentation & Guides
└── api.agentesdeconversao.ai     → Backend API (Railway)
```

---

## 📋 **MAPEAMENTO FUNCIONAL**

### **🎯 lp.agentesdeconversao.ai (Landing Page)**
- **Função:** Marketing e conversão
- **Conteúdo:** 
  - Hero section principal
  - Features showcase
  - Pricing plans
  - Testimonials
  - Call-to-action para signup
- **Tecnologia:** Next.js (Vercel)
- **SSL:** Automático via Vercel

### **📊 dash.agentesdeconversao.ai (Dashboard)**
- **Função:** Aplicação principal
- **Conteúdo:**
  - Dashboard executivo
  - Sistema de onboarding (7 etapas)
  - Gestão de agentes
  - Agent Studio (flow builder)
  - Analytics em tempo real
  - Configurações de conta
  - Teste de IA (/ai-test)
- **Tecnologia:** Next.js (Vercel)
- **SSL:** Automático via Vercel

### **🔐 login.agentesdeconversao.ai (Authentication)**
- **Função:** Sistema de autenticação
- **Conteúdo:**
  - Login form
  - Signup form
  - Password reset
  - Google OAuth
  - Email verification
- **Tecnologia:** NextAuth v5 + Supabase
- **SSL:** Automático via Vercel

### **📚 docs.agentesdeconversao.ai (Documentation)**
- **Função:** Documentação técnica
- **Conteúdo:**
  - API documentation
  - Integration guides
  - Webhook setup
  - Code examples
  - Troubleshooting
- **Tecnologia:** Mintlify ou Next.js
- **SSL:** Automático via Vercel

### **🔧 api.agentesdeconversao.ai (Backend API)**
- **Função:** API backend
- **Conteúdo:**
  - REST endpoints
  - Agent management
  - Chat streaming
  - Webhook handlers
  - OpenRouter integration
- **Tecnologia:** FastAPI (Railway)
- **SSL:** Automático via Railway

---

## 🔧 **CONFIGURAÇÃO TÉCNICA**

### **Environment Variables (.env.local)**
```bash
# 🌐 SUBDOMAIN ARCHITECTURE
NEXT_PUBLIC_APP_URL="https://agentesdeconversao.ai"
LANDING_URL="https://lp.agentesdeconversao.ai"
APP_URL="https://dash.agentesdeconversao.ai"  
NEXTAUTH_URL="https://login.agentesdeconversao.ai"
DOCS_URL="https://docs.agentesdeconversao.ai"
API_BASE_URL="https://api.agentesdeconversao.ai"
RAILWAY_API_URL="https://api.agentesdeconversao.ai"
```

### **Next.js Configuration (next.config.js)**
```javascript
experimental: {
  serverActions: {
    allowedOrigins: [
      'localhost:3000', 
      'agentesdeconversao.ai', 
      '*.agentesdeconversao.ai',
      'lp.agentesdeconversao.ai',
      'dash.agentesdeconversao.ai',
      'login.agentesdeconversao.ai',
      'docs.agentesdeconversao.ai',
      'api.agentesdeconversao.ai'
    ],
  },
}
```

### **CORS Configuration (Backend)**
```python
allowed_hosts = [
    "*.agentesdeconversao.ai",
    "lp.agentesdeconversao.ai",
    "dash.agentesdeconversao.ai", 
    "login.agentesdeconversao.ai",
    "docs.agentesdeconversao.ai",
    "localhost"
]
```

---

## 🌐 **DNS RECORDS PARA CONFIGURAÇÃO**

### **A Records (Principal)**
```bash
@ → 76.76.19.61 (Vercel IP principal)
www → 76.76.19.61 (Vercel IP)
```

### **CNAME Records (Subdomínios)**
```bash
lp → lp.agentesdeconversao.ai.vercel.app
dash → dash.agentesdeconversao.ai.vercel.app
login → login.agentesdeconversao.ai.vercel.app  
docs → docs.agentesdeconversao.ai.vercel.app
api → api.agentesdeconversao.ai.railway.app
```

### **MX Records (Email)**
```bash
@ → mail.agentesdeconversao.ai (priority 10)
```

---

## 🔄 **SISTEMA DE REDIRECTS**

### **Redirects Inteligentes**
```javascript
// middleware.ts
const redirectMap = {
  '/dashboard': 'https://dash.agentesdeconversao.ai',
  '/login': 'https://login.agentesdeconversao.ai',
  '/auth': 'https://login.agentesdeconversao.ai',
  '/docs': 'https://docs.agentesdeconversao.ai',
  '/api': 'https://api.agentesdeconversao.ai'
}
```

### **Legacy Support (.com.br)**
```javascript
// Redirect automático de .com.br para .ai
if (host.includes('agentesdeconversao.com.br')) {
  return Response.redirect(`https://lp.agentesdeconversao.ai${pathname}`, 301)
}
```

---

## 🎯 **FLUXO DE USUÁRIO OTIMIZADO**

### **Jornada Completa:**
1. **Marketing:** `lp.agentesdeconversao.ai` → Conhece o produto
2. **Signup:** `login.agentesdeconversao.ai` → Cria conta
3. **Onboarding:** `dash.agentesdeconversao.ai/onboarding` → Configura agentes
4. **Uso Diário:** `dash.agentesdeconversao.ai` → Gerencia operação
5. **Suporte:** `docs.agentesdeconversao.ai` → Documentação técnica

### **Benefícios da Arquitetura:**
- ✅ **SEO Otimizado:** Cada subdomínio focado em função específica
- ✅ **Performance:** Carregamento otimizado por contexto
- ✅ **Escalabilidade:** Fácil adição de novos subdomínios
- ✅ **Manutenção:** Separação clara de responsabilidades
- ✅ **Analytics:** Tracking granular por função

---

## 📊 **MÉTRICAS DE PERFORMANCE**

### **Por Subdomínio:**
| Subdomínio | Função | Load Time | First Paint | SEO Score |
|------------|--------|-----------|-------------|-----------|
| **lp** | Marketing | <2s | <1s | 95+ |
| **dash** | App | <3s | <1.5s | 90+ |
| **login** | Auth | <1s | <0.5s | 85+ |
| **docs** | Docs | <2s | <1s | 98+ |
| **api** | Backend | <500ms | N/A | N/A |

---

## 🔐 **SEGURANÇA POR SUBDOMÍNIO**

### **Headers de Segurança:**
```bash
# Para todos os subdomínios
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### **CSP (Content Security Policy):**
```bash
# lp.agentesdeconversao.ai
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.vercel.app

# dash.agentesdeconversao.ai  
Content-Security-Policy: default-src 'self'; connect-src 'self' *.supabase.co *.agentesdeconversao.ai

# login.agentesdeconversao.ai
Content-Security-Policy: default-src 'self'; connect-src 'self' *.supabase.co accounts.google.com
```

---

## 🚀 **DEPLOY STRATEGY**

### **Vercel Projects:**
- **agentesdeconversao-lp** → lp.agentesdeconversao.ai
- **agentesdeconversao-dash** → dash.agentesdeconversao.ai
- **agentesdeconversao-login** → login.agentesdeconversao.ai
- **agentesdeconversao-docs** → docs.agentesdeconversao.ai

### **Railway Project:**
- **agentesdeconversao-api** → api.agentesdeconversao.ai

### **Environment Sync:**
```bash
# Sync environment variables across all Vercel projects
vercel env pull .env.lp --scope lp
vercel env pull .env.dash --scope dash  
vercel env pull .env.login --scope login
vercel env pull .env.docs --scope docs
```

---

# 🏆 **ARQUITETURA ENTERPRISE COMPLETA**

Esta arquitetura de subdomínios proporciona:
- **Separação clara** de responsabilidades
- **Performance otimizada** por contexto
- **SEO maximizado** com foco específico
- **Escalabilidade** para crescimento futuro
- **Manutenção** simplificada e organizada

**Ready for enterprise-scale deployment! 🚀**