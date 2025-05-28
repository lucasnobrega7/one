export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          
          <h2>1. Informações que Coletamos</h2>
          <p>
            Coletamos informações quando você se cadastra em nosso serviço, incluindo:
          </p>
          <ul>
            <li>Nome e endereço de email</li>
            <li>Informações de perfil do Google (quando usar login social)</li>
            <li>Dados de uso da plataforma</li>
          </ul>

          <h2>2. Como Usamos suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência</li>
            <li>Comunicar atualizações importantes</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>

          <h2>3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, comercializamos ou transferimos suas informações pessoais para terceiros, 
            exceto quando necessário para:
          </p>
          <ul>
            <li>Cumprir obrigações legais</li>
            <li>Proteger nossos direitos e segurança</li>
            <li>Prestar serviços através de parceiros confiáveis</li>
          </ul>

          <h2>4. Segurança</h2>
          <p>
            Implementamos medidas de segurança adequadas para proteger suas informações pessoais 
            contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2>5. Seus Direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Portabilidade de dados</li>
          </ul>

          <h2>6. Contato</h2>
          <p>
            Para questões sobre esta política, entre em contato conosco em:{" "}
            <a href="mailto:lucas@nutralive.com.br" className="text-blue-400 hover:text-blue-300">
              lucas@nutralive.com.br
            </a>
          </p>

          <p className="text-sm text-gray-400 mt-8">
            Última atualização: 28 de maio de 2025
          </p>
        </div>
      </div>
    </div>
  )
}