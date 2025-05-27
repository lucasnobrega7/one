#!/bin/bash

# Script para remover imports NextAuth e substituir por Supabase Auth

echo "🔧 Removendo imports NextAuth e substituindo por Supabase Auth..."

# Find all TypeScript/React files with next-auth imports
files=$(find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next | xargs grep -l "next-auth" 2>/dev/null || true)

for file in $files; do
    echo "📝 Processando: $file"
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Remove next-auth imports
    sed -i '' '/import.*next-auth/d' "$file"
    
    # Replace useSession with Supabase equivalent (placeholder)
    sed -i '' 's/useSession/\/\/ TODO: Replace with Supabase auth/g' "$file"
    
    # Replace signIn with Supabase equivalent
    sed -i '' 's/signIn/\/\/ TODO: Replace with supabase.auth.signInWithPassword/g' "$file"
    
    # Replace signOut with Supabase equivalent  
    sed -i '' 's/signOut/\/\/ TODO: Replace with supabase.auth.signOut/g' "$file"
    
    echo "✅ Processado: $file"
done

echo "🎉 Concluído! Backups criados com extensão .bak"