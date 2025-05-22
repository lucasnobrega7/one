#!/usr/bin/env node

/**
 * Script para reestruturar o projeto conforme a nova estrutura de diretórios
 * Este script cria a nova estrutura e move os arquivos existentes para os novos locais
 */

import fs from "fs"
import path from "path"

// Diretórios a serem criados
const directories = [
  // App Router
  "app/(auth)",
  "app/(dashboard)/agents",
  "app/(dashboard)/conversations",
  "app/(dashboard)/knowledge",
  "app/(dashboard)/settings",
  "app/api/admin",
  "app/api/agents",
  "app/api/chat",
  "app/api/conversations",
  "app/api/knowledge",
  "app/api/user",
  "app/onboarding",

  // Componentes
  "components/auth",
  "components/chat",
  "components/core",
  "components/forms",

  // Configuração e contextos
  "config",
  "constants",
  "contexts",

  // Bibliotecas e utilitários
  "lib/ai/adapters",
  "lib/ai/providers",
  "lib/auth",
  "lib/cache",
  "lib/db",
  "lib/supabase",

  // Estilos e tipos
  "styles",
  "types",
]

// Criar diretórios
console.log("Criando nova estrutura de diretórios...")
directories.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`✅ Criado: ${dir}`)
  } else {
    console.log(`⚠️ Já existe: ${dir}`)
  }
})

// Mapeamento de arquivos a serem movidos (origem -> destino)
const fileMappings = [
  // Arquivos de autenticação
  { from: "app/auth/login/page.tsx", to: "app/(auth)/login/page.tsx" },
  { from: "app/auth/signup/page.tsx", to: "app/(auth)/signup/page.tsx" },
  { from: "app/auth/error/page.tsx", to: "app/(auth)/error/page.tsx" },
  { from: "lib/auth.ts", to: "lib/auth/index.ts" },

  // Componentes de autenticação
  { from: "components/auth/auth-check.tsx", to: "components/auth/auth-check.tsx" },
  { from: "components/auth/permission-gate.tsx", to: "components/auth/permission-gate.tsx" },
  { from: "components/auth/role-gate.tsx", to: "components/auth/role-gate.tsx" },

  // Arquivos de dashboard
  { from: "app/dashboard/layout.tsx", to: "app/(dashboard)/layout.tsx" },
  { from: "app/dashboard/page.tsx", to: "app/(dashboard)/page.tsx" },
  { from: "app/dashboard/agents/page.tsx", to: "app/(dashboard)/agents/page.tsx" },

  // Componentes de layout
  { from: "components/layout/main-layout.tsx", to: "components/core/main-layout.tsx" },
  { from: "components/layout/dashboard-layout.tsx", to: "components/core/dashboard-layout.tsx" },
  { from: "components/layout/docs-layout.tsx", to: "components/core/docs-layout.tsx" },

  // Arquivos de banco de dados
  { from: "lib/db.ts", to: "lib/db/index.ts" },
  { from: "lib/db/schema.ts", to: "lib/db/schema.ts" },

  // Arquivos Supabase
  { from: "utils/supabase/client.ts", to: "lib/supabase/client.ts" },
  { from: "utils/supabase/server.ts", to: "lib/supabase/server.ts" },

  // Arquivos de IA
  { from: "lib/ai-client.ts", to: "lib/ai/providers/openai.ts" },
  { from: "lib/langchain.ts", to: "lib/ai/langchain.ts" },

  // Utilitários
  { from: "lib/utils.ts", to: "lib/utils.ts" },

  // Tipos
  { from: "types/auth.d.ts", to: "types/auth.d.ts" },
  { from: "types/supabase.ts", to: "types/supabase.ts" },
]

// Mover arquivos
console.log("\nMovendo arquivos para a nova estrutura...")
fileMappings.forEach((mapping) => {
  const sourcePath = path.join(process.cwd(), mapping.from)
  const destPath = path.join(process.cwd(), mapping.to)

  // Verificar se o arquivo de origem existe
  if (fs.existsSync(sourcePath)) {
    // Criar diretório de destino se não existir
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // Copiar o arquivo
    fs.copyFileSync(sourcePath, destPath)
    console.log(`✅ Movido: ${mapping.from} -> ${mapping.to}`)
  } else {
    console.log(`⚠️ Arquivo não encontrado: ${mapping.from}`)
  }
})

// Criar arquivos de exemplo para os novos componentes
console.log("\nCriando arquivos de exemplo para os novos componentes...")

