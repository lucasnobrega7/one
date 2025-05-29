// scripts/check-claude-memory.js
// Script para verificar dados do Claude Memory sem usar console

function extractClaudeMemory() {
  const data = [];
  
  // Busca todas as chaves do Claude Memory
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('claude-memory-')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          data.push({
            date: key.replace('claude-memory-', ''),
            sessions: JSON.parse(value)
          });
        }
      } catch (e) {
        // Ignora erros
      }
    }
  }
  
  // Cria elemento temporário para download
  if (data.length > 0) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-memory-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Alerta discreto
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:10px 20px;border-radius:5px;z-index:9999';
    div.textContent = `Exportado: ${data.length} dia(s) de dados`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  } else {
    // Nenhum dado encontrado
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:10px 20px;border-radius:5px;z-index:9999';
    div.textContent = 'Nenhum dado do Claude Memory encontrado';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
}

// Para usar: cole no console e execute
// extractClaudeMemory();

// Ou crie um bookmarklet:
// javascript:(function(){/* código aqui */})();
