import { HeroSection } from '@/components/sections/hero'
import { FeaturesGrid } from '@/components/sections/features-grid'
import { VisualDemo } from '@/components/sections/VisualDemo'
import { CtaSection } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'
import { Navigation } from '@/components/layout/navigation'

export default function LandingPage() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <FeaturesGrid />
      <VisualDemo />
      <CtaSection />
      <Footer />
    </main>
  )
}