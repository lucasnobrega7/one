import { 
  getOpenRouterClient, 
  createOpenRouterCompletion, 
  createOpenRouterStream,
  selectOptimalModel,
  OPENROUTER_MODELS,
  type OpenRouterModel 
} from "./providers/openrouter"
import { getOpenAIClient } from "../ai-client"
import { getGroqClient } from "./providers/groq"

// Provider priority for intelligent fallback
interface AIProvider {
  name: string
  priority: number
  available: boolean
  costMultiplier: number // Relative cost compared to OpenRouter
  execute: (params: CompletionParams) => Promise<any>
  supportsStreaming: boolean
}

interface CompletionParams {
  messages: any[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  userId?: string
  taskType?: 'simple' | 'general' | 'complex' | 'quick-responses' | 'balanced'
  budgetLevel?: 'economy' | 'standard' | 'premium'
}

// Smart AI Client with fallback and cost optimization
export class SmartAIClient {
  private providers: AIProvider[] = []
  private failureCount = new Map<string, number>()
  private lastSuccess = new Map<string, number>()
  
  constructor() {
    this.initializeProviders()
  }
  
  private initializeProviders() {
    // Priority 1: OpenRouter (cheapest, most models, built-in fallback)
    this.providers.push({
      name: 'openrouter',
      priority: 1,
      available: !!process.env.OPENROUTER_API_KEY,
      costMultiplier: 1.0, // Base cost
      supportsStreaming: true,
      execute: async (params) => {
        const model = selectOptimalModel(params.taskType, params.budgetLevel)
        
        // Check if content has special requirements
        const hasImages = params.messages.some(msg => 
          Array.isArray(msg.content) && 
          msg.content.some(item => item.type === 'image_url')
        )
        
        const hasTools = !!params.temperature // Placeholder - would check if tools are needed
        
        return createOpenRouterCompletion(model, params.messages, {
          temperature: params.temperature,
          maxTokens: params.maxTokens,
          stream: params.stream,
          userId: params.userId,
          trackCost: true,
          hasImages,
          requireTools: hasTools,
          // OpenRouter handles fallback internally now
        })
      }
    })
    
    // Priority 2: OpenAI Direct (reliable fallback)
    this.providers.push({
      name: 'openai',
      priority: 2,
      available: !!process.env.OPENAI_API_KEY,
      costMultiplier: 6.67, // ~6.67x more expensive than OpenRouter
      supportsStreaming: true,
      execute: async (params) => {
        const client = getOpenAIClient()
        const model = this.mapToOpenAIModel(params.taskType, params.budgetLevel)
        
        return client.chat.completions.create({
          model,
          messages: params.messages,
          temperature: params.temperature || 0.7,
          max_tokens: params.maxTokens || 1000,
          stream: params.stream || false,
        })
      }
    })
    
    // Priority 3: Groq (fast, cheap for simple tasks)
    this.providers.push({
      name: 'groq',
      priority: 3,
      available: !!process.env.GROQ_API_KEY,
      costMultiplier: 0.5, // Cheaper than OpenRouter for simple tasks
      supportsStreaming: true,
      execute: async (params) => {
        const client = getGroqClient()
        
        return client.chat.completions.create({
          model: "llama-3.1-8b-instant", // Fast Groq model
          messages: params.messages,
          temperature: params.temperature || 0.7,
          max_tokens: params.maxTokens || 1000,
          stream: params.stream || false,
        })
      }
    })
    
    // Sort by priority and filter available providers
    this.providers = this.providers
      .filter(p => p.available)
      .sort((a, b) => a.priority - b.priority)
  }
  
  // Map task types to OpenAI models
  private mapToOpenAIModel(taskType?: string, budgetLevel?: string): string {
    if (budgetLevel === 'economy') return 'gpt-4o-mini'
    if (budgetLevel === 'premium') return 'gpt-4o'
    
    switch (taskType) {
      case 'simple':
      case 'quick-responses':
        return 'gpt-4o-mini'
      case 'complex':
        return 'gpt-4o'
      default:
        return 'gpt-4o-mini' // Best value
    }
  }
  
  // Get optimal provider based on task and budget
  private getOptimalProvider(params: CompletionParams): AIProvider[] {
    // For economy budget, prefer cheapest options
    if (params.budgetLevel === 'economy') {
      const groq = this.providers.find(p => p.name === 'groq')
      const openrouter = this.providers.find(p => p.name === 'openrouter')
      return [groq, openrouter].filter(Boolean) as AIProvider[]
    }
    
    // For premium budget, prefer reliability over cost
    if (params.budgetLevel === 'premium') {
      return this.providers.slice() // All providers in priority order
    }
    
    // Standard: OpenRouter first, then fallbacks
    return this.providers.slice()
  }
  
  // Track provider failures for circuit breaker pattern
  private recordFailure(providerName: string) {
    const current = this.failureCount.get(providerName) || 0
    this.failureCount.set(providerName, current + 1)
  }
  
  private recordSuccess(providerName: string) {
    this.failureCount.set(providerName, 0)
    this.lastSuccess.set(providerName, Date.now())
  }
  
  private isProviderHealthy(providerName: string): boolean {
    const failures = this.failureCount.get(providerName) || 0
    const lastSuccess = this.lastSuccess.get(providerName) || 0
    const timeSinceLastSuccess = Date.now() - lastSuccess
    
    // Circuit breaker: if more than 3 failures in last 5 minutes, consider unhealthy
    return failures < 3 || timeSinceLastSuccess < 5 * 60 * 1000
  }
  
