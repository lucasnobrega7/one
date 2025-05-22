'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';

interface AgentConfig {
  name: string;
  description: string;
  prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  provider: string;
}

export function FirstAgentStep() {
  const { organization } = useAuth();
  const { nextStep, completeStep, updateStepData } = useOnboarding();
  const { toast } = useToast();

  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    prompt: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 500,
    provider: 'openai',
  });
  const [loading, setLoading] = useState(false);
  const [testingAgent, setTestingAgent] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');

  const agentTemplates = [
    {
      id: 'customer-support',
      name: 'Suporte ao Cliente',
      description: 'Agente para atender dúvidas e resolver problemas',
      prompt:
        'Você é um assistente de suporte ao cliente especializado. Seja educado, prestativo e sempre tente resolver os problemas dos usuários de forma eficiente. Quando não souber algo, seja honesto e ofereça alternativas.',
    },
    {
      id: 'sales-assistant',
      name: 'Assistente de Vendas',
      description: 'Agente para auxiliar no processo de vendas',
      prompt:
        'Você é um assistente de vendas especializado em conversão. Ajude os clientes a encontrar soluções adequadas às suas necessidades, esclareça dúvidas sobre produtos e conduza-os naturalmente pelo funil de vendas.',
    },
    {
      id: 'lead-qualifier',
      name: 'Qualificador de Leads',
      description: 'Agente para qualificar e nutrir leads',
      prompt:
        'Você é um especialista em qualificação de leads. Faça perguntas estratégicas para entender as necessidades do cliente, identifique o nível de interesse e classifique o lead conforme seu potencial de conversão.',
    },
  ];

  const handleTemplateSelect = (template: typeof agentTemplates[0]) => {
    setAgentConfig(prev => ({ ...prev, name: template.name, description: template.description, prompt: template.prompt }));
  };

  const testAgent = async () => {
    if (!testMessage.trim()) {
      toast.error('Digite uma mensagem para testar');
      return;
    }
    setTestingAgent(true);
    try {
      const response = await apiClient.chatCompletion(
        [
          { role: 'system', content: agentConfig.prompt },
          { role: 'user', content: testMessage },
        ],
        {
          model: agentConfig.model,
          temperature: agentConfig.temperature,
          max_tokens: agentConfig.max_tokens,
          provider: agentConfig.provider,
        }
      );
      if (response.data?.choices?.[0]?.message?.content) {
        setTestResponse(response.data.choices[0].message.content);
      } else if (response.data?.content) {
        setTestResponse(response.data.content);
      } else {
        toast.error('Erro ao testar agente');
      }
    } catch (error) {
      console.error('Erro ao testar agente:', error);
      toast.error('Erro ao conectar com o serviço de IA');
    } finally {
      setTestingAgent(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!agentConfig.name || !agentConfig.prompt) {
      toast.error('Preencha pelo menos o nome e o prompt do agente');
      return;
    }
    setLoading(true);
    try {
      const agentData = {
        organization_id: organization?.id,
        name: agentConfig.name,
        description: agentConfig.description,
        prompt: agentConfig.prompt,
        model: agentConfig.model,
        temperature: agentConfig.temperature,
        max_tokens: agentConfig.max_tokens,
        provider: agentConfig.provider,
        is_active: true,
        visibility: 'private',
        created_at: new Date().toISOString(),
        is_onboarding: true,
      };
      const response = await apiClient.insertData('agents', agentData);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      const createdAgent = response.data?.[0];
      updateStepData(3, { agent: createdAgent, config: agentConfig });
      if (testMessage && testResponse) {
        await apiClient.insertData('conversations', {
          agent_id: createdAgent?.id,
          organization_id: organization?.id,
          title: 'Teste do Onboarding',
          messages: [
            { role: 'user', content: testMessage, timestamp: new Date().toISOString() },
            { role: 'assistant', content: testResponse, timestamp: new Date().toISOString() },
          ],
          created_at: new Date().toISOString(),
        });
      }
      completeStep(3, { agentId: createdAgent?.id });
      toast.success('Agente criado com sucesso!');
      nextStep();
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      toast.error('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Crie seu primeiro agente</h2>
        <p className="text-gray-600">Escolha um template ou configure do zero</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {agentTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <h3 className="font-semibold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Nome do Agente *</label>
          <Input value={agentConfig.name} onChange={e => setAgentConfig(prev => ({ ...prev, name: e.target.value }))} placeholder="Ex: Assistente de Suporte" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <Input value={agentConfig.description} onChange={e => setAgentConfig(prev => ({ ...prev, description: e.target.value }))} placeholder="Breve descrição do que o agente faz" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prompt do Sistema *</label>
          <Textarea value={agentConfig.prompt} onChange={e => setAgentConfig(prev => ({ ...prev, prompt: e.target.value }))} placeholder="Defina como o agente deve se comportar..." rows={4} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Provedor</label>
            <Select
              value={agentConfig.provider}
              onChange={value => setAgentConfig(prev => ({ ...prev, provider: value }))}
              options={[
                { value: 'openai', label: 'OpenAI' },
                { value: 'anthropic', label: 'Anthropic' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Modelo</label>
            <Select
              value={agentConfig.model}
              onChange={value => setAgentConfig(prev => ({ ...prev, model: value }))}
              options={
                agentConfig.provider === 'openai'
                  ? [
                      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                      { value: 'gpt-4', label: 'GPT-4' },
                      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                    ]
                  : [
                      { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
                      { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                      { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                    ]
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temperatura</label>
            <Input type="number" min="0" max="1" step="0.1" value={agentConfig.temperature} onChange={e => setAgentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))} />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h3 className="font-semibold mb-4">Testar Agente</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mensagem de teste</label>
            <Input value={testMessage} onChange={e => setTestMessage(e.target.value)} placeholder="Digite uma mensagem para testar o agente..." />
          </div>
          <Button onClick={testAgent} loading={testingAgent} disabled={!agentConfig.prompt || testingAgent} variant="outline">
            Testar Agente
          </Button>
          {testResponse && (
            <div className="mt-4 p-4 bg-white rounded border">
              <label className="block text-sm font-medium mb-2">Resposta do agente:</label>
              <p className="text-gray-700">{testResponse}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => nextStep()}>
          Pular por agora
        </Button>
        <Button onClick={handleCreateAgent} disabled={!agentConfig.name || !agentConfig.prompt || loading} loading={loading}>
          Criar Agente
        </Button>
      </div>
    </Card>
  );
}
