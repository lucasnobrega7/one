"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff, Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type ApiKeyGroup = {
  name: string
  description: string
  keys: {
    key: string
    name: string
    description: string
    value: string
    isSecret: boolean
  }[]
}

export default function ApiKeyManager() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState<ApiKeyGroup[]>([
    {
      name: "authentication",
      description: "Chaves para autenticação e autorização",
      keys: [
        {
          key: "NEXTAUTH_SECRET",
          name: "NextAuth Secret",
          description: "Chave secreta para assinatura de tokens JWT",
          value: "",
          isSecret: true,
        },
        {
          key: "GOOGLE_CLIENT_ID",
          name: "Google Client ID",
          description: "ID do cliente para autenticação com Google",
          value: "",
          isSecret: false,
        },
        {
          key: "GOOGLE_CLIENT_SECRET",
          name: "Google Client Secret",
          description: "Segredo do cliente para autenticação com Google",
          value: "",
          isSecret: true,
        },
      ],
    },
    {
      name: "supabase",
      description: "Configurações do Supabase",
      keys: [
        {
          key: "NEXT_PUBLIC_SUPABASE_URL",
          name: "Supabase URL",
          description: "URL do seu projeto Supabase",
          value: "",
          isSecret: false,
        },
        {
          key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          name: "Supabase Anon Key",
          description: "Chave anônima do Supabase",
          value: "",
          isSecret: true,
        },
        {
          key: "SUPABASE_SERVICE_ROLE_KEY",
          name: "Supabase Service Role Key",
          description: "Chave de serviço do Supabase",
          value: "",
          isSecret: true,
        },
        {
          key: "SUPABASE_JWT_SECRET",
          name: "Supabase JWT Secret",
          description: "Segredo JWT do Supabase",
          value: "",
          isSecret: true,
        },
      ],
    },
    {
      name: "database",
      description: "Configurações do banco de dados",
      keys: [
        {
          key: "NEON_NEON_NEON_DATABASE_URL",
          name: "Neon Database URL",
          description: "URL de conexão com o banco de dados Neon",
          value: "",
          isSecret: true,
        },
        {
          key: "NEON_API_KEY",
          name: "Neon API Key",
          description: "Chave de API do Neon",
          value: "",
          isSecret: true,
        },
      ],
    },
    {
      name: "ai",
      description: "Chaves de API para serviços de IA",
      keys: [
        {
          key: "OPENAI_API_KEY",
          name: "OpenAI API Key",
          description: "Chave de API da OpenAI",
          value: "",
          isSecret: true,
        },
        {
          key: "COHERE_API_KEY",
          name: "Cohere API Key",
          description: "Chave de API da Cohere",
          value: "",
          isSecret: true,
        },
      ],
    },
    {
      name: "vectorstore",
      description: "Configurações para armazenamento vetorial",
      keys: [
        {
          key: "PINECONE_API_KEY",
          name: "Pinecone API Key",
          description: "Chave de API do Pinecone",
          value: "",
          isSecret: true,
        },
        {
          key: "PINECONE_ENVIRONMENT",
          name: "Pinecone Environment",
          description: "Ambiente do Pinecone",
          value: "",
          isSecret: false,
        },
      ],
    },
  ])

  const [testResults, setTestResults] = useState<Record<string, { status: "success" | "error" | "loading"; message: string }>>({})

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleInputChange = (groupIndex: number, keyIndex: number, value: string) => {
    const newApiKeys = [...apiKeys]
    newApiKeys[groupIndex].keys[keyIndex].value = value
    setApiKeys(newApiKeys)
  }

  const loadApiKeys = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/env-vars")
      const data = await response.json()

      if (data.success) {
        // Atualizar os valores das chaves com os valores retornados
        const newApiKeys = [...apiKeys]
        newApiKeys.forEach((group) => {
          group.keys.forEach((key, keyIndex) => {
            if (data.variables[key.key] !== undefined) {
              key.value = data.variables[key.key] || ""
            }
          })
        })
        setApiKeys(newApiKeys)

        toast({
          title: "Chaves carregadas com sucesso",
          description: "As variáveis de ambiente foram carregadas do servidor.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao carregar chaves",
          description: data.message || "Não foi possível carregar as variáveis de ambiente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar chaves",
        description: "Ocorreu um erro ao tentar carregar as variáveis de ambiente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveApiKeys = async () => {
    setIsLoading(true)
    try {
      // Preparar os dados para envio
      const variables: Record<string, string> = {}
      apiKeys.forEach((group) => {
        group.keys.forEach((key) => {
          if (key.value) {
            variables[key.key] = key.value
          }
        })
      })

      const response = await fetch("/api/admin/env-vars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variables }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Chaves salvas com sucesso",
          description: "As variáveis de ambiente foram atualizadas.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar chaves",
          description: data.message || "Não foi possível salvar as variáveis de ambiente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar chaves",
        description: "Ocorreu um erro ao tentar salvar as variáveis de ambiente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiKey = async (key: string) => {
    setTestResults((prev) => ({
      ...prev,
      [key]: { status: "loading", message: "Testando..." },
    }))

    try {
      const response = await fetch(`/api/admin/test-api-key?key=${key}`)
      const data = await response.json()

      setTestResults((prev) => ({
        ...prev,
        [key]: {
          status: data.success ? "success" : "error",
          message: data.message,
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          message: "Erro ao testar a chave de API",
        },
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Variáveis de Ambiente</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadApiKeys} 
            disabled={isLoading}
            className="border-[#27272a] bg-[#1a1a1d] text-white hover:bg-[#27272a]/30"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Carregar
          </Button>
          <Button 
            onClick={saveApiKeys} 
            disabled={isLoading}
            className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] hover:from-[#46B2E0]/80 hover:to-[#8A53D2]/80 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue={apiKeys[0].name}>
        <TabsList className="grid bg-[#1a1a1d] border-[#27272a]" style={{ gridTemplateColumns: `repeat(${apiKeys.length}, 1fr)` }}>
          {apiKeys.map((group) => (
            <TabsTrigger 
              key={group.name} 
              value={group.name}
              className="data-[state=active]:bg-[#46B2E0]/20 data-[state=active]:text-[#46B2E0] text-white/70"
            >
              {group.name.charAt(0).toUpperCase() + group.name.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {apiKeys.map((group, groupIndex) => (
          <TabsContent key={group.name} value={group.name} className="space-y-4">
            <p className="text-white/70">{group.description}</p>

            {group.keys.map((keyItem, keyIndex) => (
              <Card key={keyItem.key} className="bg-[#1a1a1d] border-[#27272a]">
                <CardHeader>
                  <CardTitle className="text-white">{keyItem.name}</CardTitle>
                  <CardDescription className="text-white/70">{keyItem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={keyItem.key} className="text-white">{keyItem.key}</Label>
                      <div className="flex">
                        <Input
                          id={keyItem.key}
                          type={keyItem.isSecret && !showSecrets[keyItem.key] ? "password" : "text"}
                          value={keyItem.value}
                          onChange={(e) => handleInputChange(groupIndex, keyIndex, e.target.value)}
                          className="flex-1 bg-[#0e0e10] border-[#27272a] text-white placeholder:text-white/50"
                        />
                        {keyItem.isSecret && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleShowSecret(keyItem.key)}
                            className="ml-2 border-[#27272a] bg-[#1a1a1d] text-white hover:bg-[#27272a]/30"
                          >
                            {showSecrets[keyItem.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    {testResults[keyItem.key] && (
                      <Alert
                        variant={testResults[keyItem.key].status === "success" ? "default" : "destructive"}
                        className={`mt-2 bg-[#0e0e10]/50 border-[#27272a] ${
                          testResults[keyItem.key].status === "success" 
                            ? "border-green-500/30 bg-green-500/10" 
                            : "border-red-500/30 bg-red-500/10"
                        }`}
                      >
                        {testResults[keyItem.key].status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <AlertTitle className="text-white">{testResults[keyItem.key].status === "success" ? "Sucesso" : "Erro"}</AlertTitle>
                        <AlertDescription className="text-white/80">{testResults[keyItem.key].message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => testApiKey(keyItem.key)}
                    disabled={!keyItem.value || isLoading}
                    className="border-[#27272a] bg-[#1a1a1d] text-white hover:bg-[#27272a]/30"
                  >
                    Testar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
