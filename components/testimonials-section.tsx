"use client"

import { Quote } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    quote:
      "DRAR CARS' team is dedicated, knowledgeable, and truly understands our business needs. Their software development services have been exceptional.",
    name: "Emily Chen",
    title: "CTO, TechForward Inc.",
    color: "primary" as const,
  },
  {
    quote:
      "We highly recommend DRAR CARS to any business looking to enhance their operations and leverage advanced AI technology. Truly game-changing.",
    name: "David Johnson",
    title: "COO, AutoVision Group",
    color: "secondary" as const,
  },
  {
    quote:
      "The consulting services provided by DRAR CARS have been invaluable in helping us streamline our processes and achieve our business goals.",
    name: "Sophia Lee",
    title: "Marketing Director, DriveSync",
    color: "primary" as const,
  },
]

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
}) {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()
  const isPrimary = testimonial.color === "primary"

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} stagger-${index + 1}`}
    >
      <div
        className={`relative h-full rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:-translate-y-1 ${
          isPrimary ? "hover:border-primary/20" : "hover:border-secondary/20"
        }`}
      >
        {/* Quote icon */}
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${
            isPrimary ? "bg-primary/10" : "bg-secondary/10"
          }`}
        >
          <Quote
            className={`h-6 w-6 ${
              isPrimary ? "text-primary" : "text-secondary"
            }`}
          />
        </div>

        <blockquote className="text-base leading-relaxed text-foreground/90">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="mt-8 flex items-center gap-4">
          {/* Avatar placeholder - initials */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
              isPrimary
                ? "bg-primary/15 text-primary"
                : "bg-secondary/15 text-secondary"
            }`}
          >
            {testimonial.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {testimonial.title}
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div
          className={`absolute bottom-0 left-8 right-8 h-0.5 rounded-full ${
            isPrimary ? "bg-primary/20" : "bg-secondary/20"
          }`}
        />
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="testimonials" className="relative py-28">
      {/* Background */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={ref}
          className={`reveal mb-16 text-center ${visible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              What Our{" "}
              <span className="text-secondary glow-text-green">Clients</span>{" "}
              Say
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Trusted by businesses worldwide to deliver innovative technology
            solutions that drive real results.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
