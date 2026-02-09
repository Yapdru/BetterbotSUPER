"use client"

import { Code2, BarChart3, Brain, Wrench, Shield, Zap } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const services = [
  {
    icon: Brain,
    title: "AI Solutions",
    description:
      "Advanced AI applications that drive growth and efficiency for modern businesses. From chatbots to predictive analytics.",
    color: "primary" as const,
  },
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Custom software development to elevate your business processes with scalable, modern architecture.",
    color: "secondary" as const,
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Harness the power of data to drive informed decisions. Real-time dashboards and actionable insights.",
    color: "primary" as const,
  },
  {
    icon: Wrench,
    title: "Consulting Services",
    description:
      "Expert consulting to optimize your business strategies and streamline operations for maximum ROI.",
    color: "secondary" as const,
  },
  {
    icon: Shield,
    title: "Car Tech Integration",
    description:
      "Cutting-edge automotive technology solutions. Smart diagnostics, connected systems, and fleet management.",
    color: "primary" as const,
  },
  {
    icon: Zap,
    title: "Gadget Innovation",
    description:
      "Next-gen gadgets and IoT devices designed for the modern car enthusiast and tech-forward lifestyle.",
    color: "secondary" as const,
  },
]

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0]
  index: number
}) {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()
  const isPrimary = service.color === "primary"

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} stagger-${index + 1}`}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:-translate-y-1 ${
          isPrimary
            ? "hover:border-primary/30 hover:glow-blue"
            : "hover:border-secondary/30 hover:glow-green"
        }`}
      >
        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            isPrimary
              ? "bg-gradient-to-br from-primary/5 to-transparent"
              : "bg-gradient-to-br from-secondary/5 to-transparent"
          }`}
        />

        <div className="relative">
          <div
            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 ${
              isPrimary
                ? "bg-primary/10 group-hover:bg-primary/20"
                : "bg-secondary/10 group-hover:bg-secondary/20"
            }`}
          >
            <service.icon
              className={`h-7 w-7 ${
                isPrimary ? "text-primary" : "text-secondary"
              }`}
            />
          </div>

          <h3 className="font-display text-xl font-bold text-foreground">
            {service.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>

          <div
            className={`mt-6 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-20 ${
              isPrimary ? "bg-primary/30 group-hover:bg-primary/60" : "bg-secondary/30 group-hover:bg-secondary/60"
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="services" className="relative py-28">
      {/* Background accents */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-secondary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={ref}
          className={`reveal mb-16 max-w-2xl ${visible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Services
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              What We{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Offer
              </span>
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            We offer a range of services tailored to optimize business
            operations and drive growth. From AI solutions to software
            development, we have the expertise to meet your unique needs.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
