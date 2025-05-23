# Directory Restructuring Plan - Project 'One'

## 🎯 Current Issues
- Configuration files duplicated (next.config.js/mjs, tailwind.config.js/ts)
- lib/utils overlap with /utils directory
- 9 documentation files scattered in root
- Inconsistent component organization
- Mixed configuration and script files in root

## 📁 Proposed New Structure

```
/one
├── 📁 .github/                    # GitHub workflows & templates
├── 📁 .next/                      # Next.js build (auto-generated)
├── 📁 .vercel/                    # Vercel config (auto-generated)
├── 📁 app/                        # Next.js 13+ App Router
│   ├── 📁 (auth)/                 # Route groups
│   ├── 📁 api/                    # API routes
│   ├── 📁 dashboard/              # Dashboard pages
│   ├── 📁 docs/                   # Documentation pages
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── 📁 components/                 # React components
│   ├── 📁 ui/                     # Shadcn/ui components
│   ├── 📁 forms/                  # Form components
│   ├── 📁 layout/                 # Layout components
│   ├── 📁 features/               # Feature-specific components
│   │   ├── 📁 auth/               # Auth components
│   │   ├── 📁 dashboard/          # Dashboard components
│   │   ├── 📁 admin/              # Admin components
│   │   └── 📁 chat/               # Chat components
│   └── 📁 common/                 # Shared components
├── 📁 lib/                        # Core utilities & configurations
│   ├── 📁 auth/                   # Authentication logic
│   ├── 📁 database/               # Database utilities
│   │   ├── 📁 supabase/           # Supabase client & utils
│   │   └── schema.ts              # Database schema types
│   ├── 📁 api/                    # API clients & utilities
│   ├── 📁 ai/                     # AI providers & utilities
│   ├── 📁 integrations/           # External integrations
│   │   ├── 📁 zapi/               # WhatsApp Z-API
│   │   ├── 📁 clerk/              # Clerk auth
│   │   └── 📁 openai/             # OpenAI integration
│   ├── 📁 utils/                  # Core utility functions
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 constants/              # App constants
│   ├── 📁 types/                  # TypeScript type definitions
│   └── 📁 validations/            # Zod schemas & validations
├── 📁 config/                     # Configuration files
│   ├── auth.ts                    # NextAuth configuration
│   ├── database.ts                # Database configuration
│   ├── integrations.ts            # Third-party integrations config
│   └── app.ts                     # App-wide configuration
├── 📁 public/                     # Static assets
├── 📁 docs/                       # Project documentation
│   ├── 📁 api/                    # API documentation
│   ├── 📁 deployment/             # Deployment guides
│   ├── 📁 development/            # Development guides
│   ├── README.md                  # Main documentation
│   ├── ENVIRONMENT_SETUP.md       # Environment setup
│   ├── GOOGLE_OAUTH_SETUP.md      # OAuth setup
│   └── INTEGRATION_STATUS.md      # Integration status
├── 📁 scripts/                    # Build & deployment scripts
│   ├── 📁 deployment/             # Deployment scripts
│   ├── 📁 database/               # Database scripts
│   └── 📁 development/            # Development scripts
├── 📁 styles/                     # Global styles & themes
├── 📁 __tests__/                  # Test files
│   ├── 📁 components/             # Component tests
│   ├── 📁 lib/                    # Library tests
│   └── 📁 api/                    # API tests
├── 📄 .env.example                # Environment template
├── 📄 .gitignore                  # Git ignore rules
├── 📄 next.config.js              # Next.js configuration (single file)
├── 📄 tailwind.config.ts          # Tailwind configuration (TypeScript)
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 package.json                # Dependencies & scripts
└── 📄 README.md                   # Project overview
```

## 🔄 Migration Plan

### Phase 1: Clean Root Directory
1. Move documentation files to `/docs/`
2. Move scripts to `/scripts/deployment/`
3. Remove duplicate config files
4. Consolidate environment files

### Phase 2: Reorganize Components
1. Create feature-based component structure
2. Move shared components to `/components/common/`
3. Organize UI components in `/components/ui/`

### Phase 3: Restructure Library
1. Merge `/utils/` into `/lib/utils/`
2. Create feature-based lib organization
3. Move authentication logic to `/config/auth.ts`

### Phase 4: Update Imports
1. Update all import paths
2. Update TypeScript path mapping
3. Test all functionality

## ✅ Benefits of New Structure

1. **Clear Separation**: Features, utilities, and configs clearly separated
2. **Scalability**: Easy to add new features and integrations
3. **Maintainability**: Logical grouping reduces cognitive load
4. **Standards**: Follows Next.js 13+ and React best practices
5. **Clean Root**: Only essential configuration files in root
6. **Documentation**: Organized docs with clear structure

## 🛠 Implementation Commands

```bash
# Phase 1: Root cleanup
mkdir -p docs/deployment docs/development docs/api
mv AGENTS.md ENVIRONMENT_SETUP.md GOOGLE_OAUTH_SETUP.md docs/
mv deploy-*.sh setup-*.sh scripts/deployment/
rm next.config.mjs tailwind.config.js

# Phase 2: Component restructure  
mkdir -p components/features/auth components/features/dashboard
mkdir -p components/forms components/common
mv components/auth/* components/features/auth/
mv components/dashboard/* components/features/dashboard/

# Phase 3: Library consolidation
mkdir -p lib/database/supabase lib/integrations/zapi
mv utils/* lib/utils/
mv lib/supabase/* lib/database/supabase/
mv auth.ts config/auth.ts

# Phase 4: Update configs
# Update tsconfig.json paths
# Update import statements
```

## 🎯 Expected Outcome

- **50% reduction** in root directory files
- **Clear feature separation** for better development experience  
- **Improved maintainability** with logical grouping
- **Better onboarding** for new developers
- **Enhanced scalability** for future features