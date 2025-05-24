# 🚀 Railway Frontend Deploy - Configuração Manual

## Informações do Projeto

- **Project ID:** `fcda25f6-a7e8-4746-bf1e-2d7aa7091137`
- **Environment:** `c86f5190-5ce9-4198-82da-1d8999e646d3` (Em atividade)
- **Repositório:** `lucasnobrega7/one`
- **Branch:** `clean-deploy`

## Passos para Configuração Manual

### 1. Acessar Railway Dashboard
```
https://railway.app/project/fcda25f6-a7e8-4746-bf1e-2d7aa7091137
```

### 2. Adicionar Novo Serviço
- Clique em "Add Service" 
- Selecione "GitHub Repo"
- Escolha repositório: `lucasnobrega7/one`
- Branch: `clean-deploy`

### 3. Configurações do Serviço
- **Nome:** Frontend - Agentes de Conversão
- **Framework:** Detectado automaticamente (Next.js)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Port:** 3000

### 4. Variáveis de Ambiente
Copiar do Vercel ou configurar:
```
NEXT_PUBLIC_SUPABASE_URL=https://faccixlabriqwxkxqprw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=efa3c79722b0aa1870d03ede89d7a33424ac937b...
NEXTAUTH_URL=[Railway URL gerada]
```

### 5. Deploy
- O deploy iniciará automaticamente após configuração
- Acompanhar logs de build

## Arquivos de Configuração Presentes
- ✅ `nixpacks.toml` - Configuração Nixpacks
- ✅ `railway.toml` - Configuração Railway  
- ✅ `package.json` - Scripts npm
- ✅ `next.config.js` - Configuração Next.js

## Status Esperado
- Build: ~2-3 minutos
- Deploy: Sucesso com 55 páginas estáticas
- URL: `https://[service-name].up.railway.app`