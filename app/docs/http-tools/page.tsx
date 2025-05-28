import type { Metadata } from "next"
import DocsLayout from "@/components/layout/docs-layout" // Adicionado o import do DocsLayout

export const metadata: Metadata = {
  title: "HTTP Tools | Agentes de Conversão",
  description: "Integre seus agentes com ferramentas externas via HTTP para expandir suas capacidades",
}

export default function HttpToolsPage() {
  return (
    // Adicionado o DocsLayout envolvendo o conteúdo
    <DocsLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-white/90">HTTP Tools</h1>

        <div className="prose max-w-none prose-invert">
          <p className="lead text-white/70 text-lg mb-8">
            As HTTP Tools permitem que você integre seus agentes com serviços externos via requisições HTTP, expandindo
            suas capacidades e permitindo automações complexas.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white/90">Configuração</h2>
          <p className="text-white/70 mb-4">Para configurar uma ferramenta HTTP, você precisa definir:</p>
          <ul className="list-disc pl-5 space-y-1 text-white/70 mb-8">
            <li>Um nome para a ferramenta</li>
            <li>A URL do endpoint</li>
            <li>O método HTTP (GET, POST, PUT, DELETE)</li>
            <li>Os cabeçalhos necessários</li>
            <li>O formato do corpo da requisição (para POST e PUT)</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-6 text-white/90">Exemplo de Configuração</h2>

          <pre className="bg-[#0e0e10] border border-[#27272a] p-4 rounded-lg text-[#46B2E0] text-sm overflow-x-auto mb-8">
            <code>
              {`{
    "name": "weather-api",
    "url": "https://api.weather.com/forecast",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {{env.WEATHER_API_KEY}}",
      "Content-Type": "application/json"
    },
    "query_params": {
      "location": "{{input.location}}",
      "units": "metric"
    }
  }`}
            </code>
          </pre>

          <h2 className="text-2xl font-semibold mb-4 text-white/90">Uso em Agentes</h2>
          <p className="text-white/70 mb-8">
            Uma vez configurada, a ferramenta HTTP pode ser associada a um agente. O agente poderá então utilizar a
            ferramenta quando necessário, com base no contexto da conversa.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white/90">Variáveis</h2>
          <p className="text-white/70 mb-4">Você pode usar variáveis na configuração da ferramenta:</p>
          <ul className="list-disc pl-5 space-y-2 text-white/70">
            <li>
              <code className="bg-[#1a1a1d] text-[#E056A0] px-2 py-1 rounded text-sm">{"{{env.VARIABLE_NAME}}"}</code> - Variáveis de ambiente seguras
            </li>
            <li>
              <code className="bg-[#1a1a1d] text-[#8A53D2] px-2 py-1 rounded text-sm">{"{{input.parameter}}"}</code> - Parâmetros fornecidos pelo agente durante a execução
            </li>
            <li>
              <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm">{"{{context.user_id}}"}</code> - Informações do contexto da conversa
            </li>
          </ul>
        </div>
      </div>
    </DocsLayout>
  )
}
