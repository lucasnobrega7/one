import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Agentes de Conversão',
  description: 'Política de Privacidade da Agentes de Conversão - Como coletamos, usamos e protegemos seus dados.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Política de Privacidade
            </h1>
            
            <div className="prose max-w-none space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Informações Gerais
                </h2>
                <p className="text-gray-600">
                  Esta Política de Privacidade descreve como a <strong>Agentes de Conversão</strong> 
                  (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) coleta, usa e protege as informações 
                  pessoais dos usuários (&quot;você&quot; ou &quot;usuário&quot;) de nossos serviços.
                </p>
                <p className="text-gray-600">
                  <strong>Última atualização:</strong> 29 de maio de 2025
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. Informações que Coletamos
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-2">2.1 Informações fornecidas por você:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Nome, email e informações de contato</li>
                  <li>Informações de pagamento (processadas através de provedores seguros)</li>
                  <li>Preferências de configuração da aplicação</li>
                  <li>Conteúdo gerado pelos agentes de IA</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">2.2 Informações coletadas automaticamente:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Dados de uso da plataforma</li>
                  <li>Logs de interação com os agentes</li>
                  <li>Informações do dispositivo e navegador</li>
                  <li>Endereço IP e dados de localização geográfica</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Como Usamos suas Informações
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar pagamentos e gerenciar contas</li>
                  <li>Personalizar a experiência do usuário</li>
                  <li>Enviar comunicações importantes sobre o serviço</li>
                  <li>Garantir a segurança da plataforma</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  4. Integração com Serviços de Terceiros
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-2">4.1 Google OAuth:</h3>
                <p className="text-gray-600">
                  Utilizamos o Google OAuth para autenticação segura. Quando você se conecta com o Google:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                  <li>Acessamos apenas informações básicas do perfil (nome, email, foto)</li>
                  <li>Não armazenamos suas credenciais do Google</li>
                  <li>Você pode revogar o acesso a qualquer momento nas configurações do Google</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">4.2 OpenAI/OpenRouter:</h3>
                <p className="text-gray-600">
                  Utilizamos APIs de IA para processar conversas. Os dados são processados conforme 
                  as políticas de privacidade desses provedores, com criptografia em trânsito.
                </p>

                <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">4.3 WhatsApp Integration:</h3>
                <p className="text-gray-600">
                  Para integração com WhatsApp, processamos números de telefone e mensagens 
                  conforme necessário para o funcionamento do serviço.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Compartilhamento de Informações
                </h2>
                <p className="text-gray-600 mb-2">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais, exceto:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Com provedores de serviços essenciais (processamento de pagamento, hospedagem)</li>
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Para proteger nossos direitos legítimos</li>
                  <li>Com seu consentimento explícito</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Segurança dos Dados
                </h2>
                <p className="text-gray-600">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger 
                  suas informações:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                  <li>Criptografia SSL/TLS para transmissão de dados</li>
                  <li>Autenticação multifator</li>
                  <li>Controle de acesso restrito</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups seguros e regulares</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Seus Direitos (LGPD)
                </h2>
                <p className="text-gray-600 mb-2">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a exclusão de dados desnecessários</li>
                  <li>Revogar consentimento</li>
                  <li>Portabilidade dos dados</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  Para exercer esses direitos, entre em contato: <strong>privacy@agentesdeconversao.ai</strong>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  8. Retenção de Dados
                </h2>
                <p className="text-gray-600">
                  Mantemos seus dados pessoais apenas pelo tempo necessário para:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                  <li>Fornecer nossos serviços</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Resolver disputas</li>
                  <li>Fazer cumprir nossos acordos</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Cookies e Tecnologias Similares
                </h2>
                <p className="text-gray-600">
                  Utilizamos cookies e tecnologias similares para:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                  <li>Manter você logado na plataforma</li>
                  <li>Lembrar suas preferências</li>
                  <li>Analisar o uso da plataforma</li>
                  <li>Melhorar a experiência do usuário</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  10. Alterações nesta Política
                </h2>
                <p className="text-gray-600">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                  sobre mudanças significativas por email ou através da plataforma.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  11. Contato
                </h2>
                <p className="text-gray-600">
                  Para questões sobre esta Política de Privacidade ou práticas de dados:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-600">
                    <strong>Email:</strong> privacy@agentesdeconversao.ai<br/>
                    <strong>Suporte:</strong> support@agentesdeconversao.ai<br/>
                    <strong>Website:</strong> https://agentesdeconversao.ai
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="text-blue-800">
                  <strong>Compromisso:</strong> Estamos comprometidos em proteger sua privacidade 
                  e garantir transparência no tratamento de seus dados pessoais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}