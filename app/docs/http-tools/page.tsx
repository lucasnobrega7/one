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
        <h1 className="text-3xl font-bold mb-6">HTTP Tools</h1>

        <div className="prose max-w-none">
          <p className="lead">
            As HTTP Tools permitem que você integre seus agentes com serviços externos via requisições HTTP, expandindo
            suas capacidades e permitindo automações complexas.
          </p>

          <h2>Configuração</h2>
          <p>Para configurar uma ferramenta HTTP, você precisa definir:</p>
          <ul>
            <li>Um nome para a ferramenta</li>
            <li>A URL do endpoint</li>
            <li>O método HTTP (GET, POST, PUT, DELETE)</li>
            <li>Os cabeçalhos necessários</li>
            <li>O formato do corpo da requisição (para POST e PUT)</li>
          </ul>

          <h2>Exemplo de Configuração</h2>

          <pre className="bg-gray-100 p-4 rounded-md">
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

          <h2>Uso em Agentes</h2>
          <p>
            Uma vez configurada, a ferramenta HTTP pode ser associada a um agente. O agente poderá então utilizar a
            ferramenta quando necessário, com base no contexto da conversa.
          </p>

          <h2>Variáveis</h2>
          <p>Você pode usar variáveis na configuração da ferramenta:</p>
          <ul>
            <li>
              <code>{"{{env.VARIABLE_NAME}}"}</code> - Variáveis de ambiente seguras
            </li>
            <li>
              <code>{"{{input.parameter}}"}</code> - Parâmetros fornecidos pelo agente durante a execução
            </li>
            <li>
              <code>{"{{context.user_id}}"}</code> - Informações do contexto da conversa
            </li>
          </ul>
        </div>
      </div>
    </DocsLayout>
  )
}
