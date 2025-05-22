import axios from "axios"

const MINIMAX_API_URL = "https://api.minimax.chat/v1"

interface MinimaxConfig {
  groupId: string
  apiKey: string
}

let minimaxConfig: MinimaxConfig | null = null

function getMinimaxConfig(): MinimaxConfig {
  if (!minimaxConfig) {
    const groupId = process.env.MINIMAX_GROUP_ID
    const apiKey = process.env.MINIMAX_API_KEY

    if (!groupId || !apiKey) {
      throw new Error("MINIMAX_GROUP_ID ou MINIMAX_API_KEY não estão configurados nas variáveis de ambiente")
    }

    minimaxConfig = { groupId, apiKey }
  }

  return minimaxConfig
}

export async function generateMinimaxResponse(prompt: string, modelId = "abab5.5-chat", options: any = {}) {
  const config = getMinimaxConfig()

  const response = await axios.post(
    `${MINIMAX_API_URL}/text/chatcompletion`,
    {
      model: modelId,
      messages: [{ sender_type: "USER", text: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "X-Minimax-Group-Id": config.groupId,
      },
    },
  )

  return response.data
}

export async function createMinimaxEmbedding(text: string, modelId = "embo-01") {
  const config = getMinimaxConfig()

  const response = await axios.post(
    `${MINIMAX_API_URL}/embeddings`,
    {
      model: modelId,
      texts: [text],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "X-Minimax-Group-Id": config.groupId,
      },
    },
  )

  return response.data.embeddings[0]
}
