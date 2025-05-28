import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-modern'
import { Features } from '@/components/sections/features-temp'
import { CTASection } from '@/components/sections/cta-temp'
import { Footer } from '@/components/sections/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <Features />
        <CTASection />
        <Footer />
      </Suspense>
    </main>
  )
}