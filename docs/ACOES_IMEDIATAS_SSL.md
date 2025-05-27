# ⚡ AÇÕES IMEDIATAS: Corrigir API SSL

## 🎯 PROBLEMA IDENTIFICADO
- ❌ Backend Railway não está ativo (404 error)
- ❌ SSL não configurado para api.agentesdeconversao.ai
- ✅ DNS CNAME já configurado corretamente

## 🛠️ SOLUÇÃO RECOMENDADA: Railway SSL (Mais Rápido)

### PASSO 1: Ativar Backend Railway
```bash
cd /Users/lucasrnobrega/Claude-outputs/Projetos/one/backend
railway login
railway link -p fcda25f6-a7e8-4746-bf1e-2d7aa7091137
railway up
```

### PASSO 2: Configurar SSL no Railway Dashboard
1. **Acesse**: https://railway.app/project/fcda25f6-a7e8-4746-bf1e-2d7aa7091137
2. **Vá em**: Settings → Networking → Custom Domain
3. **Clique**: "Add Custom Domain"
4. **Digite**: `api.agentesdeconversao.ai`
5. **Aguarde**: SSL automático (5-10 min)

### PASSO 3: Verificar Funcionamento
```bash
# Testar API
curl https://api.agentesdeconversao.ai/
```

## 🔄 SOLUÇÃO ALTERNATIVA: cPanel SSL

### SE o Railway não funcionar:
1. **Login no cPanel** da hospedagem
2. **SSL/TLS** → **AutoSSL**
3. **Adicionar**: `api.agentesdeconversao.ai`
4. **Configurar proxy** para Railway via .htaccess

## ⏱️ TEMPO ESTIMADO
- **Railway SSL**: 10-15 minutos
- **cPanel SSL**: 30-60 minutos

## 🚨 AÇÃO IMEDIATA RECOMENDADA
**Começar com Railway SSL** (mais simples e rápido)

---

**Tutorial completo**: `docs/tutorial-ssl-cpanel.md`