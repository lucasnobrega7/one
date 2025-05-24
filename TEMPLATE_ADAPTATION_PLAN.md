# Plano de Adaptação: Super SaaS Template → Agentes de Conversão

## Estrutura Template Original
```
super-saas-template/
├── apps/
│   ├── dashboard/          # Dashboard do usuário (porta 3001)
│   └── www/               # Landing page (porta 3000)
├── packages/
│   ├── ui/                # Componentes compartilhados
│   ├── utils/             # Utilitários
│   └── eslint/            # Configuração lint
├── turbo.json             # Configuração Turbo
└── package.json           # Root package
```

## Adaptação para Nosso Projeto

### 1. **Migração de Estrutura**
**De:** Estrutura monolítica Next.js
**Para:** Turbo repo multi-zone

```
one/ (renomeado para agentes-conversao)
├── apps/
│   ├── dashboard/         # Nossa interface atual → Dashboard
│   └── landing/           # Nova landing page
├── packages/
│   ├── ui/               # Nossos componentes UI
│   ├── database/         # Schemas Prisma + Supabase
│   ├── ai/               # LlamaIndex + Flowise
│   └── auth/             # NextAuth configuração
```

### 2. **Tecnologias Mantidas/Adaptadas**
- ✅ **Next.js 15** (como template)
- ✅ **Supabase** (já temos)
- ✅ **NextAuth** (substituir Update)
- ✅ **Prisma** (adicionar ao packages/database)
- ✅ **Tailwind + Shadcn** (já temos)
- ➕ **LlamaIndex** (novo package)
- ➕ **Flowise** (integração)

### 3. **Railway Deploy Adaptado**
**Template Config:**
```toml
# apps/dashboard/nixpacks.toml
[providers.node]
version = "18"

[phases.build]
cmds = ["pnpm install", "pnpm run build"]

[start]
cmd = "pnpm start"
```

**Nossa Adaptação:**
```toml
# Root nixpacks.toml para Turbo
[providers.node]
version = "18"

[phases.build]
cmds = ["pnpm install", "turbo run build"]

[start]
cmd = "turbo run start"
```