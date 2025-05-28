# 🌐 Configuração de Domínios - Agentes de Conversão

## 📋 Problema Identificado

**Erro atual:** `https://one-2wow7l0ne-agentesdeconversao.vercel.app/signup`
**Causa:** Redirecionamento para subdomínio Vercel incorreto

## 🔧 Soluções Implementadas

### 1. **Vercel.json Atualizado**
```json
{
  "domains": [
    "agentesdeconversao.ai",
    "www.agentesdeconversao.ai", 
    "lp.agentesdeconversao.ai",
    "dash.agentesdeconversao.ai"
  ],
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://agentesdeconversao.ai/$1",
      "statusCode": 301,
      "has": [{"type": "host", "value": "(.+)\\.vercel\\.app"}]
    }
  ]
}
```

### 2. **Middleware Atualizado**
```typescript
// Redireciona URLs Vercel para domínio principal
if (hostname.includes('vercel.app')) {
  const url = new URL(request.url)
  url.hostname = 'agentesdeconversao.ai'
  return NextResponse.redirect(url, 301)
}
```

### 3. **Configuração DNS Necessária**

#### **Registrador de Domínio:**
```
CNAME   www             agentesdeconversao.ai
CNAME   lp              cname.vercel-dns.com
CNAME   dash            cname.vercel-dns.com
A       @               76.76.21.21 (Vercel IP)
```

#### **Vercel Dashboard:**
1. Acessar projeto no Vercel
2. Settings > Domains  
3. Adicionar domínios:
   - `agentesdeconversao.ai` (Primary)
   - `lp.agentesdeconversao.ai`
   - `dash.agentesdeconversao.ai`
   - `www.agentesdeconversao.ai` (Redirect to primary)

## 🎯 Estrutura de Domínios

### **Domínio Principal**
- `https://agentesdeconversao.ai` → Dashboard/App principal

### **Subdomínios**
- `https://lp.agentesdeconversao.ai` → Landing page  
- `https://dash.agentesdeconversao.ai` → Dashboard (alias)
- `https://api.agentesdeconversao.ai` → Backend API

### **Redirecionamentos**
- `www.agentesdeconversao.ai` → `agentesdeconversao.ai`
- `*.vercel.app` → `agentesdeconversao.ai`

## 🛠️ Como Testar

### **1. Verificar Redirecionamentos**
```bash
curl -I https://one-2wow7l0ne-agentesdeconversao.vercel.app/signup
# Deve retornar: Location: https://agentesdeconversao.ai/signup
```

### **2. Testar Landing Page**
```bash
curl -I https://lp.agentesdeconversao.ai/
# Deve retornar: 200 OK
```

### **3. Testar Botão Signup**
- Acesse: `https://lp.agentesdeconversao.ai`
- Clique: "Começar agora"  
- Destino: `https://agentesdeconversao.ai/auth/signup`

## 🚨 Ações Necessárias

### **Imediatas:**
1. ✅ Atualizar `vercel.json`
2. ✅ Atualizar `middleware.ts`  
3. 🔄 Deploy das mudanças
4. 🔄 Configurar domínios no Vercel Dashboard

### **Verificação DNS:**
1. 🔄 Verificar configuração DNS do registrador
2. 🔄 Aguardar propagação (até 48h)
3. 🔄 Testar todos os redirecionamentos

## 📝 Comandos de Deploy

```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "Fix domain redirects and routing"

# 2. Deploy no Vercel
vercel --prod

# 3. Verificar status
vercel domains
```

## 🎉 Resultado Esperado

Após as correções:
- ✅ `lp.agentesdeconversao.ai` → Funciona
- ✅ Botão "Começar agora" → `agentesdeconversao.ai/auth/signup`
- ✅ Sem mais redirecionamentos para `*.vercel.app`
- ✅ URLs limpas e profissionais

---

**Status:** 🔧 Implementado - Aguardando deploy e configuração DNS