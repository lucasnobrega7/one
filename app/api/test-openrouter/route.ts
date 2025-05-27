import { NextRequest, NextResponse } from 'next/server'
import { getOpenRouterClient, createOpenRouterCompletion, selectOptimalModel } from '@/lib/ai/providers/openrouter'

export async function POST(request: NextRequest) {
  try {
    const { prompt, budgetLevel = 'standard', taskType = 'general' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      )
    }

    // Check if OpenRouter key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key não configurada' },
        { status: 500 }
      )
    }

    const startTime = Date.now()

    // Select optimal model based on budget
    const model = selectOptimalModel(taskType, budgetLevel)
    
    // Create completion using OpenRouter
    const response = await createOpenRouterCompletion(
      model,
      [{ role: 'user', content: prompt }],
      {
        temperature: 0.7,
        maxTokens: 1000,
        userId: 'test-user',
        trackCost: true
      }
    )

    const endTime = Date.now()
    const duration = endTime - startTime

    // Calculate costs for comparison
    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    
    // OpenRouter cost (actual)
    const openrouterCost = ((inputTokens / 1000000) * 0.15) + ((outputTokens / 1000000) * 0.60)
    
    // OpenAI direct cost (for comparison)
    const openaiDirectCost = ((inputTokens / 1000000) * 5.00) + ((outputTokens / 1000000) * 15.00)
    
    const savings = openaiDirectCost - openrouterCost
    const savingsPercentage = ((savings / openaiDirectCost) * 100)

    return NextResponse.json({
      success: true,
      response: {
        content: response.choices[0].message.content,
        provider: 'openrouter',
        model: model,
        duration,
        usage: response.usage,
        costs: {
          openrouter: openrouterCost,
          openaiDirect: openaiDirectCost,
          savings: savings,
          savingsPercentage: savingsPercentage.toFixed(1)
        },
        metadata: {
          budgetLevel,
          taskType,
          timestamp: new Date().toISOString()
        }
      }
    })

  } catch (error: any) {
    console.error('OpenRouter API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar com OpenRouter',
        details: error.message,
        fallback: 'Tentando provider alternativo...'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test if OpenRouter is accessible
    const client = getOpenRouterClient()
    
    // Simple test request
    const testResponse = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10
    })

    return NextResponse.json({
      status: 'healthy',
      provider: 'openrouter',
      message: 'OpenRouter integration funcionando',
      testResponse: testResponse.choices[0].message.content,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        provider: 'openrouter',
        message: 'Erro na integração OpenRouter',
        error: error.message
      },
      { status: 500 }
    )
  }
}