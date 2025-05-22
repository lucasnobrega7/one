import { GroqAPI } from "groq-sdk"

// Cliente Groq para acesso aos modelos
let groqClient: GroqAPI | null = null

export function getGroqClient() {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error("GROQ_API_KEY não está configurada nas variáveis de ambiente")
    }

    groqClient = new GroqAPI({ apiKey })
  }
  return groqClient
}

export async function generateGroqResponse(prompt: string, modelId = "llama3-8b-8192", options: any = {}) {
  const client = getGroqClient()

  const response = await client.chat.completions.create({
    model: modelId,
    messages: [{ role: "user", content: prompt }],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
    stream: false,
  })

  return response
}

export async function createGroqEmbedding(text: string, modelId = "llama3-embeddings") {
  const client = getGroqClient()

  const response = await client.embeddings.create({
    model: modelId,
    input: text,
  })

  return response.data[0].embedding
}
