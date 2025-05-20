import type { Metadata } from "next"
import { ParamField } from "@/src/components/docs/param-field"
import { ResponseField } from "@/src/components/docs/response-field"
import { Expandable } from "@/src/components/docs/expandable"
import { CodeGroup } from "@/src/components/docs/code-group"

export const metadata: Metadata = {
  title: "Consultar Agente | Documentação da API",
  description: "Faça perguntas a um agente de IA e obtenha respostas",
}

export default function QueryAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Consultar Agente</h1>
        <p className="text-lg text-muted-foreground">
          Este endpoint permite enviar uma consulta (pergunta) para um agente específico e receber uma resposta gerada
          pelo modelo de IA. O agente utilizará o conhecimento das bases de dados associadas e suas configurações de
          personalidade para fornecer a resposta mais relevante.
        </p>
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <span className="font-bold">POST</span>
          <span className="font-mono">/agents/{"{agent_id}"}/query</span>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Requisição</h2>

        <ParamField path="agent_id" type="string" required>
          O identificador único do agente que você deseja consultar.
        </ParamField>

        <ParamField header="Authorization" required>
          O token de autenticação de API no formato `Bearer YOUR_API_KEY`
        </ParamField>

        <h3 className="text-xl font-bold">Corpo da Requisição</h3>

        <ParamField body="query" type="string" required>
          A pergunta ou instrução que você deseja enviar ao agente.
        </ParamField>

        <ParamField body="conversationId" type="string">
          Identificador de uma conversa existente. Se fornecido, a consulta será adicionada a essa conversa, permitindo
          que o agente mantenha o contexto das interações anteriores. Se omitido, uma nova conversa será criada.
        </ParamField>

        <ParamField body="visitorId" type="string">
          Identificador único do visitante/usuário que está fazendo a pergunta. Útil para rastrear diferentes usuários
          em análises.
        </ParamField>

        <ParamField body="temperature" type="number">
          Sobrescreve temporariamente a temperatura configurada no agente para esta consulta específica.
        </ParamField>

        <ParamField body="streaming" type="boolean" default={false}>
          Se definido como `true`, a resposta será enviada como um stream de eventos usando Server-Sent Events (SSE).
          Útil para exibir respostas sendo geradas em tempo real.
        </ParamField>

        <ParamField body="modelName" type="string">
          Sobrescreve temporariamente o modelo de linguagem configurado no agente para esta consulta específica.
        </ParamField>

        <ParamField body="maxTokens" type="integer">
          Limita o número máximo de tokens na resposta gerada. Útil para controlar o tamanho das respostas.
        </ParamField>

        <ParamField body="filters" type="object">
          Filtros adicionais para limitar as fontes de conhecimento usadas para responder à consulta.
          <pre className="mt-2 rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">
            <code className="language-json">
              {`{
  "datasource_ids": ["ds-123", "ds-456"],
  "metadata": {
    "category": "technical",
    "date": { "after": "2023-01-01" }
  }
}`}
            </code>
          </pre>
        </ParamField>

        <ParamField body="systemPrompt" type="string">
          Sobrescreve temporariamente o prompt de sistema do agente para esta consulta específica.
        </ParamField>

        <ParamField body="userPrompt" type="string">
          Sobrescreve temporariamente o prompt de usuário do agente para esta consulta específica.
        </ParamField>

        <h3 className="text-xl font-bold">Exemplo de Requisição</h3>

        <CodeGroup>
          <pre>
            <code className="language-bash" title="cURL">
              {`curl -X POST "https://api.agentesdeconversao.com.br/agents/676665cf-61ac-4f0c-b418-f628937eb06f/query" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "O que é a plataforma Agentes de Conversão?",
    "temperature": 0.3
  }'`}
            </code>
          </pre>
          <pre>
            <code className="language-javascript" title="Node.js">
              {`const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.agentesdeconversao.com.br';
const AGENT_ID = '676665cf-61ac-4f0c-b418-f628937eb06f';

async function queryAgent() {
  try {
    const response = await axios.post(\`\${BASE_URL}/agents/\${AGENT_ID}/query\`, {
      query: "O que é a plataforma Agentes de Conversão?",
      temperature: 0.3
    }, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resposta do agente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar agente:', error.response ? error.response.data : error.message);
    throw error;
  }
}

queryAgent();`}
            </code>
          </pre>
          <pre>
            <code className="language-python" title="Python">
              {`import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.agentesdeconversao.com.br'
AGENT_ID = '676665cf-61ac-4f0c-b418-f628937eb06f'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

data = {
    "query": "O que é a plataforma Agentes de Conversão?",
    "temperature": 0.3
}

response = requests.post(f'{BASE_URL}/agents/{AGENT_ID}/query', json=data, headers=headers)

if response.status_code == 200:
    print(f'Resposta do agente: {response.json()}')
else:
    print(f'Erro: {response.status_code}')
    print(response.json())`}
            </code>
          </pre>
        </CodeGroup>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Resposta</h2>

        <ResponseField name="answer" type="string">
          A resposta gerada pelo agente para a consulta feita.
        </ResponseField>

        <ResponseField name="conversationId" type="string">
          O identificador da conversa. Se um `conversationId` foi fornecido na requisição, será o mesmo valor. Caso
          contrário, será um novo ID gerado.
        </ResponseField>

        <ResponseField name="visitorId" type="string">
          O identificador do visitante. Se um `visitorId` foi fornecido na requisição, será o mesmo valor. Caso
          contrário, será um novo ID gerado.
        </ResponseField>

        <ResponseField name="sources" type="array">
          Uma lista de fontes de conhecimento utilizadas para gerar a resposta. Cada fonte contém as seguintes
          informações:
          <Expandable title="Propriedades de cada fonte">
            <ResponseField name="text" type="string">
              O trecho de texto da fonte que foi utilizado.
            </ResponseField>

            <ResponseField name="score" type="number">
              A pontuação de relevância (0 a 1) desta fonte para a consulta.
            </ResponseField>

            <ResponseField name="source" type="string">
              A URL ou referência da fonte original.
            </ResponseField>

            <ResponseField name="datasource_id" type="string">
              O ID da fonte de dados à qual este trecho pertence.
            </ResponseField>

            <ResponseField name="datasource_name" type="string">
              O nome da fonte de dados à qual este trecho pertence.
            </ResponseField>
          </Expandable>
        </ResponseField>

        <h3 className="text-xl font-bold">Exemplo de Resposta</h3>

        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "answer": "A plataforma Agentes de Conversão é uma solução para criar assistentes de IA personalizados que são alimentados pelos seus próprios dados. Ela permite que você crie chatbots inteligentes que podem responder perguntas com base nas informações da sua empresa ou organização, e que podem ser integrados a sites, aplicativos ou outras plataformas. A plataforma utiliza grandes modelos de linguagem (LLMs) para gerar respostas naturais e contextuais, combinando-os com sua base de conhecimento personalizada.",
  "conversationId": "e210f0c7-74ab-42bb-a824-c42fb9c51e67",
  "visitorId": "2053a92c-bd65-4246-a711-5a1c399481fb",
  "sources": [
    {
      "text": "Agentes de Conversão é uma plataforma para criar assistentes de IA personalizados alimentados por seus próprios dados. A plataforma permite criar chatbots inteligentes que podem ser integrados a sites, aplicativos ou outras plataformas.",
      "score": 0.95,
      "source": "https://exemplo.com/pagina",
      "datasource_id": "ds123",
      "datasource_name": "Documentação"
    }
  ]
}`}
          </code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Streaming de Respostas</h2>
        <p>
          Quando o parâmetro `streaming` é definido como `true`, a resposta é transmitida como um stream de eventos SSE
          (Server-Sent Events). Cada evento contém um fragmento da resposta sendo gerada em tempo real.
        </p>

        <CodeGroup>
          <pre>
            <code className="language-javascript" title="Node.js - Consumindo stream">
              {`const fetch = require('node-fetch');

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.agentesdeconversao.com.br';
const AGENT_ID = '676665cf-61ac-4f0c-b418-f628937eb06f';

