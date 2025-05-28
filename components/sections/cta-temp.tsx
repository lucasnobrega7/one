import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-8">
          Pronto para Começar?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Crie seu primeiro agente IA em minutos
        </p>
        <Button 
          asChild
          size="lg" 
          className="bg-gradient-to-r from-[#39ff14] to-green-500 hover:from-green-400 hover:to-[#39ff14] text-black font-bold px-8 py-4 text-lg"
        >
          <a href="https://login.agentesdeconversao.ai/signup">
            Começar Agora
          </a>
        </Button>
      </div>
    </section>
  )
}