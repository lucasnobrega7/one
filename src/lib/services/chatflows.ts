import client from "../client"
import type { IFlow } from "../interfaces/flow"

const getAllChatflows = () => client.get("/chatflows?type=CHATFLOW")

const getAllAgentflows = () => client.get("/chatflows?type=MULTIAGENT")

const getSpecificChatflow = (id: string) => client.get(`/chatflows/${id}`)

const getSpecificChatflowFromPublicEndpoint = (id: string) => client.get(`/public-chatflows/${id}`)

const createNewChatflow = (body: Partial<IFlow>) => client.post(`/chatflows`, body)

const importChatflows = (body: any) => client.post(`/chatflows/importchatflows`, body)

const updateChatflow = (id: string, body: Partial<IFlow>) => client.put(`/chatflows/${id}`, body)

const deleteChatflow = (id: string) => client.delete(`/chatflows/${id}`)

const getIsChatflowStreaming = (id: string) => client.get(`/chatflows-streaming/${id}`)

const getAllowChatflowUploads = (id: string) => client.get(`/chatflows-uploads/${id}`)

export const chatflowsService = {
  getAllChatflows,
  getAllAgentflows,
  getSpecificChatflow,
  getSpecificChatflowFromPublicEndpoint,
  createNewChatflow,
  importChatflows,
  updateChatflow,
  deleteChatflow,
  getIsChatflowStreaming,
  getAllowChatflowUploads,
}
