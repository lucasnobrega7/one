'use client'

import { ConversationFlow } from '@/components/visual/ConversationVisuals'
import { AIHexagons } from '@/components/visual/GeometricPatterns'
import { AnimatedMetrics } from '@/components/visual/ConversionMetrics'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

export function VisualDemo() {
  return (
    <section className="py-24 bg-ac-surface-base relative overflow-hidden">
      {/* Elementos geométricos de fundo */}
      <AIHexagons />
      
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 text-ac-white">
            Como funciona a conversão
          </h2>
          <p className="text-xl text-ac-gray-300 max-w-3xl mx-auto">
            Veja como nossos agentes transformam visitantes em clientes através de um processo inteligente e automatizado
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mb-16">
          <ConversationFlow />
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <AnimatedMetrics />
        </ScrollReveal>
      </div>
    </section>
  )
}