#!/bin/bash

# Script de Limpeza Automática para o Projeto Agentes de Conversão
# Uso: ./cleanup.sh

echo "🧹 Iniciando limpeza do projeto..."

# Diretório de arquivo
ARCHIVE_DIR="_archive"

# Criar diretório de arquivo se não existir
if [ ! -d "$ARCHIVE_DIR" ]; then
    mkdir -p "$ARCHIVE_DIR"
    echo "✅ Diretório de arquivo criado: $ARCHIVE_DIR"
fi

# Criar timestamp para o arquivo
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CLEANUP_DIR="$ARCHIVE_DIR/cleanup_$TIMESTAMP"

# Função para arquivar arquivos
archive_files() {
    local pattern=$1
    local destination=$2
    local description=$3
    
    echo "📦 Arquivando $description..."
    
    # Criar diretório destino se não existir
    mkdir -p "$CLEANUP_DIR/$destination"
    
    # Encontrar e mover arquivos
    find . -name "$pattern" -type f ! -path "./$ARCHIVE_DIR/*" ! -path "./.git/*" ! -path "./node_modules/*" -exec mv {} "$CLEANUP_DIR/$destination/" \; 2>/dev/null
    
    local count=$(find "$CLEANUP_DIR/$destination" -type f | wc -l)
    if [ $count -gt 0 ]; then
        echo "  ✓ Movidos $count arquivos"
    fi
}

# Padrões de arquivos para limpeza
echo ""
echo "🔍 Procurando arquivos para limpeza..."

# Scripts de correção temporários
archive_files "fix-*.sh" "scripts-fixes" "scripts de correção temporários"
archive_files "fix-*.js" "scripts-fixes" "scripts de correção temporários JS"
archive_files "fix-*.ts" "scripts-fixes" "scripts de correção temporários TS"

# Scripts de teste obsoletos
archive_files "test-*.js" "scripts-tests" "scripts de teste JS"
archive_files "test-*.ts" "scripts-tests" "scripts de teste TS"

# Scripts de análise
archive_files "analyze-*.ts" "scripts-analysis" "scripts de análise"
archive_files "analyze-*.js" "scripts-analysis" "scripts de análise JS"

# Documentação de soluções temporárias
archive_files "*_FIX_*.md" "docs-fixes" "documentação de fixes"
archive_files "*_SOLUTION*.md" "docs-fixes" "documentação de soluções"

# Arquivos temporários
archive_files "*.tmp" "temp" "arquivos temporários"
archive_files "*.bak" "temp" "arquivos de backup"
archive_files "*.old" "temp" "arquivos antigos"

# Verificar se houve arquivos movidos
if [ -z "$(ls -A $CLEANUP_DIR 2>/dev/null)" ]; then
    echo ""
    echo "✨ Nenhum arquivo para limpar. Projeto já está organizado!"
    rmdir "$CLEANUP_DIR" 2>/dev/null
else
    # Criar relatório de limpeza
    echo ""
    echo "📄 Criando relatório de limpeza..."
    
    cat > "$CLEANUP_DIR/CLEANUP_REPORT.md" << EOF
# Relatório de Limpeza - $TIMESTAMP

## Resumo
Data: $(date)
Total de arquivos movidos: $(find "$CLEANUP_DIR" -type f ! -name "CLEANUP_REPORT.md" | wc -l)

## Arquivos Arquivados

EOF

    # Adicionar detalhes dos arquivos
    for dir in "$CLEANUP_DIR"/*; do
        if [ -d "$dir" ] && [ "$(basename $dir)" != "CLEANUP_REPORT.md" ]; then
            echo "### $(basename $dir)" >> "$CLEANUP_DIR/CLEANUP_REPORT.md"
            echo "" >> "$CLEANUP_DIR/CLEANUP_REPORT.md"
            ls -1 "$dir" | sed 's/^/- /' >> "$CLEANUP_DIR/CLEANUP_REPORT.md"
            echo "" >> "$CLEANUP_DIR/CLEANUP_REPORT.md"
        fi
    done
    
    echo "  ✓ Relatório criado: $CLEANUP_DIR/CLEANUP_REPORT.md"
    echo ""
    echo "✅ Limpeza concluída!"
    echo "📁 Arquivos movidos para: $CLEANUP_DIR"
fi

# Verificar diretórios vazios
echo ""
echo "🔍 Verificando diretórios vazios..."
EMPTY_DIRS=$(find . -type d -empty ! -path "./$ARCHIVE_DIR/*" ! -path "./.git/*" ! -path "./node_modules/*" 2>/dev/null)
if [ ! -z "$EMPTY_DIRS" ]; then
    echo "  ⚠️  Diretórios vazios encontrados:"
    echo "$EMPTY_DIRS" | sed 's/^/    /'
    echo ""
    echo "  💡 Use 'rmdir <diretório>' para removê-los se não forem mais necessários"
fi

echo ""
echo "🎯 Dica: Execute este script regularmente para manter o projeto organizado!"