// Exemplo de adaptador LangChain
const langchainAdapterExample = `
import { BaseChatModel } from "langchain/chat_models/base";
import { BaseLanguageModel } from "langchain/base_language";

/**
 * Adaptador base para modelos de linguagem
 */
export abstract class BaseModelAdapter {
  protected model: BaseLanguageModel;
  
  constructor(model: BaseLanguageModel) {
    this.model = model;
  }
  
  abstract generateText(prompt: string): Promise<string>;
  abstract generateChat(messages: Array<{role: string, content: string}>): Promise<string>;
}

/**
 * Adaptador para modelos de chat
 */
export class ChatModelAdapter extends BaseModelAdapter {
  protected chatModel: BaseChatModel;
  
  constructor(model: BaseChatModel) {
    super(model);
    this.chatModel = model as BaseChatModel;
  }
  
  async generateText(prompt: string): Promise<string> {
    const result = await this.chatModel.call([
      { role: "user", content: prompt }
    ]);
    return result.content;
  }
  
  async generateChat(messages: Array<{role: string, content: string}>): Promise<string> {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const result = await this.chatModel.call(formattedMessages);
    return result.content;
  }
}
`

fs.writeFileSync(path.join(process.cwd(), "lib/ai/adapters/base-adapter.ts"), langchainAdapterExample)
console.log("✅ Criado: lib/ai/adapters/base-adapter.ts")

// Exemplo de provedor de IA
const aiProviderExample = `
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatGroq } from "langchain/chat_models/groq";
import { BaseChatModel } from "langchain/chat_models/base";

/**
 * Factory para criar instâncias de modelos de chat
 */
export class ChatModelFactory {
  /**
   * Cria uma instância de modelo de chat baseado no provedor e configurações
   */
  static createModel(provider: "openai" | "groq" | "minimax", modelName: string, options: any = {}): BaseChatModel {
    switch (provider) {
      case "openai":
        return new ChatOpenAI({
          modelName,
          temperature: options.temperature || 0.7,
          openAIApiKey: process.env.OPENAI_API_KEY,
          ...options
        });
      
      case "groq":
        return new ChatGroq({
          modelName,
          temperature: options.temperature || 0.7,
          apiKey: process.env.GROQ_API_KEY,
          ...options
        });
        
      case "minimax":
        // Implementar quando o adaptador Minimax estiver disponível
        throw new Error("Minimax provider not implemented yet");
        
      default:
        throw new Error(\`Unsupported provider: \${provider}\`);
    }
  }
  
  /**
   * Seleciona o melhor modelo com base em custo, latência e complexidade
   */
  static selectOptimalModel(taskComplexity: "low" | "medium" | "high", latencySensitive: boolean = false): BaseChatModel {
    // Lógica para selecionar o modelo ideal com base nos parâmetros
    if (taskComplexity === "high") {
      return this.createModel("openai", "gpt-4o");
    } else if (latencySensitive) {
      return this.createModel("groq", "llama3-8b-8192");
    } else {
      return this.createModel("openai", "gpt-3.5-turbo");
    }
  }
}
`

fs.writeFileSync(path.join(process.cwd(), "lib/ai/providers/model-factory.ts"), aiProviderExample)
console.log("✅ Criado: lib/ai/providers/model-factory.ts")

// Exemplo de cliente Redis para cache
const redisClientExample = `
import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

/**
 * Obtém uma instância do cliente Redis
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    // Verificar se a URL do Redis está configurada
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL não está configurada nas variáveis de ambiente');
    }
    
    // Criar nova instância do cliente Redis
    redisClient = new Redis(redisUrl);
    
    // Configurar handlers de erro
    redisClient.on('error', (err) => {
      console.error('Erro na conexão Redis:', err);
    });
  }
  
  return redisClient;
}

/**
 * Armazena um valor no cache com TTL opcional
 */
export async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const client = getRedisClient();
  const serializedValue = JSON.stringify(value);
  
  if (ttlSeconds) {
    await client.set(key, serializedValue, 'EX', ttlSeconds);
  } else {
    await client.set(key, serializedValue);
  }
}

/**
 * Recupera um valor do cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const value = await client.get(key);
  
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Erro ao fazer parse do valor do cache:', error);
    return null;
  }
}

/**
 * Remove um valor do cache
 */
export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

/**
 * Wrapper para função que implementa cache
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  // Tentar obter do cache primeiro
  const cachedValue = await getCache<T>(key);
  if (cachedValue) return cachedValue;
  
  // Se não estiver no cache, executar a função
  const result = await fn();
  
  // Armazenar o resultado no cache
  await setCache(key, result, ttlSeconds);
  
  return result;
}
`

fs.writeFileSync(path.join(process.cwd(), "lib/cache/redis.ts"), redisClientExample)
console.log("✅ Criado: lib/cache/redis.ts")

