#!/bin/bash

# Script para Renomear Pastas do Projeto
# Torna os nomes mais intuitivos em português

echo "🔄 Iniciando renomeação de pastas..."

# Criar mapa de renomeação
declare -A RENAME_MAP=(
    ["components"]="componentes"
    ["hooks"]="ganchos"
    ["contexts"]="contextos"
    ["lib"]="bibliotecas"
    ["scripts"]="automacao"
    ["docs"]="documentacao"
    ["types"]="tipos"
    ["styles"]="estilos"
    ["middleware"]="interceptadores"
    ["config"]="configuracoes"
    ["backend"]="servidor"
    ["tests"]="testes"
)

# Função para atualizar imports
update_imports() {
    local old_name=$1
    local new_name=$2
    
    echo "  📝 Atualizando imports de '$old_name' para '$new_name'..."
    
    # Atualizar em arquivos TypeScript/JavaScript
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "./node_modules/*" \
        -not -path "./.next/*" \
        -not -path "./_archive/*" \
        -exec sed -i '' "s|@/$old_name/|@/$new_name/|g" {} \;
    
    # Atualizar imports relativos
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "./node_modules/*" \
        -not -path "./.next/*" \
        -not -path "./_archive/*" \
        -exec sed -i '' "s|\.\./$old_name/|../$new_name/|g" {} \;
        
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "./node_modules/*" \
        -not -path "./.next/*" \
        -not -path "./_archive/*" \
        -exec sed -i '' "s|\./$old_name/|./$new_name/|g" {} \;
}

# Renomear pastas
for old_name in "${!RENAME_MAP[@]}"; do
    new_name=${RENAME_MAP[$old_name]}
    
    if [ -d "$old_name" ]; then
        echo "📁 Renomeando '$old_name' → '$new_name'"
        mv "$old_name" "$new_name"
        update_imports "$old_name" "$new_name"
    fi
done

# Atualizar tsconfig.json
echo "⚙️  Atualizando tsconfig.json..."
sed -i '' 's|"@/components/\*"|"@/componentes/*"|g' tsconfig.json
sed -i '' 's|"@/lib/\*"|"@/bibliotecas/*"|g' tsconfig.json
sed -i '' 's|"@/hooks/\*"|"@/ganchos/*"|g' tsconfig.json
sed -i '' 's|"@/types/\*"|"@/tipos/*"|g' tsconfig.json
sed -i '' 's|"@/config/\*"|"@/configuracoes/*"|g' tsconfig.json
sed -i '' 's|"@/docs/\*"|"@/documentacao/*"|g' tsconfig.json

sed -i '' 's|"./components/\*"|"./componentes/*"|g' tsconfig.json
sed -i '' 's|"./lib/\*"|"./bibliotecas/*"|g' tsconfig.json
sed -i '' 's|"./hooks/\*"|"./ganchos/*"|g' tsconfig.json
sed -i '' 's|"./types/\*"|"./tipos/*"|g' tsconfig.json
sed -i '' 's|"./config/\*"|"./configuracoes/*"|g' tsconfig.json
sed -i '' 's|"./docs/\*"|"./documentacao/*"|g' tsconfig.json

# Atualizar jest.config.js
echo "🧪 Atualizando jest.config.js..."
sed -i '' 's|/components/|/componentes/|g' jest.config.js
sed -i '' 's|/lib/|/bibliotecas/|g' jest.config.js
sed -i '' 's|/hooks/|/ganchos/|g' jest.config.js
sed -i '' 's|/contexts/|/contextos/|g' jest.config.js

# Atualizar tailwind.config.ts
echo "🎨 Atualizando tailwind.config.ts..."
sed -i '' 's|"./components/|"./componentes/|g' tailwind.config.ts
sed -i '' 's|"./lib/|"./bibliotecas/|g' tailwind.config.ts
sed -i '' 's|"./hooks/|"./ganchos/|g' tailwind.config.ts
sed -i '' 's|"./config/|"./configuracoes/|g' tailwind.config.ts
sed -i '' 's|"./types/|"./tipos/|g' tailwind.config.ts

# Atualizar components.json (shadcn/ui)
echo "🎯 Atualizando components.json..."
sed -i '' 's|"@/components"|"@/componentes"|g' components.json
sed -i '' 's|"@/lib"|"@/bibliotecas"|g' components.json
sed -i '' 's|"@/hooks"|"@/ganchos"|g' components.json
sed -i '' 's|"@/components/ui"|"@/componentes/ui"|g' components.json

echo ""
echo "✅ Renomeação concluída!"
echo ""
echo "📋 Pastas renomeadas:"
for old_name in "${!RENAME_MAP[@]}"; do
    new_name=${RENAME_MAP[$old_name]}
    if [ -d "$new_name" ]; then
        echo "   $old_name → $new_name ✓"
    fi
done

echo ""
echo "⚠️  IMPORTANTE:"
echo "1. Execute 'npm run dev' para verificar se tudo está funcionando"
echo "2. Revise os imports manualmente se houver erros"
echo "3. Faça commit das mudanças após verificar"
