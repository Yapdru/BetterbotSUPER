import Image from "next/image"
import { Zap } from "lucide-react"

const footerLinks = {
  explore: [
    { label: "Services", href: "#services" },
    { label: "Cars", href: "#cars" },
    { label: "Gadgets", href: "#gadgets" },
    { label: "Music Station", href: "#music" },
    { label: "Contact", href: "#contact" },
  ],
  technology: [
    { label: "AI Solutions", href: "#services" },
    { label: "Data Analytics", href: "#services" },
    { label: "Software Dev", href: "#services" },
    { label: "Car Tech", href: "#services" },
  ],
  connect: [
    {
      label: "GitHub Repository",
      href: "https://github.com/Yapdru/BetterbotSUPER",
      external: true,
    },
    {
      label: "Classic Version",
      href: "https://yapdru.github.io/BetterbotSUPER/",
      external: true,
    },
    {
      label: "DRAR CARS Wix",
      href: "https://drarcars.wixstudio.com/home",
      external: true,
    },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-card/80" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="DRAR CARS Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-display text-lg font-bold text-foreground">
                DRAR <span className="text-primary">CARS</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A cutting-edge technology company revolutionizing business
              operations through advanced AI, premium cars, and next-gen
              gadgets.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary">
              <Zap className="h-3 w-3" />
              AI-Powered by BetterBot DC
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Explore
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Technology
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.technology.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Connect
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            DRAR CARS - Innovative Technology Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with BetterBot DC Super
          </p>
        </div>
      </div>
    </footer>
  )
}