// Exemplo de constantes da aplicação
const constantsExample = `
/**
 * Constantes relacionadas a modelos de IA
 */
export const AI_MODELS = {
  // OpenAI
  GPT_4O: "gpt-4o",
  GPT_4_TURBO: "gpt-4-turbo",
  GPT_35_TURBO: "gpt-3.5-turbo",
  
  // Groq
  LLAMA_3_8B: "llama3-8b-8192",
  LLAMA_3_70B: "llama3-70b-8192",
  
  // Minimax
  ABAB_5_5B: "abab5.5-chat",
  ABAB_7B: "abab7b-chat",
};

/**
 * Tipos de agentes disponíveis
 */
export const AGENT_TYPES = {
  CUSTOMER_SUPPORT: "customer_support",
  SALES: "sales",
  KNOWLEDGE_BASE: "knowledge_base",
  CUSTOM: "custom",
};

/**
 * Roles de usuário
 */
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  AGENT: "agent",
  VIEWER: "viewer",
};

/**
 * Limites da aplicação
 */
export const LIMITS = {
  MAX_AGENTS_FREE: 3,
  MAX_KNOWLEDGE_BASES_FREE: 2,
  MAX_CONVERSATIONS_FREE: 100,
  MAX_TOKENS_PER_REQUEST: 4000,
};

/**
 * Configurações de cache
 */
export const CACHE_TTL = {
  AGENT_LIST: 60 * 5, // 5 minutos
  CONVERSATION_LIST: 60 * 2, // 2 minutos
  KNOWLEDGE_BASE_LIST: 60 * 10, // 10 minutos
  USER_SETTINGS: 60 * 30, // 30 minutos
  AI_RESPONSE: 60 * 60 * 24, // 24 horas
};
`

fs.writeFileSync(path.join(process.cwd(), "constants/index.ts"), constantsExample)
console.log("✅ Criado: constants/index.ts")

// Exemplo de configuração do projeto
const configExample = `
/**
 * Configuração do site
 */
export const siteConfig = {
  name: "Agentes de Conversão",
  description: "Plataforma de criação e gerenciamento de agentes de IA para conversão de leads",
  url: "https://agentesdeconversao.com.br",
  ogImage: "https://agentesdeconversao.com.br/og-image.png",
  links: {
    twitter: "https://twitter.com/agentesdeconversao",
    github: "https://github.com/agentesdeconversao",
  },
};

/**
 * Configuração dos modelos de IA
 */
export const aiConfig = {
  defaultModel: "gpt-3.5-turbo",
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000,
  
  // Mapeamento de modelos por caso de uso
  modelsByUseCase: {
    customerSupport: "gpt-3.5-turbo",
    sales: "gpt-4o",
    knowledgeBase: "llama3-8b-8192",
    transcription: "whisper-1",
  },
  
  // Configuração de custo por 1K tokens
  costPer1KTokens: {
    "gpt-4o": { input: 0.01, output: 0.03 },
    "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
    "llama3-8b-8192": { input: 0.0002, output: 0.0002 },
    "llama3-70b-8192": { input: 0.0007, output: 0.0007 },
  },
};

/**
 * Configuração de navegação
 */
export const navigationConfig = {
  main: [
    { title: "Início", href: "/" },
    { title: "Recursos", href: "/features" },
    { title: "Preços", href: "/pricing" },
    { title: "Blog", href: "/blog" },
    { title: "Documentação", href: "/docs" },
  ],
  dashboard: [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Agentes", href: "/dashboard/agents", icon: "Bot" },
    { title: "Conversas", href: "/dashboard/conversations", icon: "MessageSquare" },
    { title: "Base de Conhecimento", href: "/dashboard/knowledge", icon: "Database" },
    { title: "Configurações", href: "/dashboard/settings", icon: "Settings" },
  ],
};
`

fs.writeFileSync(path.join(process.cwd(), "config/index.ts"), configExample)
console.log("✅ Criado: config/index.ts")

// Atualizar package.json para adicionar novas dependências
console.log("\nAtualizando package.json...")
try {
  const packageJsonPath = path.join(process.cwd(), "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // Adicionar novas dependências
  const newDependencies = {
    ioredis: "^5.3.2",
    "@tanstack/react-query": "^5.8.4",
    langchain: "^0.0.200",
    "@langchain/core": "^0.1.17",
    "@langchain/openai": "^0.0.14",
    "@langchain/groq": "^0.0.2",
  }

  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...newDependencies,
  }

  // Adicionar scripts para a nova estrutura
  packageJson.scripts = {
    ...packageJson.scripts,
    restructure: "ts-node --esm scripts/restructure-project.ts",
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ package.json atualizado com novas dependências")
} catch (error) {
  console.error("❌ Erro ao atualizar package.json:", error)
}

console.log('\n✅ Reestruturação concluída! Execute "npm run restructure" para aplicar as mudanças.')
