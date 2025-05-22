// ID de usuário fixo para desenvolvimento sem autenticação
export const MOCK_USER_ID = "usr_dev_01"

// Nome de usuário para exibição
export const MOCK_USER_NAME = "Usuário de Teste"

// Função para obter o ID do usuário atual (sem autenticação)
export function getCurrentUserId(): string {
  return MOCK_USER_ID
}

// Função para obter o nome do usuário atual (sem autenticação)
export function getCurrentUserName(): string {
  return MOCK_USER_NAME
}

// Mock da sessão para desenvolvimento sem autenticação
export const mockSession = {
  user: {
    id: MOCK_USER_ID,
    name: MOCK_USER_NAME,
    email: "usuario@teste.com",
    image: "https://ui-avatars.com/api/?name=Usuario+Teste",
  },
}

// Função que simula getServerSession sem autenticação real
export async function getServerSession() {
  return mockSession
}
