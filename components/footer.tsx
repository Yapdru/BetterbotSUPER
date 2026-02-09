import Image from "next/image"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
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
              The ultimate destination for car enthusiasts and tech lovers.
              Powered by AI for a smarter experience.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary">
              <Zap className="h-3 w-3" />
              AI-Powered by BetterBot DC
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Explore
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {["Cars", "Gadgets", "AI Assistant", "Music Station"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* AI providers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              AI Providers
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {["OpenAI", "DeepSeek", "Hugging Face", "Local (WebLLM)"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Connect
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://github.com/Yapdru/BetterbotSUPER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://yapdru.github.io/BetterbotSUPER/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                >
                  Classic Version
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            DRAR CARS - Cars & Gadgets. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with BetterBot DC Super
          </p>
        </div>
      </div>
    </footer>
  )
}
