import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedCars } from "@/components/featured-cars"
import { CtaBanner } from "@/components/cta-banner"
import { FeaturedGadgets } from "@/components/featured-gadgets"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { MusicSection } from "@/components/music-section"
import { Footer } from "@/components/footer"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { SectionDivider } from "@/components/section-divider"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />

      <SectionDivider variant="primary" />
      <ServicesSection />

      <SectionDivider variant="secondary" />
      <FeaturedCars />

      <CtaBanner />

      <SectionDivider variant="secondary" />
      <FeaturedGadgets />

      <SectionDivider variant="mixed" />
      <TestimonialsSection />

      <SectionDivider variant="primary" />
      <MusicSection />

      <SectionDivider variant="secondary" />
      <ContactSection />

      <Footer />

      {/* Floating AI chatbot widget */}
      <ChatbotWidget />
    </main>
  )
}
