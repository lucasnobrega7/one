# 🚀 PROMPT PARA PRÓXIMA SESSÃO - AGENTES DE CONVERSÃO

## 📋 CONTEXTO COMPLETO

**Projeto:** Agentes de Conversão  
**Localização:** `/Users/lucasrnobrega/Claude-outputs/Projetos/one/`  
**Status:** ✅ Produção ativa + OpenAI Light Theme implementado  
**Última sessão:** Implementação completa do OpenAI Light Theme + Footer

---

## 🎯 PROMPT EXATO PARA PRÓXIMA SESSÃO

```
Olá! Estou retornando ao projeto **Agentes de Conversão** localizado em `/Users/lucasrnobrega/Claude-outputs/Projetos/one/`.

**CONTEXTO DA SESSÃO ANTERIOR:**
Na última sessão, implementamos com sucesso a transformação completa para OpenAI Light Theme:
- ✅ Homepage redesignada no estilo OpenAI
- ✅ Dashboard atualizado para light theme  
- ✅ Auth pages (forgot-password, etc.) convertidas
- ✅ Docs pages estilo OpenAI
- ✅ About page redesignada
- ✅ Footer OpenAI template completo criado e integrado
- ✅ Sistema de cores CSS variables --openai-* implementado
- ✅ Tipografia Söhne + Inter configurada
- ✅ Logo component system responsivo
- ✅ Layout patterns OpenAI aplicados

**TAREFA ATUAL:**
Finalizar a transformação OpenAI Light Theme completando as páginas restantes que ainda podem estar usando tema escuro, especialmente:

1. **Admin pages** (app/admin/api-dashboard/, env-check/, config-check/, etc.)
2. **Research page** (app/research/page.tsx) - aplicar estilo OpenAI completo
3. **Safety page** (app/safety/page.tsx) - aplicar estilo OpenAI completo
4. **Error pages** (app/error/, app/unauthorized/, etc.)
5. **Outras páginas** que possam ter ficado com tema escuro

**DIRETRIZES IMPORTANTES:**
- Usar SEMPRE as MCPs disponíveis (mcp__desktop-commander, mcp__context7, mcp__figma-mcp)
- Manter consistência com o design OpenAI light theme já implementado
- Usar componente `<Logo>` em todas as páginas
- Aplicar classes `.sohne-heading` para títulos
- Usar CSS variables `--openai-*` para cores
- Implementar `.openai-card-light`, `.btn-openai-primary-light`
- Manter layout pattern `max-w-6xl mx-auto px-6 lg:px-8`
- Verificar e garantir que o Footer OpenAI apareça em todas as páginas

**ARQUIVOS DE REFERÊNCIA:**
- `CLAUDE.md` - Status atualizado do projeto
- `app/globals.css` - Sistema de cores e componentes OpenAI
- `components/ui/logo.tsx` - Sistema de logomarca
- `components/ui/footer.tsx` - Footer OpenAI
- `app/page.tsx` - Homepage como referência de design

Por favor, continue sistematicamente com a finalização da transformação OpenAI Light Theme em todas as páginas restantes do projeto.
```

---

## 🔧 COMANDO RÁPIDO DE DESENVOLVIMENTO

```bash
cd /Users/lucasrnobrega/Claude-outputs/Projetos/one && npm run dev
```

---

## 📚 MCPs DISPONÍVEIS E DOCUMENTAÇÕES

**MCPs Ativos:**
- `mcp__desktop-commander__*` - Comandos do sistema
- `mcp__context7__*` - Documentações e libraries
- `mcp__figma-mcp__*` - Design system integration

**Usar sempre que precisar de:**
- Documentação de libraries: mcp__context7__resolve-library-id + get-library-docs
- Manipulação de arquivos: mcp__desktop-commander__read_file, edit_block, write_file
- Pesquisas de código: mcp__desktop-commander__search_code, search_files

---

## 🎨 STATUS DO DESIGN SYSTEM

### ✅ Implementado
- Sistema de cores OpenAI CSS variables
- Tipografia Söhne + Inter
- Logo component responsivo
- Footer OpenAI template
- Componentes `.openai-card-light`, `.btn-openai-primary-light`
- Layout patterns OpenAI

### 🔄 Pendente
- Admin pages styling
- Research/Safety pages completas
- Error pages styling
- Verificação final de consistência

---

**🎯 Objetivo:** Finalizar 100% a transformação OpenAI Light Theme em todas as páginas restantes do projeto.