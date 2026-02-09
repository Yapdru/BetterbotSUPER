"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CtaBanner() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={ref}
          className={`reveal-scale ${visible ? "visible" : ""}`}
        >
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/gadgets-hero.jpg"
                alt="Tech gadgets with blue and green lighting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative px-10 py-16 md:px-16 md:py-20">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  <span className="text-balance">
                    Ready to experience the{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      future
                    </span>
                    ?
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Explore our cutting-edge technology solutions, premium car
                  collection, and innovative gadgets -- all powered by AI.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#gadgets"
                    className="group flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/90 glow-green"
                  >
                    Browse Gadgets
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#contact"
                    className="rounded-xl border border-border/50 bg-background/30 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-background/50"
                  >
                    Get In Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
