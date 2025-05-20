import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API OpenAPI | Documentação",
  description: "Especificação OpenAPI da API Agentes de Conversão",
}

export default function ApiPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API OpenAPI</h1>
      <p className="text-lg text-muted-foreground">
        Esta página contém a especificação OpenAPI completa da API Agentes de Conversão. Você pode usar esta
        especificação para gerar clientes de API em várias linguagens de programação.
      </p>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4">Download da Especificação OpenAPI</h2>
        <p className="mb-4">
          Você pode baixar a especificação OpenAPI completa no formato JSON para usar com ferramentas como Swagger UI,
          Postman, ou geradores de código.
        </p>
        <a
          href="/openapi.json"
          download
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Baixar OpenAPI JSON
        </a>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4">Ferramentas Recomendadas</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <a
              href="https://swagger.io/tools/swagger-ui/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Swagger UI
            </a>{" "}
            - Para visualizar e testar a API interativamente
          </li>
          <li>
            <a
              href="https://www.postman.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Postman
            </a>{" "}
            - Para testar e automatizar chamadas de API
          </li>
          <li>
            <a
              href="https://openapi-generator.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAPI Generator
            </a>{" "}
            - Para gerar clientes de API em várias linguagens
          </li>
        </ul>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4">Exemplo de Uso com OpenAPI Generator</h2>
        <p className="mb-4">
          Você pode gerar um cliente de API para sua linguagem preferida usando o OpenAPI Generator:
        </p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>
            {`# Instalar o OpenAPI Generator CLI
npm install @openapitools/openapi-generator-cli -g

# Gerar um cliente JavaScript
openapi-generator-cli generate -i https://api.agentesdeconversao.com.br/openapi.json -g javascript -o ./client

# Gerar um cliente Python
openapi-generator-cli generate -i https://api.agentesdeconversao.com.br/openapi.json -g python -o ./client

# Gerar um cliente TypeScript
openapi-generator-cli generate -i https://api.agentesdeconversao.com.br/openapi.json -g typescript-fetch -o ./client`}
          </code>
        </pre>
      </div>
    </div>
  )
}
