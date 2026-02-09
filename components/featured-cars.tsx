"use client"

import Image from "next/image"
import { Gauge, Fuel, Zap, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const cars = [
  {
    name: "Apex Supercar",
    category: "Performance",
    image: "/images/car-supercar.jpg",
    speed: "340 km/h",
    power: "780 HP",
    type: "V10 Twin-Turbo",
    highlight: "primary" as const,
    description: "Raw power meets aerodynamic precision in this track-ready beast.",
  },
  {
    name: "Summit SUV",
    category: "Adventure",
    image: "/images/car-suv.jpg",
    speed: "250 km/h",
    power: "450 HP",
    type: "Hybrid V6",
    highlight: "secondary" as const,
    description: "Conquer any terrain with luxury and intelligent hybrid efficiency.",
  },
  {
    name: "Volt Electric",
    category: "Sustainable",
    image: "/images/car-electric.jpg",
    speed: "280 km/h",
    power: "600 HP",
    type: "Dual Motor EV",
    highlight: "primary" as const,
    description: "Zero emissions, maximum thrill. The future of driving is here.",
  },
]

function CarCard({ car, index }: { car: (typeof cars)[0]; index: number }) {
  const [ref, visible] = useScrollAnimation<HTMLElement>()
  const isPrimary = car.highlight === "primary"

  return (
    <article
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} stagger-${index + 1}`}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-2 ${
          isPrimary ? "hover:border-primary/30" : "hover:border-secondary/30"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
              isPrimary
                ? "bg-primary/20 text-primary border border-primary/20"
                : "bg-secondary/20 text-secondary border border-secondary/20"
            }`}
          >
            {car.category}
          </span>
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-foreground">
            {car.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {car.description}
          </p>

          {/* Specs */}
          <div className="mt-5 flex gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4 text-primary" />
              <span>{car.speed}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-secondary" />
              <span>{car.power}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span>{car.type}</span>
            </div>
          </div>

          <button
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
              isPrimary
                ? "border-primary/20 bg-primary/5 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                : "border-secondary/20 bg-secondary/5 text-foreground hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
            }`}
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function FeaturedCars() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="cars" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={ref}
          className={`reveal mb-16 max-w-2xl ${visible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Featured Vehicles
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Cars That Define the{" "}
              <span className="text-primary glow-text-blue">Future</span>
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            From thunderous supercars to intelligent electric vehicles, explore
            the machines that push the boundaries of what is possible.
          </p>
        </div>

        {/* Cars grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => (
            <CarCard key={car.name} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
