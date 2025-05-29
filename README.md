# Agentes de Conversão 🤖

Uma plataforma empresarial completa para criação e gerenciamento de agentes conversacionais inteligentes, otimizada para máxima conversão e integração com múltiplos canais.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/agentesdeconversao/one)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Python FastAPI + Supabase
- **Database**: PostgreSQL + pgvector (via Supabase)
- **Autenticação**: Supabase Auth
- **IA/LLM**: OpenRouter API (300+ modelos com economia de 85% vs OpenAI)
- **Deploy**: Vercel (frontend) + Railway (backend)

## 🏗️ Estrutura do Projeto

```
one/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Área administrativa
│   │   ├── agents/         # Gerenciamento de agentes
│   │   ├── agentstudio/    # Flow builder visual (AgentStudio)
│   │   ├── analytics/      # Dashboard de análise
│   │   └── ...
│   ├── api/                # API Routes Next.js
│   └── auth/               # Páginas de autenticação
├── components/              # Componentes React
├── lib/                    # Utilitários e configurações
├── backend/                # API FastAPI Python
├── prisma/                 # Schema do banco de dados
├── supabase/              # Configurações Supabase
└── _archive/              # Arquivos arquivados (ignorado pelo git)
```

## 🌐 Arquitetura de Domínios

- `agentesdeconversao.ai` - Domínio principal
- `lp.agentesdeconversao.ai` - Landing page
- `dash.agentesdeconversao.ai` - Dashboard administrativo
- `docs.agentesdeconversao.ai` - Documentação
- `login.agentesdeconversao.ai` - Sistema de autenticação
- `api.agentesdeconversao.ai` - API v2.0

## 🎯 Funcionalidades Principais

### AgentStudio
- Flow builder visual drag-and-drop
- Integração com 300+ modelos via OpenRouter
- Componentes pré-configurados para conversação
- Sistema de nós e conexões estilo Flowise/n8n

### Dashboard
- Gerenciamento completo de agentes
- Analytics em tempo real
- Bases de conhecimento com pgvector
- Sistema de permissões granular

### Integrações
- WhatsApp Business API
- Telegram
- Instagram Direct
- Facebook Messenger
- Webchat embeddable

## 🛠️ Configuração Local

1. **Clone o repositório**
```bash
git clone https://github.com/lucasnobrega7/one.git
cd one
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🧹 Manutenção

Para manter o projeto organizado, execute periodicamente:

```bash
./scripts/cleanup.sh
```

Este script arquivará automaticamente:
- Scripts de correção temporários
- Arquivos de teste obsoletos
- Documentação de problemas resolvidos
- Arquivos temporários e backups

## 📚 Documentação

- [Documentação Completa](https://docs.agentesdeconversao.ai)
- [API Reference](https://api.agentesdeconversao.ai/docs)
- [Guia de Contribuição](./docs/CONTRIBUTING.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [guia de contribuição](./docs/CONTRIBUTING.md) antes de enviar PRs.

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

**Agentes de Conversão** - Transformando conversas em conversões 🚀
