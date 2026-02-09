"use client"

import { useState } from "react"
import { Music, Radio, ExternalLink, Link2 } from "lucide-react"

const stations = [
  {
    name: "Ed Sheeran - YouTube",
    url: "https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
    type: "YouTube",
  },
  {
    name: "Ed Sheeran - Spotify",
    url: "https://open.spotify.com/embed/artist/6eUKZXaKkcviH0Ku9w2n3V",
    type: "Spotify",
  },
]

function ensureEmbed(url: string): string {
  try {
    const u = new URL(url)
    if (
      u.hostname === "open.spotify.com" &&
      !u.pathname.startsWith("/embed")
    ) {
      u.pathname = "/embed" + u.pathname
      return u.toString()
    }
    return url
  } catch {
    return url
  }
}

export function MusicSection() {
  const [currentStation, setCurrentStation] = useState(stations[0].url)
  const [customUrl, setCustomUrl] = useState("")

  const handleCustomUrl = () => {
    const url = customUrl.trim()
    if (!url) return
    try {
      new URL(url)
      setCurrentStation(ensureEmbed(url))
      setCustomUrl("")
    } catch {
      // Invalid URL
    }
  }

  return (
    <section id="music" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Music player */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Drive Vibes
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
              <span className="text-balance">
                Music <span className="text-secondary">Station</span>
              </span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Set the mood for your drive. Choose a station or paste your own
              embed URL.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {stations.map((station) => (
                <button
                  key={station.name}
                  onClick={() => setCurrentStation(station.url)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    currentStation === station.url
                      ? "bg-secondary/20 text-secondary border border-secondary/30 glow-green"
                      : "border border-border bg-muted text-muted-foreground hover:text-foreground hover:border-secondary/30"
                  }`}
                >
                  {station.type === "YouTube" ? (
                    <Radio className="h-4 w-4" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                  {station.name}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Paste YouTube/Spotify embed URL..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomUrl()
                }}
              />
              <button
                onClick={handleCustomUrl}
                className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:border-secondary/50 hover:text-secondary"
              >
                <Link2 className="h-4 w-4" />
                Use Link
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card">
              <iframe
                src={currentStation}
                width="100%"
                height="200"
                allow="autoplay; encrypted-media; picture-in-picture"
                loading="lazy"
                title="Music player"
                className="border-0"
              />
            </div>
          </div>

          {/* Provider launcher */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              AI Tools
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
              <span className="text-balance">
                Provider <span className="text-primary">Launcher</span>
              </span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Access external AI providers for music, images, and video
              creation. No API keys required.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <ProviderGroup
                title="Music / Song Generators"
                providers={[
                  { name: "SOUNDRAW", url: "https://soundraw.io/" },
                  { name: "Beatoven", url: "https://www.beatoven.ai/" },
                  { name: "Suno", url: "https://suno.com/" },
                  { name: "Udio", url: "https://www.udio.com/" },
                ]}
                color="secondary"
              />
              <ProviderGroup
                title="Image / Cover Art"
                providers={[
                  { name: "Craiyon", url: "https://www.craiyon.com/" },
                  { name: "Lexica", url: "https://lexica.art/" },
                  { name: "Playground AI", url: "https://playground.com/" },
                ]}
                color="primary"
              />
              <ProviderGroup
                title="Video Tools"
                providers={[
                  { name: "Canva", url: "https://www.canva.com/" },
                  { name: "CapCut", url: "https://www.capcut.com/" },
                  { name: "Runway", url: "https://runwayml.com/" },
                  { name: "Pika Labs", url: "https://pika.art/" },
                ]}
                color="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProviderGroup({
  title,
  providers,
  color,
}: {
  title: string
  providers: { name: string; url: string }[]
  color: "primary" | "secondary"
}) {
  return (
    <div>
      <h3
        className={`mb-3 text-sm font-semibold ${
          color === "primary" ? "text-primary" : "text-secondary"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              color === "primary"
                ? "border-primary/20 bg-primary/5 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                : "border-secondary/20 bg-secondary/5 text-foreground hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
            }`}
          >
            {p.name}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        ))}
      </div>
    </div>
  )
}
