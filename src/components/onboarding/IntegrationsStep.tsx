'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/hooks/useToast';

export function IntegrationsStep() {
  const { organization } = useAuth();
  const { completeStep, finishOnboarding } = useOnboarding();
  const { toast } = useToast();

  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [zapStatus, setZapStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testingWhatsapp, setTestingWhatsapp] = useState(false);
  const [testPhone, setTestPhone] = useState('');

  useEffect(() => {
    checkZApiStatus();
    generateWebhookUrl();
  }, []);

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookPath = `/api/webhooks/zapi/${organization?.id}`;
    setWebhookUrl(`${baseUrl}${webhookPath}`);
  };

  const checkZApiStatus = async () => {
    try {
      const response = await apiClient.checkZApiStatus();
      setZapStatus(response.data);
    } catch (error) {
      console.error('Erro ao verificar status Z-API:', error);
    }
  };

  const configureWhatsAppWebhook = async () => {
    setLoading(true);
    try {
      const response = await apiClient.setWhatsAppWebhookUrl(webhookUrl);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      await apiClient.insertData('integrations', {
        organization_id: organization?.id,
        type: 'whatsapp',
        provider: 'zapi',
        webhook_url: webhookUrl,
        is_active: true,
        settings: { auto_reply: true, business_hours: true },
        created_at: new Date().toISOString(),
      });
      toast.success('WhatsApp configurado com sucesso!');
      setWhatsappEnabled(true);
    } catch (error) {
      console.error('Erro ao configurar WhatsApp:', error);
      toast.error('Erro ao configurar WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const testWhatsAppMessage = async () => {
    if (!testPhone) {
      toast.error('Digite um número para teste');
      return;
    }
    setTestingWhatsapp(true);
    try {
      const response = await apiClient.sendWhatsAppMessage(
        testPhone,
        `🎉 Parabéns! Sua integração WhatsApp com Agentes de Conversão está funcionando!\n\nAgora você pode:\n• Receber mensagens automaticamente\n• Responder com seus agentes de IA\n• Acompanhar conversas no dashboard\n\nBem-vindo à automação inteligente!`
      );
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success('Mensagem de teste enviada!');
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setTestingWhatsapp(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      completeStep(5, {
        whatsapp_enabled: whatsappEnabled,
        webhook_url: webhookUrl,
        zap_status: zapStatus,
      });
      await finishOnboarding();
      toast.success('Onboarding concluído com sucesso!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      toast.error('Erro ao finalizar configuração');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Configure suas integrações</h2>
        <p className="text-gray-600">Conecte seus canais de comunicação</p>
      </div>
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">💬</span>
                WhatsApp Business
              </h3>
              <p className="text-sm text-gray-600">Integre com WhatsApp via Z-API</p>
            </div>
            <Switch checked={whatsappEnabled} onChange={setWhatsappEnabled} disabled={!zapStatus?.connected} />
          </div>
          {zapStatus && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <div>
                  Status Z-API:
                  <span className={`ml-1 ${zapStatus.connected ? 'text-green-600' : 'text-red-600'}`}>{zapStatus.connected ? 'Conectado' : 'Desconectado'}</span>
                </div>
                {zapStatus.phone && <div>Número: <span className="font-mono">{zapStatus.phone}</span></div>}
              </div>
            </div>
          )}
          {whatsappEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Webhook URL</label>
                <Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="URL do webhook para receber mensagens" />
                <p className="text-xs text-gray-500 mt-1">Esta URL será configurada no Z-API para receber mensagens</p>
              </div>
              <Button onClick={configureWhatsAppWebhook} loading={loading} disabled={!webhookUrl || loading}>
                Configurar Webhook
              </Button>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Testar Integração</h4>
                <div className="flex gap-2">
                  <Input value={testPhone} onChange={e => setTestPhone(e.target.value)} placeholder="5511999999999" className="flex-1" />
                  <Button onClick={testWhatsAppMessage} loading={testingWhatsapp} disabled={!testPhone || testingWhatsapp} variant="outline">
                    Enviar Teste
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Digite o número com código do país (ex: 5511999999999)</p>
              </div>
            </div>
          )}
        </div>
        <div className="border rounded-lg p-6 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">📧</span>
                Email Integration
              </h3>
              <p className="text-sm text-gray-600">Em breve - Integração com sistemas de email</p>
            </div>
            <Switch disabled />
          </div>
        </div>
        <div className="border rounded-lg p-6 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🌐</span>
                Website Chat
              </h3>
              <p className="text-sm text-gray-600">Em breve - Widget de chat para seu site</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => handleFinishOnboarding()}>Pular integrações</Button>
        <Button onClick={handleFinishOnboarding} loading={loading} disabled={loading}>
          Finalizar Configuração
        </Button>
      </div>
    </Card>
  );
}
