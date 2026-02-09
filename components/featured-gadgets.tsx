"use client"

import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const gadgets = [
  {
    name: "AutoSync Pro Watch",
    category: "Wearable",
    image: "/images/gadget-watch.jpg",
    price: "$399",
    rating: 4.8,
    description:
      "AI-powered smartwatch with real-time vehicle diagnostics and driving analytics.",
  },
  {
    name: "SkyView Racing Drone",
    category: "Aerial",
    image: "/images/gadget-drone.jpg",
    price: "$1,299",
    rating: 4.9,
    description:
      "High-speed racing drone with 4K camera and intelligent obstacle avoidance.",
  },
  {
    name: "SonicDrive Headphones",
    category: "Audio",
    image: "/images/gadget-headphones.jpg",
    price: "$249",
    rating: 4.7,
    description:
      "Noise-canceling headphones tuned for in-car audio and hands-free calls.",
  },
  {
    name: "GuardCam 360",
    category: "Automotive",
    image: "/images/gadget-dashcam.jpg",
    price: "$199",
    rating: 4.6,
    description:
      "AI-powered dashcam with 360-degree recording and intelligent incident detection.",
  },
]

function GadgetCard({
  gadget,
  index,
}: {
  gadget: (typeof gadgets)[0]
  index: number
}) {
  const [ref, visible] = useScrollAnimation<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} stagger-${index + 1}`}
    >
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-secondary/30">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={gadget.image}
            alt={gadget.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <span className="absolute top-3 left-3 rounded-full border border-secondary/20 bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-secondary backdrop-blur-sm">
            {gadget.category}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-foreground">
              {gadget.name}
            </h3>
            <span className="shrink-0 font-display text-lg font-bold text-secondary">
              {gadget.price}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(gadget.rating)
                    ? "fill-secondary text-secondary"
                    : "text-muted"
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
              {gadget.rating}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {gadget.description}
          </p>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/20 bg-secondary/5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary">
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function FeaturedGadgets() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="gadgets" className="relative py-28">
      {/* Background accent */}
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={ref}
          className={`reveal mb-16 ml-auto max-w-2xl text-right ${visible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Tech Collection
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Cutting-Edge{" "}
              <span className="text-secondary glow-text-green">Gadgets</span>
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Technology that complements your drive. Smart devices designed for
            the modern car enthusiast and tech lover.
          </p>
        </div>

        {/* Gadgets grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gadgets.map((gadget, i) => (
            <GadgetCard key={gadget.name} gadget={gadget} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
