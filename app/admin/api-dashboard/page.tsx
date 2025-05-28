"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Database, MessageSquare, Search, Server } from "lucide-react"

export default function ApiDashboard() {
  const [apiStatus, setApiStatus] = useState({
    openai: "loading",
    cohere: "loading",
    pinecone: "loading",
    neon: "loading",
  })

  const [testResults, setTestResults] = useState<{
    openai: any,
    cohere: any,
    pinecone: any,
    neon: any,
  }>({
    openai: null,
    cohere: null,
    pinecone: null,
    neon: null,
  })

  const [loading, setLoading] = useState({
    openai: false,
    cohere: false,
    pinecone: false,
    neon: false,
  })

  const [inputs, setInputs] = useState({
    openai: "Gere um resumo sobre inteligência artificial em 2 frases.",
    cohere: "inteligência artificial",
    pinecone: "Como funciona a busca vetorial?",
    neon: "SELECT NOW();",
  })

  // Verificar status das APIs ao carregar a página
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()

        setApiStatus({
          openai: data.OPENAI_API_KEY ? "online" : "offline",
          cohere: data.COHERE_API_KEY ? "online" : "offline",
          pinecone: data.PINECONE_API_KEY && data.PINECONE_ENVIRONMENT ? "online" : "offline",
          neon: data.NEON_DATABASE_URL || data.NEON_NEON_DATABASE_URL ? "online" : "offline",
        })
      } catch (error) {
        // Error checking API status
      }
    }

    checkApiStatus()
  }, [])

  // Função para testar a API da OpenAI
  const testOpenAI = async () => {
    setLoading((prev) => ({ ...prev, openai: true }))
    setTestResults((prev) => ({ ...prev, openai: null }))

    try {
      const response = await fetch("/api/test/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputs.openai }),
      })

      const data = await response.json()
      setTestResults((prev) => ({ ...prev, openai: data }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, openai: { error: "Falha ao conectar com a API" } }))
    } finally {
      setLoading((prev) => ({ ...prev, openai: false }))
    }
  }

  // Função para testar a API da Cohere
  const testCohere = async () => {
    setLoading((prev) => ({ ...prev, cohere: true }))
    setTestResults((prev) => ({ ...prev, cohere: null }))

    try {
      const response = await fetch("/api/test/cohere", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputs.cohere }),
      })

      const data = await response.json()
      setTestResults((prev) => ({ ...prev, cohere: data }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, cohere: { error: "Falha ao conectar com a API" } }))
    } finally {
      setLoading((prev) => ({ ...prev, cohere: false }))
    }
  }

  // Função para testar a API do Pinecone
  const testPinecone = async () => {
    setLoading((prev) => ({ ...prev, pinecone: true }))
    setTestResults((prev) => ({ ...prev, pinecone: null }))

    try {
      const response = await fetch("/api/test/pinecone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputs.pinecone }),
      })

      const data = await response.json()
      setTestResults((prev) => ({ ...prev, pinecone: data }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, pinecone: { error: "Falha ao conectar com a API" } }))
    } finally {
      setLoading((prev) => ({ ...prev, pinecone: false }))
    }
  }

  // Função para testar o banco de dados Neon
  const testNeon = async () => {
    setLoading((prev) => ({ ...prev, neon: true }))
    setTestResults((prev) => ({ ...prev, neon: null }))

    try {
      const response = await fetch("/api/test/neon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputs.neon }),
      })

      const data = await response.json()
      setTestResults((prev) => ({ ...prev, neon: data }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, neon: { error: "Falha ao conectar com a API" } }))
    } finally {
      setLoading((prev) => ({ ...prev, neon: false }))
    }
  }

  // Renderizar status da API
  const renderStatus = (status: string) => {
    if (status === "loading") {
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Verificando...
        </Badge>
      )
    } else if (status === "online") {
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
          Online
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
          Offline
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <Server className="w-8 h-8 text-[#46B2E0]" />
          Dashboard de APIs
        </h1>
        <p className="text-white/70 mb-8">
          Teste e monitore o funcionamento de todas as APIs integradas ao sistema.
        </p>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white">
              <MessageSquare className="mr-2 h-5 w-5 text-[#46B2E0]" />
              OpenAI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status:</span>
              {renderStatus(apiStatus.openai)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white">
              <Search className="mr-2 h-5 w-5 text-[#8A53D2]" />
              Cohere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status:</span>
              {renderStatus(apiStatus.cohere)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white">
              <Server className="mr-2 h-5 w-5 text-[#E056A0]" />
              Pinecone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status:</span>
              {renderStatus(apiStatus.pinecone)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1d] border-[#27272a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white">
              <Database className="mr-2 h-5 w-5 text-green-500" />
              Neon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status:</span>
              {renderStatus(apiStatus.neon)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Teste */}
      <Tabs defaultValue="openai" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4 bg-[#1a1a1d] border-[#27272a]">
          <TabsTrigger value="openai" className="data-[state=active]:bg-[#46B2E0]/20 data-[state=active]:text-[#46B2E0] text-white/70">OpenAI</TabsTrigger>
          <TabsTrigger value="cohere" className="data-[state=active]:bg-[#8A53D2]/20 data-[state=active]:text-[#8A53D2] text-white/70">Cohere</TabsTrigger>
          <TabsTrigger value="pinecone" className="data-[state=active]:bg-[#E056A0]/20 data-[state=active]:text-[#E056A0] text-white/70">Pinecone</TabsTrigger>
          <TabsTrigger value="neon" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-white/70">Neon</TabsTrigger>
        </TabsList>

        {/* Tab OpenAI */}
        <TabsContent value="openai">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white">Teste da API OpenAI</CardTitle>
              <CardDescription className="text-white/70">Teste a geração de texto usando a API da OpenAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-prompt" className="text-white">Prompt</Label>
                  <Textarea
                    id="openai-prompt"
                    placeholder="Digite seu prompt aqui..."
                    value={inputs.openai}
                    onChange={(e) => setInputs((prev) => ({ ...prev, openai: e.target.value }))}
                    rows={3}
                    className="bg-[#0e0e10] border-[#27272a] text-white placeholder:text-white/50"
                  />
                </div>

                {testResults.openai && (
                  <div className="p-4 bg-[#0e0e10]/50 border border-[#27272a] rounded-md">
                    <h3 className="font-medium mb-2 text-white">Resultado:</h3>
                    {testResults.openai.error ? (
                      <div className="text-red-400 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{testResults.openai.error}</span>
                      </div>
                    ) : (
                      <div className="text-white/80">{testResults.openai.result}</div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testOpenAI} 
                disabled={loading.openai || apiStatus.openai === "offline"}
                className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] hover:from-[#46B2E0]/80 hover:to-[#8A53D2]/80 text-white"
              >
                {loading.openai ? "Testando..." : "Testar API"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Cohere */}
        <TabsContent value="cohere">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white">Teste da API Cohere</CardTitle>
              <CardDescription className="text-white/70">Teste a geração de embeddings usando a API da Cohere</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cohere-text" className="text-white">Texto</Label>
                  <Input
                    id="cohere-text"
                    placeholder="Digite o texto para gerar embeddings..."
                    value={inputs.cohere}
                    onChange={(e) => setInputs((prev) => ({ ...prev, cohere: e.target.value }))}
                    className="bg-[#0e0e10] border-[#27272a] text-white placeholder:text-white/50"
                  />
                </div>

                {testResults.cohere && (
                  <div className="p-4 bg-[#0e0e10]/50 border border-[#27272a] rounded-md">
                    <h3 className="font-medium mb-2 text-white">Resultado:</h3>
                    {testResults.cohere.error ? (
                      <div className="text-red-400 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{testResults.cohere.error}</span>
                      </div>
                    ) : (
                      <div className="text-white/80">
                        <p>Embedding gerado com sucesso!</p>
                        <p className="text-xs mt-2 text-white/60">Dimensões: {testResults.cohere.dimensions}</p>
                        <p className="text-xs text-white/60">Primeiros 5 valores: {testResults.cohere.preview.join(", ")}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testCohere} 
                disabled={loading.cohere || apiStatus.cohere === "offline"}
                className="bg-gradient-to-r from-[#8A53D2] to-[#E056A0] hover:from-[#8A53D2]/80 hover:to-[#E056A0]/80 text-white"
              >
                {loading.cohere ? "Testando..." : "Testar API"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Pinecone */}
        <TabsContent value="pinecone">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white">Teste da API Pinecone</CardTitle>
              <CardDescription className="text-white/70">Teste a busca vetorial usando a API do Pinecone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pinecone-query" className="text-white">Consulta</Label>
                  <Input
                    id="pinecone-query"
                    placeholder="Digite sua consulta..."
                    value={inputs.pinecone}
                    onChange={(e) => setInputs((prev) => ({ ...prev, pinecone: e.target.value }))}
                    className="bg-[#0e0e10] border-[#27272a] text-white placeholder:text-white/50"
                  />
                </div>

                {testResults.pinecone && (
                  <div className="p-4 bg-[#0e0e10]/50 border border-[#27272a] rounded-md">
                    <h3 className="font-medium mb-2 text-white">Resultado:</h3>
                    {testResults.pinecone.error ? (
                      <div className="text-red-400 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{testResults.pinecone.error}</span>
                      </div>
                    ) : (
                      <div className="text-white/80">
                        <p>Encontrados {testResults.pinecone.matches?.length || 0} resultados</p>
                        {testResults.pinecone.matches?.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {testResults.pinecone.matches.slice(0, 3).map((match: any, index: number) => (
                              <div key={index} className="text-sm p-2 bg-[#1a1a1d] rounded border border-[#27272a]">
                                <p className="font-medium text-white">Resultado {index + 1}</p>
                                <p className="text-xs mt-1 line-clamp-2 text-white/70">{match.metadata?.text || "Sem texto"}</p>
                                <p className="text-xs text-white/50 mt-1">
                                  Similaridade: {(match.score * 100).toFixed(2)}%
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testPinecone} 
                disabled={loading.pinecone || apiStatus.pinecone === "offline"}
                className="bg-gradient-to-r from-[#E056A0] to-[#46B2E0] hover:from-[#E056A0]/80 hover:to-[#46B2E0]/80 text-white"
              >
                {loading.pinecone ? "Testando..." : "Testar API"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Neon */}
        <TabsContent value="neon">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white">Teste do Banco de Dados Neon</CardTitle>
              <CardDescription className="text-white/70">Teste consultas SQL no banco de dados Neon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="neon-query" className="text-white">Consulta SQL</Label>
                  <Textarea
                    id="neon-query"
                    placeholder="Digite sua consulta SQL..."
                    value={inputs.neon}
                    onChange={(e) => setInputs((prev) => ({ ...prev, neon: e.target.value }))}
                    rows={3}
                    className="bg-[#0e0e10] border-[#27272a] text-white placeholder:text-white/50"
                  />
                </div>

                {testResults.neon && (
                  <div className="p-4 bg-[#0e0e10]/50 border border-[#27272a] rounded-md">
                    <h3 className="font-medium mb-2 text-white">Resultado:</h3>
                    {testResults.neon.error ? (
                      <div className="text-red-400 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{testResults.neon.error}</span>
                      </div>
                    ) : (
                      <div className="text-white/80">
                        <p>Consulta executada com sucesso!</p>
                        {testResults.neon.rows && (
                          <pre className="text-xs mt-2 p-2 bg-[#1a1a1d] border border-[#27272a] rounded overflow-auto max-h-40 text-white/70">
                            {JSON.stringify(testResults.neon.rows, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testNeon} 
                disabled={loading.neon || apiStatus.neon === "offline"}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading.neon ? "Testando..." : "Testar API"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const dynamic = 'force-dynamic'