async function streamingQuery() {
  const response = await fetch(\`\${BASE_URL}/agents/\${AGENT_ID}/query\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      query: "O que é a plataforma Agentes de Conversão?",
      streaming: true
    })
  });

  if (!response.ok) {
    throw new Error(\`Erro: \${response.status}\`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    // Processa os eventos no buffer
    const lines = buffer.split('\\n\\n');
    buffer = lines.pop(); // Mantém o fragmento incompleto
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonData = line.substring(6); // Remove 'data: '
        
        try {
          const data = JSON.parse(jsonData);
          
          if (data.type === 'answer_part') {
            process.stdout.write(data.answer); // Exibe o fragmento
          } else if (data.type === 'answer_end') {
            console.log('\\nResposta completa recebida');
            console.log('Fontes:', data.sources);
          }
        } catch (e) {
          console.error('Erro ao analisar JSON:', e);
        }
      }
    }
  }
}

streamingQuery().catch(console.error);`}
            </code>
          </pre>
        </CodeGroup>

        <h3 className="text-xl font-bold">Formato dos eventos de streaming</h3>

        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code>
            {`data: {"type":"answer_part","answer":"A plataforma Agentes de Conversão "}

data: {"type":"answer_part","answer":"é uma solução para criar "}

data: {"type":"answer_end","answer":"assistentes de IA personalizados.","sources":[...]}`}
          </code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Códigos de Resposta</h2>
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
                <td className="py-2">A consulta foi processada com sucesso</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">400</td>
                <td className="py-2">Dados de requisição inválidos</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">401</td>
                <td className="py-2">Não autorizado - Autenticação necessária</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">404</td>
                <td className="py-2">Agente não encontrado</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">422</td>
                <td className="py-2">Erro de validação - Verifique os parâmetros enviados</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">500</td>
                <td className="py-2">Erro interno do servidor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Observações</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>A qualidade da resposta depende muito da qualidade dos dados nos datastores conectados ao agente.</li>
          <li>
            Para perguntas que exigem interações em vários turnos, use o mesmo `conversationId` para manter o contexto.
          </li>
          <li>O uso do streaming (`streaming: true`) é recomendado para interfaces de usuário em tempo real.</li>
          <li>
            As fontes retornadas (`sources`) são úteis para mostrar ao usuário de onde a informação foi obtida e para
            verificar a precisão.
          </li>
          <li>Utilize os filtros para direcionar o agente para fontes específicas quando necessário.</li>
        </ul>
      </section>
    </div>
  )
}
