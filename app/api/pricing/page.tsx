import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

export default function ApiPricingPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-normal mb-8">Preços simples e transparentes</h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Escolha o plano que melhor atende às suas necessidades. Pague apenas pelo que usar, sem taxas ocultas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="border border-white/10 p-8">
            <h2 className="text-2xl font-normal mb-2">Gratuito</h2>
            <p className="text-white/70 mb-6">Para experimentação e projetos pessoais</p>
            <div className="text-4xl font-normal mb-6">$0</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Acesso ao modelo agent-3.5</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>1.000 tokens por dia</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>10 requisições por minuto</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Suporte via comunidade</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block text-center border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Começar grátis
            </Link>
          </div>

          <div className="border border-white p-8 bg-white/5">
            <div className="inline-block bg-white text-black text-xs px-2 py-1 mb-4">POPULAR</div>
            <h2 className="text-2xl font-normal mb-2">Pro</h2>
            <p className="text-white/70 mb-6">Para desenvolvedores e pequenas empresas</p>
            <div className="text-4xl font-normal mb-6">
              $29<span className="text-lg">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Acesso aos modelos agent-3.5 e agent-4</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>100.000 tokens por mês</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>60 requisições por minuto</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Suporte por email</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Acesso a embeddings e geração de imagens</span>
              </li>
            </ul>
            <Link
              href="/signup?plan=pro"
              className="block text-center bg-white text-black py-2 px-4 hover:bg-white/90 transition-colors"
            >
              Escolher plano Pro
            </Link>
          </div>

          <div className="border border-white/10 p-8">
            <h2 className="text-2xl font-normal mb-2">Empresarial</h2>
            <p className="text-white/70 mb-6">Para empresas com necessidades avançadas</p>
            <div className="text-4xl font-normal mb-6">Personalizado</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Acesso a todos os modelos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Volume de tokens personalizado</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Taxa de requisições personalizada</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Suporte prioritário</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>SLA garantido</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                <span>Modelos fine-tuned personalizados</span>
              </li>
            </ul>
            <Link
              href="/contact-sales"
              className="block text-center border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Falar com vendas
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-normal mb-8 text-center">Preços por modelo</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left">Modelo</th>
                  <th className="py-4 px-6 text-left">Uso</th>
                  <th className="py-4 px-6 text-left">Preço (por 1K tokens)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">agent-4</td>
                  <td className="py-4 px-6">Input</td>
                  <td className="py-4 px-6">$0.03</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">agent-4</td>
                  <td className="py-4 px-6">Output</td>
                  <td className="py-4 px-6">$0.06</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">agent-3.5</td>
                  <td className="py-4 px-6">Input</td>
                  <td className="py-4 px-6">$0.001</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">agent-3.5</td>
                  <td className="py-4 px-6">Output</td>
                  <td className="py-4 px-6">$0.002</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">embed-3</td>
                  <td className="py-4 px-6">Input</td>
                  <td className="py-4 px-6">$0.0001</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">image-2</td>
                  <td className="py-4 px-6">1024x1024</td>
                  <td className="py-4 px-6">$0.02 por imagem</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-white/70 mt-6 text-sm">
            * Os preços são em dólares americanos (USD). Tokens adicionais além do limite do plano são cobrados de
            acordo com a tabela acima.
          </p>
        </div>

        <div className="mt-20 border border-white/10 p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-normal mb-4 text-center">Ainda tem dúvidas?</h2>
          <p className="text-center mb-6">
            Entre em contato com nossa equipe para obter mais informações sobre nossos planos e preços.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Falar com nossa equipe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
