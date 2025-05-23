#!/bin/bash
# fix-vercel-deploy.sh

echo "🔧 Fixing Vercel deployment..."

# 1. Limpar cache e locks
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -rf .pnpm-store
rm -f yarn.lock

# 2. Reinstalar com npm
npm install --legacy-peer-deps

# 3. Criar/atualizar vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["gru1"],
  "functions": {
    "app/api/auth/[...nextauth]/route.ts": {
      "maxDuration": 30
    }
  }
}
EOF

# 4. Garantir .npmrc existe
cat > .npmrc << 'EOF'
legacy-peer-deps=true
fund=false
audit=false
EOF

# 5. Commit mudanças
git add package-lock.json vercel.json .npmrc
git commit -m "fix: configure npm for vercel deployment"
git push

echo "✅ Deploy fix aplicado!"