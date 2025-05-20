import client from "../client"

const getAllNodes = () => client.get("/nodes")

const getSpecificNode = (name: string) => client.get(`/nodes/${name}`)

const getNodesByCategory = (name: string) => client.get(`/nodes/category/${name}`)

const executeCustomFunctionNode = (body: any) => client.post(`/node-custom-function`, body)

export const nodesService = {
  getAllNodes,
  getSpecificNode,
  executeCustomFunctionNode,
  getNodesByCategory,
}
