# 🔒 Tutorial: Configurar SSL no cPanel para api.agentesdeconversao.ai

> **Baseado na documentação oficial**: [cPanel SSL/TLS Documentation](https://docs.cpanel.net/cpanel/security/ssl-tls/#install-and-manage-ssl-for-your-site-https)

## 📋 PRÉ-REQUISITOS

- ✅ Acesso ao cPanel do domínio agentesdeconversao.ai
- ✅ Subdomínio `api.agentesdeconversao.ai` criado
- ✅ DNS CNAME configurado (já feito)
- ⚠️ **Railway projeto ativo** (precisa ser corrigido)

## 🛠️ MÉTODO 1: SSL AUTOMÁTICO (RECOMENDADO)

### Passo 1: Acessar SSL/TLS no cPanel
1. **Login no cPanel** da hospedagem
2. **Procure por**: "SSL/TLS" na seção Segurança
3. **Clique em**: "SSL/TLS"

### Passo 2: AutoSSL (Let's Encrypt)
1. **Vá em**: "AutoSSL"
2. **Verifique se está ativado** para o domínio
3. **Adicione o subdomínio**: `api.agentesdeconversao.ai`
4. **Aguarde**: Provisão automática (5-15 min)

## 🔧 MÉTODO 2: INSTALAÇÃO MANUAL

### Passo 1: Obter Certificado SSL

#### Opção A: Let's Encrypt (Gratuito)
```bash
# Se tiver acesso via SSH
certbot certonly --standalone -d api.agentesdeconversao.ai
```

#### Opção B: Certificado Comercial
- Comprar de CA confiável (Comodo, DigiCert, etc.)
- Gerar CSR no cPanel

### Passo 2: Instalação Manual no cPanel
1. **Acesse**: SSL/TLS → Manage SSL sites
2. **Selecione**: `api.agentesdeconversao.ai` no dropdown
3. **Preencha os campos**:
   - **Certificate (CRT)**: Cole o certificado
   - **Private Key (KEY)**: Cole a chave privada
   - **Certificate Authority Bundle**: Cole o bundle (se houver)
4. **Clique em**: "Install Certificate"## 📝 EXEMPLO DE CONFIGURAÇÃO

### Estrutura dos Arquivos SSL:
```
# Certificate (CRT)
-----BEGIN CERTIFICATE-----
[Seu certificado aqui]
-----END CERTIFICATE-----

# Private Key (KEY)
-----BEGIN PRIVATE KEY-----
[Sua chave privada aqui]
-----END PRIVATE KEY-----

# CA Bundle (opcional)
-----BEGIN CERTIFICATE-----
[Certificado intermediário]
-----END CERTIFICATE-----
```

## ⚡ CONFIGURAÇÃO ESPECÍFICA PARA API

### 1. Configurar Subdomínio
- **Subdomínio**: api
- **Domínio**: agentesdeconversao.ai
- **Document Root**: `/public_html/api` (se necessário)

### 2. Redirecionamento HTTPS
```apache
# .htaccess para forçar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 3. Proxy para Railway (se necessário)
```apache
# Proxy para Railway backend
RewriteEngine On
RewriteRule ^(.*)$ https://s2pgzru5.up.railway.app/$1 [P,L]
```

## 🔍 VERIFICAÇÃO PÓS-INSTALAÇÃO

### Comandos de Teste:
```bash
# Teste 1: Verificar certificado SSL
openssl s_client -connect api.agentesdeconversao.ai:443 -servername api.agentesdeconversao.ai

# Teste 2: Teste HTTP vs HTTPS
curl -I http://api.agentesdeconversao.ai
curl -I https://api.agentesdeconversao.ai

# Teste 3: Verificar chain do certificado
curl -vI https://api.agentesdeconversao.ai 2>&1 | grep -i certificate
```## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "Invalid host header"
**Causa**: SSL não configurado ou domínio não reconhecido
**Solução**: 
1. Verificar se certificado SSL está ativo
2. Aguardar propagação DNS (até 24h)
3. Limpar cache do navegador

### Problema 2: "Application not found" (Railway)
**Causa**: Backend Railway não está ativo
**Solução**:
```bash
cd backend
railway login
railway up
```

### Problema 3: Certificado SSL expirado
**Solução**: 
- **AutoSSL**: Renovação automática
- **Manual**: Renovar certificado manualmente

## 🚨 IMPORTANTE: DUAS SOLUÇÕES PARALELAS

### OPÇÃO A: SSL no cPanel (Tradicional)
- ✅ **Configure SSL no cPanel** seguindo este tutorial
- ✅ **Faça proxy para Railway** via .htaccess
- ⏱️ **Tempo**: 30-60 minutos

### OPÇÃO B: SSL no Railway (Moderno) - RECOMENDADO
- ✅ **Configure domínio customizado no Railway**
- ✅ **SSL automático via Railway**
- ⏱️ **Tempo**: 5-10 minutos

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] SSL certificado instalado
- [ ] HTTPS funcionando
- [ ] Redirecionamento HTTP → HTTPS
- [ ] API respondendo em HTTPS
- [ ] Railway backend ativo
- [ ] Logs do Railway sem erros

## 🔗 PRÓXIMOS PASSOS

1. **Escolher método**: cPanel SSL ou Railway SSL
2. **Configurar certificado**
3. **Testar HTTPS**: `curl https://api.agentesdeconversao.ai/`
4. **Verificar logs**: Railway dashboard
5. **Testar API**: Endpoints funcionais

---

**💡 RECOMENDAÇÃO**: Use o Railway SSL (Opção B) por ser mais simples e moderno!