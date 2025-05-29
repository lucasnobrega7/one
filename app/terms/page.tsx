import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | Agentes de Conversão',
  description: 'Termos de Uso da Agentes de Conversão - Condições para uso da plataforma.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Termos de Uso
            </h1>
            
            <div className="prose max-w-none space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-gray-600">
                  Ao acessar e usar a plataforma <strong>Agentes de Conversão</strong>, você concorda 
                  em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com 
                  qualquer parte destes termos, não deve usar nossos serviços.
                </p>
                <p className="text-gray-600">
                  <strong>Última atualização:</strong> 29 de maio de 2025
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. Descrição do Serviço
                </h2>
                <p className="text-gray-600">
                  A Agentes de Conversão fornece uma plataforma de automação de vendas baseada 
                  em inteligência artificial que permite aos usuários criar, configurar e 
                  gerenciar agentes virtuais para interação com clientes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Registro e Conta
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Você deve fornecer informações precisas e atualizadas</li>
                  <li>É responsável por manter a segurança de sua conta</li>
                  <li>Deve ter pelo menos 18 anos para usar nossos serviços</li>
                  <li>Não deve compartilhar suas credenciais de acesso</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  4. Uso Aceitável
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-2">4.1 Você pode:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Usar a plataforma para fins comerciais legítimos</li>
                  <li>Criar agentes para seu próprio negócio</li>
                  <li>Integrar com suas ferramentas de marketing</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">4.2 Você não pode:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Usar para atividades ilegais ou fraudulentas</li>
                  <li>Fazer engenharia reversa da plataforma</li>
                  <li>Transmitir malware ou código malicioso</li>
                  <li>Spam ou comunicações não solicitadas</li>
                  <li>Violar direitos de propriedade intelectual</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Pagamentos e Cobrança
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Os preços estão sujeitos a alterações com aviso prévio</li>
                  <li>Pagamentos são processados através de provedores terceiros</li>
                  <li>Reembolsos seguem nossa política específica</li>
                  <li>Taxas em atraso podem ser aplicadas</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  6. Propriedade Intelectual
                </h2>
                <p className="text-gray-600">
                  Todos os direitos, títulos e interesses na plataforma Agentes de Conversão, 
                  incluindo software, design, texto, gráficos e outras funcionalidades são 
                  propriedade exclusiva da empresa.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Integração com Terceiros
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-2">7.1 Serviços Integrados:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Google OAuth para autenticação</li>
                  <li>OpenAI/OpenRouter para processamento de IA</li>
                  <li>WhatsApp para comunicação</li>
                  <li>Processadores de pagamento</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  O uso destes serviços está sujeito aos seus respectivos termos de uso.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  8. Limitações de Responsabilidade
                </h2>
                <p className="text-gray-600">
                  Em nenhuma circunstância seremos responsáveis por danos indiretos, 
                  incidentais, especiais ou consequenciais resultantes do uso ou 
                  impossibilidade de uso dos nossos serviços.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Disponibilidade do Serviço
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Esforçamo-nos para manter alta disponibilidade</li>
                  <li>Manutenção programada será comunicada antecipadamente</li>
                  <li>Não garantimos tempo de atividade de 100%</li>
                  <li>Problemas técnicos podem ocorrer ocasionalmente</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  10. Suspensão e Rescisão
                </h2>
                <p className="text-gray-600">
                  Podemos suspender ou encerrar sua conta por violação destes termos, 
                  atividade suspeita, ou outros motivos que consideremos apropriados.
                </p>
                <p className="text-gray-600 mt-2">
                  Você pode cancelar sua conta a qualquer momento através das 
                  configurações da plataforma.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  11. Modificações dos Termos
                </h2>
                <p className="text-gray-600">
                  Reservamos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão comunicadas com pelo menos 30 dias 
                  de antecedência.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  12. Lei Aplicável
                </h2>
                <p className="text-gray-600">
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa 
                  será resolvida no foro da comarca de São Paulo, SP.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  13. Contato
                </h2>
                <p className="text-gray-600">
                  Para questões sobre estes Termos de Uso:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-600">
                    <strong>Email:</strong> legal@agentesdeconversao.ai<br/>
                    <strong>Suporte:</strong> support@agentesdeconversao.ai<br/>
                    <strong>Website:</strong> https://agentesdeconversao.ai
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="text-blue-800">
                  <strong>Importante:</strong> Ao continuar usando nossos serviços após 
                  qualquer modificação destes termos, você concorda com os novos termos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}