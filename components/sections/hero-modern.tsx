"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#39ff14]/20 to-green-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-40 right-16 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-[#39ff14]/20 rounded-full blur-2xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <Badge 
          variant="outline" 
          className="mb-8 px-4 py-2 border-[#39ff14]/30 bg-[#39ff14]/10 text-[#39ff14] hover:bg-[#39ff14]/20 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          87% Margem Líquida + 300 Modelos IA
        </Badge>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Impactful design,
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#39ff14] via-green-400 to-emerald-300 bg-clip-text text-transparent">
            created effortlessly
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Crie agentes IA que convertem visitantes em clientes. Sistema completo com 
          <span className="text-[#39ff14] font-semibold"> 300+ modelos</span>, 
          <span className="text-[#39ff14] font-semibold"> 87% margem</span> e 
          <span className="text-[#39ff14] font-semibold"> FlowBuilder visual</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button 
            asChild
            size="lg" 
            className="bg-gradient-to-r from-[#39ff14] to-green-500 hover:from-green-400 hover:to-[#39ff14] text-black font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)]"
          >
            <Link href="https://dash.agentesdeconversao.ai" className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-300"
          >
            <Link href="https://docs.agentesdeconversao.ai">
              Ver Documentação
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-[#39ff14]">87%</div>
            <div className="text-gray-400">Margem Líquida</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-[#39ff14]">300+</div>
            <div className="text-gray-400">Modelos IA</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-[#39ff14]">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
}