# Google OAuth Setup Guide

## Problema Resolvido Temporariamente
✅ O Google OAuth foi temporariamente desabilitado para evitar erros de "invalid_client"
✅ O site está funcionando apenas com login por credenciais

## Para Configurar Google OAuth Permanentemente:

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Crie ou Selecione um Projeto
- Se não tiver projeto: clique em "Criar Projeto"
- Nome sugerido: "Agentes de Conversão"

### 3. Ative a API do Google+
- Vá para "APIs & Services" > "Library"
- Procure por "Google+ API" e ative

### 4. Configure a Tela de Consentimento OAuth
- Vá para "APIs & Services" > "OAuth consent screen"
- Escolha "External" (para usuários externos)
- Preencha:
  - Nome do app: "Agentes de Conversão"
  - Email de suporte: seu-email@gmail.com
  - Domínios autorizados: agentesdeconversao.com.br
  - Email do desenvolvedor: seu-email@gmail.com

### 5. Crie as Credenciais OAuth
- Vá para "APIs & Services" > "Credentials"
- Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
- Tipo de aplicação: "Web application"
- Nome: "Agentes de Conversão Web"
- URIs de redirecionamento autorizados:
  - https://www.agentesdeconversao.com.br/api/auth/callback/google
  - http://localhost:3000/api/auth/callback/google (para desenvolvimento)

### 6. Copie as Credenciais
Após criar, você receberá:
- **Client ID**: algo como `123456789-abc123def456.apps.googleusercontent.com`
- **Client Secret**: algo como `GOCSPX-abc123def456ghi789`

### 7. Configure no Vercel
Execute este comando substituindo pelos valores reais:

```bash
echo "SEU_CLIENT_ID_REAL" | vercel env add GOOGLE_CLIENT_ID production --force
echo "SEU_CLIENT_SECRET_REAL" | vercel env add GOOGLE_CLIENT_SECRET production --force
```

### 8. Atualize o Código
Após configurar as credenciais reais, o Google OAuth será automaticamente reativado.

### 9. Teste
- Acesse https://www.agentesdeconversao.com.br/login
- O botão "Continue with Google" deve aparecer e funcionar

## Status Atual
- ✅ Site funcionando sem Google OAuth
- ✅ Login por credenciais ativo (admin@example.com / password)
- ⏳ Google OAuth aguardando credenciais válidas

## Fallback Temporário
Se não quiser configurar Google OAuth agora, o site continua funcionando perfeitamente apenas com login por credenciais.