'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DashboardData {
  agents: any[];
  conversations: any[];
  usage_stats: any;
  recent_messages: any[];
}

export default function DashboardPage() {
  const { user, organization } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization?.id) {
      fetchDashboardData();
    }
  }, [organization]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const agentsResponse = await apiClient.queryTable('agents', '*', { organization_id: organization?.id }, 10, { created_at: 'desc' });
      const conversationsResponse = await apiClient.queryTable('conversations', '*', { organization_id: organization?.id }, 5, { created_at: 'desc' });
      const usageResponse = await apiClient.queryTable('usage_stats', '*', { organization_id: organization?.id }, 1, { created_at: 'desc' });
      const messagesResponse = await apiClient.getWhatsAppMessages(5);
      setData({
        agents: agentsResponse.data || [],
        conversations: conversationsResponse.data || [],
        usage_stats: usageResponse.data?.[0] || {},
        recent_messages: messagesResponse.data || [],
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.first_name}! 👋</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao painel da {organization?.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{data?.agents.length || 0}</div>
              <div className="text-sm text-gray-600">Agentes Ativos</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{data?.usage_stats.conversations_count || 0}</div>
              <div className="text-sm text-gray-600">Conversas este mês</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{data?.usage_stats.messages_count || 0}</div>
              <div className="text-sm text-gray-600">Mensagens enviadas</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{organization?.settings?.max_agents - (data?.agents.length || 0)}</div>
              <div className="text-sm text-gray-600">Agentes disponíveis</div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Seus Agentes</h2>
                <Button onClick={() => (window.location.href = '/agents/new')}>Novo Agente</Button>
              </div>
              <div className="space-y-4">
                {data?.agents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span>Modelo: {agent.model}</span>
                        <span className={`px-2 py-1 rounded ${agent.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{agent.is_active ? 'Ativo' : 'Inativo'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => (window.location.href = `/agents/${agent.id}/test`)}>
                        Testar
                      </Button>
                      <Button size="sm" onClick={() => (window.location.href = `/agents/${agent.id}`)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
                {data?.agents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🤖</div>
                    <p>Nenhum agente criado ainda</p>
                    <Button className="mt-4" onClick={() => (window.location.href = '/agents/new')}>
                      Criar primeiro agente
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversas Recentes</h3>
              <div className="space-y-3">
                {data?.conversations.slice(0, 5).map(conversation => (
                  <div key={conversation.id} className="text-sm">
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div className="text-gray-500">{new Date(conversation.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {data?.conversations.length === 0 && <p className="text-gray-500 text-sm">Nenhuma conversa ainda</p>}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">WhatsApp Recente</h3>
              <div className="space-y-3">
                {data?.recent_messages.slice(0, 5).map((message, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="font-medium">{message.from || 'Desconhecido'}</div>
                    <div className="text-gray-600 truncate">{message.body || message.text || 'Mensagem'}</div>
                    <div className="text-xs text-gray-500">{message.timestamp ? new Date(message.timestamp).toLocaleString() : 'Agora'}</div>
                  </div>
                ))}
                {data?.recent_messages.length === 0 && <p className="text-gray-500 text-sm">Nenhuma mensagem ainda</p>}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/agents/new')}>
                  <span className="mr-2">🤖</span>
                  Criar Agente
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/knowledge-base')}>
                  <span className="mr-2">📚</span>
                  Base de Conhecimento
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/integrations')}>
                  <span className="mr-2">🔗</span>
                  Integrações
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/analytics')}>
                  <span className="mr-2">📊</span>
                  Relatórios
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
