"use client"

import Image from "next/image"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import { useCounter } from "@/hooks/use-counter"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()
  const count = useCounter(end, 2200, visible)

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-bold text-foreground md:text-5xl">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Premium car on dark highway with blue and green ambient lighting"
          fill
          className="object-cover"
          priority
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-background/70" />
        {/* Colored ambient orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="reveal visible mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </div>
            <span className="text-sm font-medium text-primary">
              AI-Powered Automotive & Tech Experience
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-balance">
              Innovative{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Technology
              </span>
            </span>
            <br />
            <span className="text-balance">
              <span className="bg-gradient-to-r from-secondary to-emerald-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            DRAR CARS is a cutting-edge technology company revolutionizing
            business operations through advanced AI, premium cars, and
            next-generation gadgets.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#services"
              className="group flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-blue"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#chatbot"
              className="flex items-center gap-2.5 rounded-xl border border-secondary/30 bg-secondary/10 px-7 py-3.5 text-sm font-semibold text-secondary backdrop-blur-sm transition-all hover:bg-secondary/20"
            >
              <Sparkles className="h-4 w-4" />
              Ask BetterBot AI
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 flex flex-wrap justify-start gap-12 border-t border-border/30 pt-10 md:gap-20">
          <StatCounter end={200} suffix="+" label="Cars Reviewed" />
          <StatCounter end={500} suffix="+" label="Gadgets Explored" />
          <StatCounter end={50} suffix="+" label="AI Tools" />
          <StatCounter end={10} suffix="K" label="Happy Users" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#services"
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
