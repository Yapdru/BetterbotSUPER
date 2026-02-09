import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"

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

export function FeaturedGadgets() {
  return (
    <section id="gadgets" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-right">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Tech Collection
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Cutting-Edge{" "}
              <span className="text-secondary">Gadgets</span>
            </span>
          </h2>
          <p className="mt-4 ml-auto max-w-lg text-lg leading-relaxed text-muted-foreground">
            Technology that complements your drive. Smart devices designed for
            the modern car enthusiast and tech lover.
          </p>
        </div>

        {/* Gadgets grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gadgets.map((gadget) => (
            <article
              key={gadget.name}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-secondary/30 hover:glow-green"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={gadget.image}
                  alt={gadget.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                  {gadget.category}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {gadget.name}
                  </h3>
                  <span className="font-display text-lg font-bold text-secondary">
                    {gadget.price}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {gadget.rating}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {gadget.description}
                </p>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
