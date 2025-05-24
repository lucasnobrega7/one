# 🚨 STATUS CRÍTICO DA MIGRAÇÃO - TURBO REPO

## ⚠️ ATENÇÃO: MIGRAÇÃO EM ANDAMENTO
**NÃO FAZER DEPLOY ATÉ COMPLETAR A REESTRUTURAÇÃO**

## ✅ Progresso Atual (70% concluído)

### Estrutura Criada:
```
one/
├── apps/                    ✅ CRIADO
│   ├── dashboard/          ✅ CRIADO (package.json, next.config.js)
│   └── landing/            ✅ CRIADO (package.json, next.config.js)
├── packages/               ✅ CRIADO
│   ├── ui/                 ✅ CRIADO (package.json)
│   ├── utils/              ✅ CRIADO (package.json, src/cn.ts, src/index.ts)
│   ├── database/           ✅ CRIADO (package.json)
│   ├── auth/               ✅ CRIADO (package.json)
│   └── ai/                 ✅ CRIADO (package.json)
├── turbo.json              ✅ CRIADO
├── pnpm-workspace.yaml     ✅ CRIADO
└── package.json            ✅ MODIFICADO (scripts turbo)
```

### Arquivos Originais Preservados:
- ✅ `/app/*` (toda aplicação atual)
- ✅ `/components/*` (todos componentes)
- ✅ `/lib/*` (todas bibliotecas)
- ✅ `/config/*` (todas configurações)
- ✅ `.env.local` (variáveis de ambiente)
- ✅ `supabase/` (schemas e migrações)
- ✅ `prisma/` (schemas)

## 🔄 Próximos Passos OBRIGATÓRIOS:

### 1. Migrar Aplicação Current → Dashboard
```bash
# Mover todo conteúdo atual para apps/dashboard/
mv app/ apps/dashboard/
mv components/ apps/dashboard/
mv lib/ apps/dashboard/
mv config/ apps/dashboard/
mv middleware.ts apps/dashboard/
```

### 2. Configurar Packages Compartilhados
- Migrar `/components/ui/*` → `packages/ui/src/`
- Migrar `/lib/utils.ts` → `packages/utils/src/`
- Migrar `/config/auth.ts` → `packages/auth/src/`
- Migrar schemas → `packages/database/src/`

### 3. Criar Landing Page Simples
- Página inicial em `apps/landing/`
- Rewrite para `/dashboard` → dashboard app

### 4. Configurar Railway para Turbo
- Nixpacks.toml para turbo build
- Multi-service deploy (landing + dashboard)

## 🚨 RISCOS IDENTIFICADOS:

### Alto Risco:
- **Import paths**: Todos `@/` precisam virar `@repo/*`
- **Next.js config**: basePath `/dashboard` pode quebrar rotas
- **Railway deploy**: Turbo precisa configuração específica
- **Dependencies**: Duplicação entre root e apps

### Solução Segura:
1. **BACKUP**: Copiar projeto atual antes de continuar
2. **Incremental**: Migrar um package por vez
3. **Test local**: Garantir dev funcionando antes deploy

## 📋 CHECKLIST PRÉ-DEPLOY:

- [ ] Backup completo do projeto atual
- [ ] Migração de arquivos concluída
- [ ] Imports @/ → @repo/* atualizados
- [ ] `pnpm install` funcionando
- [ ] `pnpm dev` funcionando (ambas apps)
- [ ] Build local funcionando
- [ ] Railway nixpacks.toml configurado
- [ ] Deploy teste em branch separada