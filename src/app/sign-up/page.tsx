'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SignupForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.email || !form.password || !form.firstName) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    if (form.password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const signupResponse = await apiClient.signup(form.email, form.password, {
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company,
        source: 'web_signup',
        signup_date: new Date().toISOString(),
      });

      if (signupResponse.error) {
        toast.error(signupResponse.error);
        return;
      }

      const loginResponse = await apiClient.login(form.email, form.password);

      if (loginResponse.error) {
        toast.error('Conta criada, mas erro no login automático');
        router.push('/login');
        return;
      }

      await initializeUserData(signupResponse.data);

      toast.success('Conta criada com sucesso!');
      router.push('/onboarding');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  const initializeUserData = async (userData: any) => {
    try {
      const orgResponse = await apiClient.insertData('organizations', {
        name: `${form.firstName} Workspace`,
        owner_email: form.email,
        plan: 'free',
        created_at: new Date().toISOString(),
        settings: {
          max_agents: 3,
          max_conversations: 1000,
          max_documents: 50,
        },
      });

      if (orgResponse.data) {
        await apiClient.insertData('agents', {
          organization_id: orgResponse.data[0]?.id,
          name: 'Assistente de Boas-vindas',
          description: 'Seu primeiro agente para testar a plataforma',
          prompt: 'Você é um assistente amigável que ajuda novos usuários a entender a plataforma.',
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 500,
          is_active: true,
          visibility: 'private',
          created_at: new Date().toISOString(),
        });

        await apiClient.insertData('usage_stats', {
          organization_id: orgResponse.data[0]?.id,
          period: 'monthly',
          conversations_count: 0,
          messages_count: 0,
          documents_processed: 0,
          api_calls: 0,
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar dados do usuário:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Comece a criar seus agentes de conversão</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <Input type="text" value={form.firstName} onChange={handleChange('firstName')} placeholder="Seu nome" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sobrenome</label>
              <Input type="text" value={form.lastName} onChange={handleChange('lastName')} placeholder="Seu sobrenome" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail *</label>
            <Input type="email" value={form.email} onChange={handleChange('email')} placeholder="seu@email.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Empresa (opcional)</label>
            <Input type="text" value={form.company} onChange={handleChange('company')} placeholder="Nome da sua empresa" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha *</label>
            <Input type="password" value={form.password} onChange={handleChange('password')} placeholder="Mínimo 8 caracteres" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Senha *</label>
            <Input type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="Digite a senha novamente" required />
          </div>

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Criar Conta
          </Button>

          <div className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button type="button" onClick={() => router.push('/login')} className="text-purple-600 hover:underline">
              Fazer login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
