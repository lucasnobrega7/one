# 📋 TODO DETALHADO - AGENTES DE CONVERSÃO
### Baseado em Revisão Técnica Completa (Supabase, Railway, NextAuth, Next.js)

## 🔴 **CRÍTICO - BLOQUEIOS DE DEPLOY**

### **1. CONFIGURAÇÃO SUPABASE**
- [ ] **Corrigir Row Level Security (RLS)**
  ```sql
  -- ❌ PROBLEMA: Política muito permissiva
  create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);
  
  -- ✅ CORREÇÃO: RLS específico por usuário
  create policy "Users can view own profile."
  on profiles for select using ((select auth.uid()) = id);
  ```

- [ ] **Implementar schemas corretos**
  ```sql
  -- Consolidar em um único schema baseado em Supabase docs
  -- Usar complete-schema-v2.sql como base
  -- Remover esquemas duplicados/conflitantes
  ```

- [ ] **Configurar triggers automáticos**
  ```sql
  -- Trigger para updated_at
  create or replace function update_updated_at()
  returns trigger language plpgsql as $$
  begin
    new.updated_at := now();
    return new;
  end;
  $$;
  ```

- [ ] **Definir políticas de storage**
  ```sql
  -- Para avatars bucket
  create policy "Avatar images are publicly accessible."
  on storage.objects for select using (bucket_id = 'avatars');
  ```

### **2. CONFIGURAÇÃO RAILWAY**
- [ ] **Configurar variáveis Railway específicas**
  ```bash
  # Adicionar no Railway
  RAILWAY_STATIC_URL # Para URLs dinâmicas
  DATABASE_URL=${{Postgres.DATABASE_URL}} # Referência interna
  ```

- [ ] **Otimizar nixpacks.toml**
  ```toml
  [providers.node]
  version = "18"
  
  [phases.setup]
  nixPkgs = ["nodejs", "npm"]
  
  [phases.install]
  cmds = ["npm ci"]
  
  [phases.build]
  cmds = ["npm run build"]
  
  [start]
  cmd = "npm start -- --port $PORT"
  ```

- [ ] **Configurar bind correto**
  ```javascript
  // next.config.js - adicionar
  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
  ```

### **3. CONFIGURAÇÃO NEXTAUTH V5**
- [ ] **Corrigir configuração auth.ts**
  ```typescript
  // ❌ PROBLEMA: Configuração incompleta
  export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [/* providers */],
    // Faltando callbacks essenciais
  })
  
  // ✅ CORREÇÃO: Configuração completa
  export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [/* providers */],
    callbacks: {
      authorized: async ({ auth }) => !!auth,
      jwt({ token, user }) {
        if (user) token.id = user.id;
        return token;
      },
      session({ session, token }) {
        session.user.id = token.id;
        return session;
      },
    },
    pages: {
      signIn: "/login",
      error: "/auth/error"
    }
  })
  ```

- [ ] **Corrigir middleware.ts**
  ```typescript
  // Usar padrão NextAuth v5
  export { auth as middleware } from "@/auth"
  
  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  }
  ```

- [ ] **Configurar tipos TypeScript**
  ```typescript
  // types/next-auth.d.ts
  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        role: string;
      } & DefaultSession["user"]
    }
  }
  ```

## 🟡 **IMPORTANTE - QUALIDADE & SEGURANÇA**

### **4. LIMPEZA DE ESTRUTURA**
- [ ] **Remover arquivos não utilizados**
  ```bash
  # Remover estrutura Turbo não utilizada
  rm -rf apps/ packages/ turbo.json pnpm-workspace.yaml
  
  # Consolidar documentação
  mkdir docs/archive/
  mv *.md docs/archive/ # Exceto README.md
  ```

