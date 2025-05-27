# 🔒 Configuração SSL para api.agentesdeconversao.ai

## ❌ PROBLEMA IDENTIFICADO
O domínio `api.agentesdeconversao.ai` não tem certificado SSL configurado no Railway, causando:
- ✅ DNS configurado corretamente (CNAME apontando para Railway)
- ❌ Railway retornando "Invalid host header" 
- ❌ Certificado SSL não configurado

## 🛠️ SOLUÇÃO PASSO A PASSO

### 1. Acessar Railway Dashboard
```
https://railway.app/project/fcda25f6-a7e8-4746-bf1e-2d7aa7091137
```

### 2. Configurar Custom Domain
1. **Navegue para**: Settings → Networking → Custom Domain
2. **Clique em**: "Add Custom Domain"
3. **Digite**: `api.agentesdeconversao.ai`
4. **Clique em**: "Add Domain"

### 3. Aguardar Provisão SSL
- ⏳ Railway vai automaticamente:
  - Verificar a configuração DNS
  - Provisionar certificado SSL via Let's Encrypt
  - Configurar o roteamento

### 4. Verificar Configuração
```bash
# Testar após configuração SSL
curl -I https://api.agentesdeconversao.ai
# Deve retornar status 200 ou resposta da API
```

## 🔧 CONFIGURAÇÃO ALTERNATIVA (Se necessário)

### Verificar DNS atual:
```bash
# O CNAME já está correto:
dig CNAME api.agentesdeconversao.ai
# Resultado: api.agentesdeconversao.ai. CNAME s2pgzru5.up.railway.app.
```

### Verificar backend Railway:
```bash
cd backend
railway link -p fcda25f6-a7e8-4746-bf1e-2d7aa7091137
railway logs --service api
```

## ⚡ AÇÃO IMEDIATA NECESSÁRIA

**Você precisa fazer no Railway Dashboard:**

1. **Login**: https://railway.app
2. **Acesse o projeto**: Agentes de Conversão
3. **Vá em**: Settings → Networking
4. **Adicione**: api.agentesdeconversao.ai como Custom Domain
5. **Aguarde**: Provisão automática do SSL (5-10 min)

## 🔍 VERIFICAÇÃO APÓS CONFIGURAÇÃO

```bash
# Teste 1: SSL Certificate
openssl s_client -connect api.agentesdeconversao.ai:443 -servername api.agentesdeconversao.ai

# Teste 2: API Response
curl https://api.agentesdeconversao.ai/

# Teste 3: API Health
curl https://api.agentesdeconversao.ai/api/health
```

## 📋 STATUS ATUAL
- ✅ DNS CNAME configurado
- ✅ Railway app funcionando em s2pgzru5.up.railway.app
- ❌ **SSL Certificate não configurado** ← PROBLEMA PRINCIPAL
- ❌ Custom domain não adicionado no Railway

---

**⚠️ IMPORTANTE**: Após adicionar o domínio customizado no Railway, aguarde 5-10 minutos para a propagação do SSL.