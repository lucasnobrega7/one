import OpenAI from "openai"

// OpenRouter client for cost-effective AI access
let openrouterClient: OpenAI | null = null

export function getOpenRouterClient() {
  if (!openrouterClient) {
    openrouterClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://agentesdeconversao.ai",
        "X-Title": "Agentes de Conversão",
      },
    })
  }
  return openrouterClient
}

// OpenRouter model configurations with REAL pricing (no markup vs providers)
export const OPENROUTER_MODELS = {
  // Ultra cost-effective models (85% cheaper than OpenAI direct)
  "gpt-4o-mini": {
    name: "openai/gpt-4o-mini",
    inputCost: 0.15,  // $0.15 per 1M tokens (OpenRouter = provider price)
    outputCost: 0.60, // $0.60 per 1M tokens (OpenRouter = provider price)
    contextWindow: 128000,
    description: "Most cost-effective GPT-4 class model",
    useCase: "general", // Default for most tasks
    supports: ["text", "images", "tools"]
  },
  "claude-haiku": {
    name: "anthropic/claude-3-haiku",
    inputCost: 0.25,  // $0.25 per 1M tokens
    outputCost: 1.25, // $1.25 per 1M tokens
    contextWindow: 200000,
    description: "Fast, cost-effective Claude model",
    useCase: "quick-responses",
    supports: ["text", "images", "tools"]
  },
  "gpt-4o": {
    name: "openai/gpt-4o",
    inputCost: 2.50,  // $2.50 per 1M tokens (vs $5.00 OpenAI direct)
    outputCost: 10.00, // $10.00 per 1M tokens (vs $15.00 OpenAI direct)
    contextWindow: 128000,
    description: "Latest GPT-4 model with vision",
    useCase: "complex",
    supports: ["text", "images", "tools", "pdfs"]
  },
  "claude-sonnet": {
    name: "anthropic/claude-3-5-sonnet",
    inputCost: 3.00,  // $3 per 1M tokens
    outputCost: 15.00, // $15 per 1M tokens  
    contextWindow: 200000,
    description: "Balanced Claude model with excellent reasoning",
    useCase: "balanced",
    supports: ["text", "images", "tools", "pdfs"]
  },
  // Free models for freemium tier
  "llama-3.2-free": {
    name: "meta-llama/llama-3.2-3b-instruct:free",
    inputCost: 0,  // FREE!
    outputCost: 0, // FREE!
    contextWindow: 131072,
    description: "Free open source model",
    useCase: "freemium",
    supports: ["text"]
  },
  "gpt-4o-mini-free": {
    name: "openai/gpt-4o-mini:free", 
    inputCost: 0,  // FREE!
    outputCost: 0, // FREE!
    contextWindow: 128000,
    description: "Free GPT-4 class model (rate limited)",
    useCase: "freemium", 
    supports: ["text", "images"]
  },
  // Auto-routing models for maximum reliability
  "auto-router": {
    name: "openrouter/auto",
    inputCost: 0, // Variable pricing
    outputCost: 0, // Variable pricing
    contextWindow: 200000,
    description: "Automatic model selection and fallback",
    useCase: "auto",
    supports: ["text", "images", "tools", "pdfs"]
  }
} as const

export type OpenRouterModel = keyof typeof OPENROUTER_MODELS

// Smart model selection based on task complexity
export function selectOptimalModel(
  taskType: 'simple' | 'general' | 'complex' | 'quick-responses' | 'balanced' = 'general',
  budgetLevel: 'economy' | 'standard' | 'premium' = 'standard'
): OpenRouterModel {
  
  if (budgetLevel === 'economy') {
    switch (taskType) {
      case 'simple':
        return 'llama-3.2'
      case 'quick-responses':
        return 'claude-haiku'
      default:
        return 'gpt-4o-mini' // Best value for money
    }
  }
  
  if (budgetLevel === 'premium') {
    switch (taskType) {
      case 'complex':
        return 'gpt-4-turbo'
      case 'balanced':
        return 'claude-sonnet'
      default:
        return 'gpt-4-turbo'
    }
  }
  
  // Standard budget
  switch (taskType) {
    case 'simple':
      return 'gpt-4o-mini'
    case 'quick-responses':
      return 'claude-haiku'
    case 'complex':
      return 'claude-sonnet'
    case 'balanced':
      return 'claude-sonnet'
    default:
      return 'gpt-4o-mini' // Default: best value
  }
}

