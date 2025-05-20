import type { Metadata } from "next"
import { ParamField } from "@/components/docs/param-field"
import { ResponseField } from "@/components/docs/response-field"
import { CodeGroup } from "@/components/docs/code-group"

export const metadata: Metadata = {
  title: "Criar Agente | Documentação da API",
  description: "Crie um novo agente de IA customizado",
}

export default function CreateAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Criar Agente</h1>
        <p className="text-lg text-muted-foreground">
          Este endpoint permite criar um novo agente de IA na plataforma Agentes de Conversão. Os agentes são
          assistentes virtuais baseados em grandes modelos de linguagem (LLMs) que podem ser configurados para casos de
          uso específicos.
        </p>
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <span className="font-bold">POST</span>
          <span className="font-mono">/agents</span>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Requisição</h2>

        <ParamField header="Authorization" required>
          O token de autenticação de API no formato `Bearer YOUR_API_KEY`
        </ParamField>

        <h3 className="text-xl font-bold">Corpo da Requisição</h3>

        <ParamField body="name" type="string" required>
          Nome do agente. Deve ser descritivo e único em sua conta.
        </ParamField>

        <ParamField body="description" type="string" required>
          Uma descrição do propósito e capacidades do agente.
        </ParamField>

        <ParamField body="modelName" type="string" default="gpt_4">
          O modelo de linguagem a ser utilizado pelo agente. Opções disponíveis:
          <ul className="ml-6 list-disc">
            <li>`gpt_4` - Melhor qualidade, mais lento</li>
            <li>`gpt_3_5_turbo` - Bom custo-benefício, mais rápido</li>
            <li>`claude_3_opus` - Alta qualidade e compreensão</li>
            <li>`claude_3_sonnet` - Bom equilíbrio entre desempenho e velocidade</li>
          </ul>
        </ParamField>

        <ParamField body="temperature" type="number" default={0.7}>
          Controla a aleatoriedade das respostas. Valores mais baixos resultam em respostas mais determinísticas
          (0.1-0.3), enquanto valores mais altos (0.7-1.0) tornam as respostas mais criativas e variadas.
        </ParamField>

        <ParamField body="systemPrompt" type="string">
          Instrução para definir o comportamento, personalidade e limitações do agente. Este prompt não é visível para o
          usuário final, mas direciona como o agente deve responder.
        </ParamField>

        <ParamField body="userPrompt" type="string">
          Prompt adicional que é anexado a cada consulta do usuário. Pode ser usado para fornecer contexto ou instruções
          adicionais.
        </ParamField>

        <ParamField body="visibility" type="string" default="private">
          Define a visibilidade do agente. Opções:
          <ul className="ml-6 list-disc">
            <li>`private` - Visível apenas para você</li>
            <li>`organization` - Visível para todos os membros da sua organização</li>
            <li>`public` - Visível para todos (se essa funcionalidade estiver habilitada)</li>
          </ul>
        </ParamField>

        <h3 className="text-xl font-bold">Exemplo de Requisição</h3>

        <CodeGroup>
          <pre>
            <code className="language-bash" title="cURL">
              {`curl -X POST "https://api.agentesdeconversao.com.br/agents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Assistente de Suporte Técnico",
    "description": "Um agente especializado em resolver problemas técnicos comuns",
    "modelName": "gpt_4",
    "temperature": 0.5,
    "systemPrompt": "Você é um assistente de suporte técnico especializado. Seu objetivo é ajudar os usuários a resolverem problemas técnicos de maneira clara e eficiente. Evite usar jargões técnicos complexos e forneça instruções passo a passo quando possível.",
    "visibility": "organization"
  }'`}
            </code>
          </pre>
          <pre>
            <code className="language-javascript" title="Node.js">
              {`const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.agentesdeconversao.com.br';

async function createAgent() {
  try {
    const response = await axios.post(\`\${BASE_URL}/agents\`, {
      name: "Assistente de Suporte Técnico",
      description: "Um agente especializado em resolver problemas técnicos comuns",
      modelName: "gpt_4",
      temperature: 0.5,
      systemPrompt: "Você é um assistente de suporte técnico especializado. Seu objetivo é ajudar os usuários a resolverem problemas técnicos de maneira clara e eficiente. Evite usar jargões técnicos complexos e forneça instruções passo a passo quando possível.",
      visibility: "organization"
    }, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Agente criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agente:', error.response ? error.response.data : error.message);
    throw error;
  }
}

createAgent();`}
            </code>
          </pre>
          <pre>
            <code className="language-python" title="Python">
              {`import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.agentesdeconversao.com.br'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

data = {
    "name": "Assistente de Suporte Técnico",
    "description": "Um agente especializado em resolver problemas técnicos comuns",
    "modelName": "gpt_4",
    "temperature": 0.5,
    "systemPrompt": "Você é um assistente de suporte técnico especializado. Seu objetivo é ajudar os usuários a resolverem problemas técnicos de maneira clara e eficiente. Evite usar jargões técnicos complexos e forneça instruções passo a passo quando possível.",
    "visibility": "organization"
}

response = requests.post(f'{BASE_URL}/agents', json=data, headers=headers)

if response.status_code == 200:
    print(f'Agente criado: {response.json()}')
else:
    print(f'Erro: {response.status_code}')
    print(response.json())`}
            </code>
          </pre>
        </CodeGroup>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Resposta</h2>

        <ResponseField name="id" type="string">
          Identificador único do agente criado.
        </ResponseField>

        <ResponseField name="name" type="string">
          Nome do agente.
        </ResponseField>

        <ResponseField name="description" type="string">
          Descrição do agente.
        </ResponseField>

        <ResponseField name="modelName" type="string">
          Modelo de linguagem utilizado.
        </ResponseField>

        <ResponseField name="temperature" type="number">
          Valor de temperatura configurado.
        </ResponseField>

        <ResponseField name="systemPrompt" type="string">
          Prompt de sistema configurado.
        </ResponseField>

        <ResponseField name="userPrompt" type="string">
          Prompt de usuário configurado.
        </ResponseField>

        <ResponseField name="visibility" type="string">
          Visibilidade do agente.
        </ResponseField>

        <h3 className="text-xl font-bold">Exemplo de Resposta</h3>

        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <code className="language-json">
            {`{
  "id": "676665cf-61ac-4f0c-b418-f628937eb06f",
  "name": "Assistente de Suporte Técnico",
  "description": "Um agente especializado em resolver problemas técnicos comuns",
  "modelName": "gpt_4",
  "temperature": 0.5,
  "systemPrompt": "Você é um assistente de suporte técnico especializado. Seu objetivo é ajudar os usuários a resolverem problemas técnicos de maneira clara e eficiente. Evite usar jargões técnicos complexos e forneça instruções passo a passo quando possível.",
  "userPrompt": null,
  "visibility": "organization"
}`}
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
                <td className="py-2">O agente foi criado com sucesso</td>
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
          <li>
            Um agente pode ser criado mesmo sem ter um datastore associado inicialmente. Datastores podem ser vinculados
            posteriormente.
          </li>
          <li>O `systemPrompt` é muito importante para definir a personalidade e o comportamento do agente.</li>
          <li>Escolha o `modelName` com base em suas necessidades de qualidade, velocidade e custo.</li>
          <li>Recomendamos usar `temperature` entre 0.3 e 0.7 para a maioria dos casos de uso.</li>
        </ul>
      </section>
    </div>
  )
}
