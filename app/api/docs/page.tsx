import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-normal mb-8">Documentação da API</h1>
          <p className="text-xl mb-8">
            Aprenda a integrar os modelos de IA da Agentes de Conversão em suas aplicações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-lg font-normal mb-4">Conteúdo</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#introducao" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Introdução
                  </Link>
                </li>
                <li>
                  <Link href="#autenticacao" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Autenticação
                  </Link>
                </li>
                <li>
                  <Link href="#modelos" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Modelos disponíveis
                  </Link>
                </li>
                <li>
                  <Link href="#endpoints" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Endpoints
                  </Link>
                </li>
                <li>
                  <Link href="#limites" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Limites de uso
                  </Link>
                </li>
                <li>
                  <Link href="#erros" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Tratamento de erros
                  </Link>
                </li>
                <li>
                  <Link href="#exemplos" className="text-sm hover:underline flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Exemplos de código
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div id="introducao" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Introdução</h2>
              <p className="mb-4">
                A API de Agentes de Conversão permite que você integre modelos de IA avançados em suas aplicações. Com
                nossa API, você pode criar chatbots, gerar texto, analisar documentos, criar embeddings e muito mais.
              </p>
              <p className="mb-4">
                Nossa API é RESTful e retorna respostas em formato JSON. Você pode usá-la com qualquer linguagem de
                programação que suporte requisições HTTP.
              </p>
            </div>

            <div id="autenticacao" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Autenticação</h2>
              <p className="mb-4">
                Para usar nossa API, você precisa de uma chave de API. Você pode obter uma chave se registrando em nossa
                plataforma.
              </p>
              <p className="mb-4">
                Todas as requisições à API devem incluir sua chave de API no cabeçalho de autorização:
              </p>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                Authorization: Bearer SUA_CHAVE_DE_API
              </div>
            </div>

            <div id="modelos" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Modelos disponíveis</h2>
              <p className="mb-4">Oferecemos vários modelos otimizados para diferentes tarefas:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>agent-4</strong>: Nosso modelo mais avançado para chat e geração de texto.
                </li>
                <li>
                  <strong>agent-3.5</strong>: Modelo balanceado entre performance e custo.
                </li>
                <li>
                  <strong>embed-3</strong>: Modelo otimizado para criar embeddings de texto.
                </li>
                <li>
                  <strong>image-2</strong>: Modelo para geração e edição de imagens.
                </li>
              </ul>
            </div>

            <div id="endpoints" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Endpoints</h2>
              <p className="mb-4">Nossa API oferece os seguintes endpoints principais:</p>

              <h3 className="text-lg font-normal mb-2">Chat</h3>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                POST https://api.agentesdeconversao.com/v1/chat/completions
              </div>

              <h3 className="text-lg font-normal mb-2">Completions</h3>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                POST https://api.agentesdeconversao.com/v1/completions
              </div>

              <h3 className="text-lg font-normal mb-2">Embeddings</h3>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                POST https://api.agentesdeconversao.com/v1/embeddings
              </div>

              <h3 className="text-lg font-normal mb-2">Imagens</h3>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                POST https://api.agentesdeconversao.com/v1/images/generations
              </div>
            </div>

            <div id="limites" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Limites de uso</h2>
              <p className="mb-4">
                Os limites de uso dependem do seu plano. Por padrão, os seguintes limites se aplicam:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Máximo de 60 requisições por minuto</li>
                <li>Máximo de 10.000 tokens por requisição</li>
                <li>Máximo de 100.000 tokens por dia</li>
              </ul>
              <p className="mb-4">
                Para aumentar esses limites, entre em contato com nossa equipe de suporte ou atualize seu plano.
              </p>
            </div>

            <div id="erros" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Tratamento de erros</h2>
              <p className="mb-4">
                Nossa API retorna códigos de status HTTP padrão para indicar o sucesso ou falha de uma requisição. Em
                caso de erro, o corpo da resposta conterá informações detalhadas sobre o problema.
              </p>
              <div className="bg-white/5 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                {`{
  "error": {
    "message": "Descrição do erro",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}`}
              </div>
            </div>

            <div id="exemplos" className="mb-12">
              <h2 className="text-2xl font-normal mb-4 border-b border-white/10 pb-2">Exemplos de código</h2>

              <h3 className="text-lg font-normal mb-2">Exemplo em JavaScript</h3>
              <div className="bg-white/5 p-4 rounded mb-6 font-mono text-sm overflow-x-auto">
                {`const response = await fetch('https://api.agentesdeconversao.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'agent-4',
    messages: [
      { role: 'system', content: 'Você é um assistente útil.' },
      { role: 'user', content: 'Olá, como você está?' }
    ],
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`}
              </div>

              <h3 className="text-lg font-normal mb-2">Exemplo em Python</h3>
              <div className="bg-white/5 p-4 rounded mb-6 font-mono text-sm overflow-x-auto">
                {`import requests

response = requests.post(
    'https://api.agentesdeconversao.com/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SUA_CHAVE_DE_API'
    },
    json={
        'model': 'agent-4',
        'messages': [
            {'role': 'system', 'content': 'Você é um assistente útil.'},
            {'role': 'user', 'content': 'Olá, como você está?'}
        ],
        'temperature': 0.7
    }
)

print(response.json()['choices'][0]['message']['content'])`}
              </div>

              <Link href="/api/examples" className="text-sm underline hover:no-underline flex items-center">
                Ver mais exemplos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
