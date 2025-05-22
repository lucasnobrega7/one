import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ApiExamplesPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-normal mb-8">Exemplos da API</h1>
          <p className="text-xl mb-8">
            Explore exemplos práticos de como usar a API de Agentes de Conversão para diferentes tarefas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="border border-white/10 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h2 className="text-2xl font-normal mb-4">Chatbot simples</h2>
            <p className="text-white/70 mb-6">
              Crie um chatbot básico que responde a perguntas dos usuários usando o modelo agent-4.
            </p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para um chatbot simples
const messages = [
  { role: 'system', content: 'Você é um assistente útil.' },
  { role: 'user', content: 'Quais são os benefícios da IA?' }
];

const response = await fetch('https://api.agentesdeconversao.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'agent-4',
    messages: messages,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`}
            </div>
            <Link href="/api/examples/chatbot" className="text-sm underline hover:no-underline flex items-center">
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10">
            <h2 className="text-2xl font-normal mb-4">Geração de texto</h2>
            <p className="text-white/70 mb-6">
              Gere textos criativos como poemas, histórias ou artigos com base em um prompt.
            </p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para geração de texto
const response = await fetch('https://api.agentesdeconversao.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'agent-4',
    prompt: 'Escreva um poema curto sobre a natureza',
    max_tokens: 150,
    temperature: 0.8
  })
});

const data = await response.json();
console.log(data.choices[0].text);`}
            </div>
            <Link
              href="/api/examples/text-generation"
              className="text-sm underline hover:no-underline flex items-center"
            >
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <h2 className="text-2xl font-normal mb-4">Busca semântica</h2>
            <p className="text-white/70 mb-6">Implemente busca semântica em documentos usando embeddings.</p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para busca semântica
// 1. Crie embeddings para seus documentos
const response = await fetch('https://api.agentesdeconversao.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'embed-3',
    input: 'Texto do documento para indexar'
  })
});

const data = await response.json();
const documentEmbedding = data.data[0].embedding;

// 2. Armazene os embeddings em seu banco de dados
// ...

// 3. Para buscar, crie um embedding da consulta e compare
// ...`}
            </div>
            <Link
              href="/api/examples/semantic-search"
              className="text-sm underline hover:no-underline flex items-center"
            >
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 p-6 bg-gradient-to-br from-pink-500/10 to-red-500/10">
            <h2 className="text-2xl font-normal mb-4">Geração de imagens</h2>
            <p className="text-white/70 mb-6">Gere imagens a partir de descrições textuais.</p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para geração de imagens
const response = await fetch('https://api.agentesdeconversao.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'image-2',
    prompt: 'Um gato astronauta flutuando no espaço, estilo digital art',
    n: 1,
    size: '1024x1024'
  })
});

const data = await response.json();
console.log(data.data[0].url);`}
            </div>
            <Link
              href="/api/examples/image-generation"
              className="text-sm underline hover:no-underline flex items-center"
            >
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
            <h2 className="text-2xl font-normal mb-4">Classificação de texto</h2>
            <p className="text-white/70 mb-6">Classifique textos em categorias predefinidas.</p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para classificação de texto
const response = await fetch('https://api.agentesdeconversao.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'agent-4',
    messages: [
      { 
        role: 'system', 
        content: 'Você é um classificador de texto. Classifique o texto em uma das seguintes categorias: Esportes, Política, Tecnologia, Entretenimento. Responda apenas com o nome da categoria.' 
      },
      { 
        role: 'user', 
        content: 'A Apple lançou seu novo iPhone com recursos de IA avançados.' 
      }
    ],
    temperature: 0.3
  })
});

const data = await response.json();
console.log(data.choices[0].message.content); // Deve retornar "Tecnologia"`}
            </div>
            <Link
              href="/api/examples/text-classification"
              className="text-sm underline hover:no-underline flex items-center"
            >
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 p-6 bg-gradient-to-br from-teal-500/10 to-green-500/10">
            <h2 className="text-2xl font-normal mb-4">Resumo de documentos</h2>
            <p className="text-white/70 mb-6">Crie resumos concisos de textos longos.</p>
            <div className="bg-black/50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
              {`// Exemplo de código para resumo de documentos
const response = await fetch('https://api.agentesdeconversao.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE_DE_API'
  },
  body: JSON.stringify({
    model: 'agent-4',
    messages: [
      { 
        role: 'system', 
        content: 'Você é um assistente especializado em criar resumos concisos. Resuma o texto fornecido em no máximo 3 frases.' 
      },
      { 
        role: 'user', 
        content: 'Texto longo para resumir...' 
      }
    ],
    temperature: 0.5
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`}
            </div>
            <Link
              href="/api/examples/document-summarization"
              className="text-sm underline hover:no-underline flex items-center"
            >
              Ver exemplo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