- [ ] **Otimizar package.json**
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build", 
      "start": "next start",
      "lint": "next lint",
      "type-check": "tsc --noEmit"
    },
    // Remover: "prettier", "turbo" não utilizados
  }
  ```

### **5. CONFIGURAÇÕES DE SEGURANÇA**
- [ ] **Headers de segurança no next.config.js**
  ```javascript
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=()' }
        ]
      }
    ]
  }
  ```

- [ ] **Rate limiting middleware**
  ```typescript
  // middleware/rate-limit.ts
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";
  
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
  });
  ```

- [ ] **CORS configuração**
  ```javascript
  // next.config.js
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.ALLOWED_ORIGINS },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
        ],
      },
    ];
  },
  ```

### **6. VALIDAÇÃO DE DADOS**
- [ ] **Adicionar Zod schemas**
  ```typescript
  // lib/schemas.ts
  import { z } from 'zod';
  
  export const AgentSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    // ... outros campos
  });
  
  export const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
  });
  ```

- [ ] **Implementar validação nas API routes**
  ```typescript
  // app/api/agents/route.ts
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const validatedData = AgentSchema.parse(body);
      // ... resto da lógica
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
    }
  }
  ```

## 🟢 **MELHORIAS - PERFORMANCE & UX**

### **7. OTIMIZAÇÕES NEXT.JS**
- [ ] **Configurar images optimization**
  ```javascript
  // next.config.js
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  ```

- [ ] **Bundle analysis**
  ```json
  // package.json
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build": "next build"
  }
  ```

### **8. TESTES E QUALIDADE**
- [ ] **Configurar Jest + Testing Library**
  ```javascript
  // jest.config.js - atualizar para Next.js 14
  const nextJest = require('next/jest');
  
  const createJestConfig = nextJest({
    dir: './',
  });
  ```

- [ ] **Testes para componentes críticos**
  ```typescript
  // __tests__/components/auth/auth-check.test.tsx
  // __tests__/lib/unified/api-client.test.ts
  // __tests__/app/api/agents/route.test.ts
  ```

### **9. MONITORAMENTO E LOGS**
- [ ] **Configurar Sentry**
  ```typescript
  // sentry.client.config.ts
  import * as Sentry from "@sentry/nextjs";
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // ... configurações
  });
  ```

- [ ] **Logs estruturados**
  ```typescript
  // lib/logger.ts
  import pino from 'pino';
  
  export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
  });
  ```

## 📋 **CHECKLIST PRÉ-DEPLOY**

### **Deploy Preparation:**
- [ ] ✅ **Build local funcionando** (`npm run build`)
- [ ] ⚠️ **Testes passando** (`npm test`)
- [ ] ⚠️ **Lint sem erros** (`npm run lint`)
- [ ] ⚠️ **Type check sem erros** (`npm run type-check`)
- [ ] ❌ **Headers de segurança configurados**
- [ ] ❌ **Rate limiting implementado**
- [ ] ✅ **Variáveis de ambiente configuradas**
- [ ] ❌ **RLS policies corretas**
- [ ] ❌ **Schemas SQL consolidados**

### **Railway Specific:**
- [ ] ✅ **nixpacks.toml configurado**
- [ ] ✅ **PORT binding correto**
- [ ] ✅ **Variáveis Railway específicas**
- [ ] ❌ **Health check endpoint**
- [ ] ❌ **Graceful shutdown**

### **Production Ready:**
- [ ] ❌ **Error boundaries implementadas**
- [ ] ❌ **Loading states em todas as páginas**
- [ ] ❌ **SEO meta tags configuradas**
- [ ] ❌ **Analytics implementado**
- [ ] ❌ **Backup strategy definida**

## 🎯 **PRIORIZAÇÃO**

### **Semana 1 (Deploy MVP):**
1. Corrigir configurações Supabase (RLS, schemas)
2. Finalizar configuração Railway (nixpacks, variáveis)
3. Corrigir NextAuth v5 (auth.ts, middleware)
4. Implementar headers de segurança básicos
5. **DEPLOY em produção**

### **Semana 2 (Qualidade):**
1. Implementar validação com Zod
2. Adicionar rate limiting
3. Configurar monitoramento (Sentry)
4. Implementar testes críticos
5. Otimizações de performance

### **Semana 3 (Escala):**
1. Analytics e métricas
2. SEO completo
3. Error boundaries
4. Backup e disaster recovery
5. Documentation completa

---

**STATUS ATUAL: 75% pronto para MVP deploy**
**TEMPO ESTIMADO PARA PRODUÇÃO: 1 semana de correções críticas**