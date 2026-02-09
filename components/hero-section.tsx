import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Premium car with blue and green lighting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 pt-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Automotive Experience</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            <span className="text-balance">
              The Future of{" "}
              <span className="text-primary glow-text-blue">Cars</span> &{" "}
              <span className="text-secondary glow-text-green">Gadgets</span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Discover premium vehicles and cutting-edge technology. Chat with our
            AI assistant to explore, compare, and find your perfect match.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#cars"
              className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-blue"
            >
              Explore Cars
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#chatbot"
              className="flex items-center gap-2 rounded-lg border border-secondary/40 bg-secondary/10 px-6 py-3 text-sm font-semibold text-secondary transition-all hover:bg-secondary/20 glow-green"
            >
              <Sparkles className="h-4 w-4" />
              Ask BetterBot AI
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex gap-12">
            <div>
              <div className="font-display text-3xl font-bold text-foreground">
                200+
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Cars Reviewed
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-foreground">
                500+
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Gadgets Explored
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-secondary">
                AI
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Powered by BetterBot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
            <div className="h-2 w-full animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  )
}
