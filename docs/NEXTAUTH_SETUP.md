# NextAuth Setup - Agentes de Conversão

Este documento descreve a configuração do NextAuth no projeto Agentes de Conversão, substituindo o Clerk como sistema de autenticação.

## Configuração Realizada

### 1. Remoção do Clerk
- Removidas todas as dependências do Clerk (`@clerk/nextjs`, `@clerk/themes`)
- Removidos arquivos específicos do Clerk:
  - `/src/lib/auth/clerk-config.ts`
  - `/src/lib/auth/clerk-multi-domain.tsx`
  - `/src/lib/clerk-client.ts`
  - `/src/app/api/webhooks/clerk`

### 2. Instalação do NextAuth
- NextAuth configurado com:
  - Provider de credenciais (email/senha)
  - Provider Google OAuth
  - Integração com Supabase para armazenamento de usuários

### 3. Arquivos Principais

#### `/src/lib/auth.ts`
Configuração principal do NextAuth com:
- Providers: Google e Credentials
- Callbacks para JWT e Session
- Integração com Supabase para autenticação

#### `/src/app/api/auth/[...nextauth]/route.ts`
Route handler do NextAuth para processar requisições de autenticação

#### `/middleware.ts`
Middleware atualizado para usar `getToken` do NextAuth ao invés do Clerk

#### `/src/app/layout.tsx`
Layout principal atualizado para usar `SessionProvider` ao invés do `ClerkProvider`

### 4. Páginas de Autenticação

#### `/src/app/login/page.tsx`
Página de login com:
- Login por email/senha
- Login com Google
- Integração com NextAuth `signIn`

#### `/src/app/signup/page.tsx`
Página de cadastro com:
- Formulário de criação de conta
- Hash de senha com bcrypt
- Criação automática de organização
- Auto-login após cadastro

### 5. Componentes Atualizados

#### `/src/components/user-profile.tsx`
Componente de perfil atualizado para usar `useSession` do NextAuth

#### `/src/components/dashboard-header.tsx`
Header do dashboard com menu de usuário usando dados da sessão NextAuth

#### `/src/hooks/use-current-user.ts`
Hook customizado atualizado para buscar dados do usuário via NextAuth

### 6. Contexto de Autenticação

#### `/src/contexts/AuthContext.tsx`
Contexto atualizado para trabalhar com NextAuth, mantendo compatibilidade com o resto da aplicação

## Variáveis de Ambiente

Adicione as seguintes variáveis ao seu `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## Estrutura do Banco de Dados

O schema do banco foi atualizado para suportar NextAuth:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50) DEFAULT 'credentials',
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE
);
```

## Fluxo de Autenticação

1. **Login com Credenciais**:
   - Usuário fornece email/senha
   - Senha verificada contra hash no banco
   - JWT gerado com dados do usuário

2. **Login com Google**:
   - OAuth flow padrão
   - Usuário criado automaticamente se não existir
   - Organização padrão criada para novos usuários

3. **Proteção de Rotas**:
   - Middleware verifica token JWT
   - Rotas protegidas redirecionam para login
   - APIs retornam 401 se não autenticado

## Próximos Passos

1. Testar fluxo completo de autenticação
2. Implementar recuperação de senha
3. Adicionar mais providers OAuth se necessário
4. Configurar email transacional para verificação

## Comandos Úteis

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```