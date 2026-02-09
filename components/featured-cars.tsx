import Image from "next/image"
import { Gauge, Fuel, Zap, ArrowRight } from "lucide-react"

const cars = [
  {
    name: "Apex Supercar",
    category: "Performance",
    image: "/images/car-supercar.jpg",
    speed: "340 km/h",
    power: "780 HP",
    type: "V10 Twin-Turbo",
    highlight: "primary",
  },
  {
    name: "Summit SUV",
    category: "Adventure",
    image: "/images/car-suv.jpg",
    speed: "250 km/h",
    power: "450 HP",
    type: "Hybrid V6",
    highlight: "secondary",
  },
  {
    name: "Volt Electric",
    category: "Sustainable",
    image: "/images/car-electric.jpg",
    speed: "280 km/h",
    power: "600 HP",
    type: "Dual Motor EV",
    highlight: "primary",
  },
]

export function FeaturedCars() {
  return (
    <section id="cars" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Featured Vehicles
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Cars That Define the{" "}
              <span className="text-primary">Future</span>
            </span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From thunderous supercars to intelligent electric vehicles, explore
            the machines that push the boundaries of what is possible.
          </p>
        </div>

        {/* Cars grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <article
              key={car.name}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:glow-blue"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span
                  className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${
                    car.highlight === "primary"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {car.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {car.name}
                </h3>

                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4 text-primary" />
                    {car.speed}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-secondary" />
                    {car.power}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    {car.type}
                  </div>
                </div>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
                  Learn More
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