  // Main completion method with intelligent fallback
  async createCompletion(params: CompletionParams): Promise<any> {
    const optimalProviders = this.getOptimalProvider(params)
    let lastError: Error | null = null
    
    for (const provider of optimalProviders) {
      // Skip unhealthy providers
      if (!this.isProviderHealthy(provider.name)) {
        console.log(`Skipping unhealthy provider: ${provider.name}`)
        continue
      }
      
      try {
        console.log(`Attempting completion with provider: ${provider.name}`)
        const result = await provider.execute(params)
        
        this.recordSuccess(provider.name)
        
        // Add metadata about cost and provider
        return {
          ...result,
          _metadata: {
            provider: provider.name,
            costMultiplier: provider.costMultiplier,
            timestamp: new Date().toISOString()
          }
        }
        
      } catch (error) {
        console.error(`Provider ${provider.name} failed:`, error)
        this.recordFailure(provider.name)
        lastError = error as Error
        
        // Continue to next provider
        continue
      }
    }
    
    // All providers failed
    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`)
  }
  
  // Streaming completion with fallback
  async createStreamingCompletion(
    params: CompletionParams,
    onToken: (token: string) => void,
    onComplete?: (metadata: any) => void
  ): Promise<void> {
    const streamParams = { ...params, stream: true }
    const optimalProviders = this.getOptimalProvider(streamParams)
      .filter(p => p.supportsStreaming)
    
    let lastError: Error | null = null
    
    for (const provider of optimalProviders) {
      if (!this.isProviderHealthy(provider.name)) continue
      
      try {
        console.log(`Attempting streaming with provider: ${provider.name}`)
        
        if (provider.name === 'openrouter') {
          const model = selectOptimalModel(params.taskType, params.budgetLevel)
          await createOpenRouterStream(model, params.messages, {
            temperature: params.temperature,
            maxTokens: params.maxTokens,
            userId: params.userId,
            onToken,
            onComplete: (usage) => {
              this.recordSuccess(provider.name)
              onComplete?.({
                provider: provider.name,
                costMultiplier: provider.costMultiplier,
                usage,
                timestamp: new Date().toISOString()
              })
            }
          })
        } else {
          // For other providers, use regular completion and simulate streaming
          const result = await provider.execute(streamParams)
          
          if (result.choices?.[0]?.delta?.content) {
            // Handle streaming response
            const content = result.choices[0].delta.content
            onToken(content)
          } else if (result.choices?.[0]?.message?.content) {
            // Simulate streaming for non-streaming providers
            const content = result.choices[0].message.content
            const words = content.split(' ')
            
            for (const word of words) {
              onToken(word + ' ')
              await new Promise(resolve => setTimeout(resolve, 50)) // Simulate delay
            }
          }
          
          this.recordSuccess(provider.name)
          onComplete?.({
            provider: provider.name,
            costMultiplier: provider.costMultiplier,
            timestamp: new Date().toISOString()
          })
        }
        
        return // Success
        
      } catch (error) {
        console.error(`Streaming provider ${provider.name} failed:`, error)
        this.recordFailure(provider.name)
        lastError = error as Error
        continue
      }
    }
    
    throw new Error(`All streaming providers failed. Last error: ${lastError?.message}`)
  }
  
  // Cost estimation before request
  estimateCost(params: CompletionParams): { provider: string, estimatedCost: number }[] {
    const estimates = []
    
    for (const provider of this.providers) {
      let estimatedCost = 0
      
      if (provider.name === 'openrouter') {
        const model = selectOptimalModel(params.taskType, params.budgetLevel)
        const modelConfig = OPENROUTER_MODELS[model]
        // Estimate based on average input/output tokens
        estimatedCost = ((1000 / 1000000) * modelConfig.inputCost) + 
                       ((500 / 1000000) * modelConfig.outputCost)
      } else {
        // Use relative cost multiplier
        estimatedCost = 0.003 * provider.costMultiplier // Base estimate
      }
      
      estimates.push({
        provider: provider.name,
        estimatedCost
      })
    }
    
    return estimates.sort((a, b) => a.estimatedCost - b.estimatedCost)
  }
  
  // Provider health status
  getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      available: provider.available,
      healthy: this.isProviderHealthy(provider.name),
      failures: this.failureCount.get(provider.name) || 0,
      lastSuccess: this.lastSuccess.get(provider.name),
      costMultiplier: provider.costMultiplier
    }))
  }
}

// Singleton instance
let smartAIClient: SmartAIClient | null = null

export function getSmartAIClient(): SmartAIClient {
  if (!smartAIClient) {
    smartAIClient = new SmartAIClient()
  }
  return smartAIClient
}

// Convenient wrapper functions
export async function generateSmartResponse(
  prompt: string,
  options: {
    taskType?: 'simple' | 'general' | 'complex' | 'quick-responses' | 'balanced'
    budgetLevel?: 'economy' | 'standard' | 'premium'
    temperature?: number
    maxTokens?: number
    userId?: string
  } = {}
) {
  const client = getSmartAIClient()
  
  return client.createCompletion({
    messages: [{ role: 'user', content: prompt }],
    taskType: options.taskType || 'general',
    budgetLevel: options.budgetLevel || 'standard',
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    userId: options.userId
  })
}

export async function generateSmartStream(
  prompt: string,
  onToken: (token: string) => void,
  options: {
    taskType?: 'simple' | 'general' | 'complex' | 'quick-responses' | 'balanced'
    budgetLevel?: 'economy' | 'standard' | 'premium'
    temperature?: number
    maxTokens?: number
    userId?: string
    onComplete?: (metadata: any) => void
  } = {}
) {
  const client = getSmartAIClient()
  
  return client.createStreamingCompletion({
    messages: [{ role: 'user', content: prompt }],
    taskType: options.taskType || 'general',
    budgetLevel: options.budgetLevel || 'standard',
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    userId: options.userId
  }, onToken, options.onComplete)
}