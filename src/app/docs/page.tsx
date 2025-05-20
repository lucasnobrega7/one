import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visão Geral da API | Documentação",
  description: "Referência completa para a API Agentes de Conversão",
}

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visão Geral da API</h1>
      <p className="text-lg text-muted-foreground">
        A API Agentes de Conversão segue os princípios REST e utiliza JSON para formatar tanto as solicitações quanto as
        respostas. Esta página fornece uma visão geral da estrutura da API e informações comuns a todos os endpoints.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">URL Base</h2>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>https://api.agentesdeconversao.com.br</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Formatos de Resposta</h2>
        <p>
          Todas as respostas são retornadas no formato JSON. Um código de status HTTP adequado é incluído na resposta.
        </p>

        <h3 className="text-xl font-bold">Resposta Bem-sucedida</h3>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "id": "676665cf-61ac-4f0c-b418-f628937eb06f",
  "name": "Agente de Teste",
  "description": "Um agente de teste para verificar a API"
  // Outros campos específicos do recurso
}`}
          </code>
        </pre>

        <h3 className="text-xl font-bold">Resposta de Erro</h3>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "detail": "Mensagem de erro descrevendo o problema"
}`}
          </code>
        </pre>

        <p>ou</p>

        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "detail": [
    {
      "loc": ["body", "campo_faltante"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}`}
          </code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Códigos de Status HTTP</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Código</th>
                <th className="py-2 text-left">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">200</td>
                <td className="py-2">OK - A solicitação foi bem-sucedida</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">201</td>
                <td className="py-2">Created - Um novo recurso foi criado com sucesso</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">400</td>
                <td className="py-2">Bad Request - A solicitação não pôde ser processada devido a erro do cliente</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">401</td>
                <td className="py-2">Unauthorized - Autenticação necessária ou falhou</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">404</td>
                <td className="py-2">Not Found - O recurso solicitado não foi encontrado</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">422</td>
                <td className="py-2">Unprocessable Entity - Erro de validação nos dados enviados</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">500</td>
                <td className="py-2">Internal Server Error - Erro do servidor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Autenticação</h2>
        <p>Todas as solicitações à API devem incluir um cabeçalho de autorização com uma chave de API válida:</p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>Authorization: Bearer sua-api-key</code>
        </pre>
        <p>
          Consulte a{" "}
          <a href="/docs/authentication" className="text-blue-600 hover:underline">
            seção de autenticação
          </a>{" "}
          para mais detalhes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Limitação de Taxa (Rate Limiting)</h2>
        <p>
          Para garantir o desempenho e a disponibilidade, a API implementa limitações de taxa. Os cabeçalhos abaixo são
          incluídos em cada resposta:
        </p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>
            {`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621880400`}
          </code>
        </pre>
        <p>Se você exceder o limite, receberá um erro 429 (Too Many Requests) e precisará aguardar até o reset.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Paginação</h2>
        <p>
          Para endpoints que retornam múltiplos resultados, a paginação é implementada usando os parâmetros de consulta
          `offset` e `limit`:
        </p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>GET /agents?offset=0&limit=10</code>
        </pre>
        <p>As respostas paginadas incluem metadados sobre a paginação:</p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "data": [
    // Itens da página atual
  ],
  "pagination": {
    "total": 45,
    "offset": 0,
    "limit": 10,
    "has_more": true
  }
}`}
          </code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Versionamento da API</h2>
        <p>A versão atual da API é a v1. A versão é especificada no caminho da URL:</p>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>https://api.agentesdeconversao.com.br/v1/agents</code>
        </pre>
        <p>Se não for especificada uma versão, a API utilizará a versão mais recente.</p>
      </section>
    </div>
  )
}