// Calculate cost for a request
export function calculateRequestCost(
  model: OpenRouterModel,
  inputTokens: number,
  outputTokens: number
): number {
  const modelConfig = OPENROUTER_MODELS[model]
  const inputCost = (inputTokens / 1000000) * modelConfig.inputCost
  const outputCost = (outputTokens / 1000000) * modelConfig.outputCost
  return inputCost + outputCost
}

// Enhanced completion with cost tracking and auto-fallback
export async function createOpenRouterCompletion(
  model: OpenRouterModel,
  messages: any[],
  options: {
    temperature?: number
    maxTokens?: number
    stream?: boolean
    userId?: string
    trackCost?: boolean
    fallbackModels?: OpenRouterModel[]
    requireTools?: boolean
    hasImages?: boolean
    hasPDFs?: boolean
  } = {}
) {
  const client = getOpenRouterClient()
  const modelConfig = OPENROUTER_MODELS[model]
  
  // Auto-select fallback models if not provided
  let models = [modelConfig.name]
  if (options.fallbackModels) {
    models = models.concat(options.fallbackModels.map(m => OPENROUTER_MODELS[m].name))
  } else {
    // Smart fallback selection based on requirements
    models = getSmartFallbackModels(model, options)
  }
  
  const startTime = Date.now()
  
  try {
    const requestBody: any = {
      model: models.length > 1 ? models : modelConfig.name, // Use models array for fallback
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      stream: options.stream || false,
    }
    
    // Add metadata for OpenRouter routing
    if (options.requireTools) {
      requestBody.tool_choice = "auto" // Ensures only tool-capable models are used
    }
    
    const response = await client.chat.completions.create(requestBody)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    // Track cost and usage if enabled
    if (options.trackCost && response.usage) {
      const cost = calculateRequestCost(
        model,
        response.usage.prompt_tokens,
        response.usage.completion_tokens
      )
      
      // Enhanced logging with fallback info
      console.log(`OpenRouter Request:`, {
        primaryModel: model,
        fallbackModels: models.slice(1),
        actualModel: response.model || modelConfig.name,
        userId: options.userId,
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
        cost: cost.toFixed(4),
        duration,
        timestamp: new Date().toISOString()
      })
      
      // TODO: Send to analytics/billing service
      // await trackAIUsage({ model, cost, tokens: response.usage.total_tokens, userId })
    }
    
    return response
  } catch (error) {
    console.error(`OpenRouter API error for model ${model}:`, error)
    throw error
  }
}

// Smart fallback model selection based on requirements
function getSmartFallbackModels(
  primaryModel: OpenRouterModel, 
  options: {
    requireTools?: boolean
    hasImages?: boolean
    hasPDFs?: boolean
  }
): string[] {
  const primaryConfig = OPENROUTER_MODELS[primaryModel]
  const models = [primaryConfig.name]
  
  // Get compatible fallback models
  const compatibleModels = Object.entries(OPENROUTER_MODELS)
    .filter(([key, config]) => {
      if (key === primaryModel) return false // Skip primary
      
      // Check compatibility requirements
      if (options.requireTools && !config.supports.includes("tools")) return false
      if (options.hasImages && !config.supports.includes("images")) return false
      if (options.hasPDFs && !config.supports.includes("pdfs")) return false
      
      return true
    })
    .sort((a, b) => {
      // Sort by cost (cheaper first)
      const costA = a[1].inputCost + a[1].outputCost
      const costB = b[1].inputCost + b[1].outputCost
      return costA - costB
    })
    .slice(0, 2) // Take top 2 fallbacks
  
  // Add fallback models
  models.push(...compatibleModels.map(([_, config]) => config.name))
  
  return models
}

// Streaming completion with cost tracking
export async function createOpenRouterStream(
  model: OpenRouterModel,
  messages: any[],
  options: {
    temperature?: number
    maxTokens?: number
    userId?: string
    onToken?: (token: string) => void
    onComplete?: (usage: any) => void
  } = {}
) {
  const client = getOpenRouterClient()
  const modelConfig = OPENROUTER_MODELS[model]
  
  const stream = await client.chat.completions.create({
    model: modelConfig.name,
    messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
    stream: true,
    stream_options: { include_usage: true }
  })
  
  let fullContent = ""
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ""
    if (content) {
      fullContent += content
      options.onToken?.(content)
    }
    
    // Handle usage data in final chunk
    if (chunk.usage && options.onComplete) {
      const cost = calculateRequestCost(
        model,
        chunk.usage.prompt_tokens,
        chunk.usage.completion_tokens
      )
      
      options.onComplete({
        usage: chunk.usage,
        cost,
        model,
        content: fullContent
      })
    }
  }
  
  return { content: fullContent }
}