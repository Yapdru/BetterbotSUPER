"use client"

import { useState } from "react"
import { Music, Radio, ExternalLink, Link2 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
    if (u.hostname === "open.spotify.com" && !u.pathname.startsWith("/embed")) {
      u.pathname = "/embed" + u.pathname
      return u.toString()
    }
    return url
  } catch {
    return url
  }
}

const providerGroups = [
  {
    title: "Music / Song Generators",
    providers: [
      { name: "SOUNDRAW", url: "https://soundraw.io/" },
      { name: "Beatoven", url: "https://www.beatoven.ai/" },
      { name: "Suno", url: "https://suno.com/" },
      { name: "Udio", url: "https://www.udio.com/" },
    ],
    color: "secondary" as const,
  },
  {
    title: "Image / Cover Art",
    providers: [
      { name: "Craiyon", url: "https://www.craiyon.com/" },
      { name: "Lexica", url: "https://lexica.art/" },
      { name: "Playground AI", url: "https://playground.com/" },
    ],
    color: "primary" as const,
  },
  {
    title: "Video Tools",
    providers: [
      { name: "Canva", url: "https://www.canva.com/" },
      { name: "CapCut", url: "https://www.capcut.com/" },
      { name: "Runway", url: "https://runwayml.com/" },
      { name: "Pika Labs", url: "https://pika.art/" },
    ],
    color: "secondary" as const,
  },
]

export function MusicSection() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [playerRef, playerVisible] = useScrollAnimation<HTMLDivElement>()
  const [toolsRef, toolsVisible] = useScrollAnimation<HTMLDivElement>()
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
    <section id="music" className="relative py-28">
      {/* Background accent */}
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={headerRef}
          className={`reveal mb-16 text-center ${headerVisible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Drive Vibes & AI Tools
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Music{" "}
              <span className="text-secondary glow-text-green">Station</span> &
              Creative Tools
            </span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Music player */}
          <div
            ref={playerRef}
            className={`reveal-left ${playerVisible ? "visible" : ""}`}
          >
            <h3 className="mb-6 font-display text-xl font-bold text-foreground">
              Set the mood for your drive
            </h3>

            <div className="flex flex-wrap gap-2">
              {stations.map((station) => (
                <button
                  key={station.name}
                  onClick={() => setCurrentStation(station.url)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    currentStation === station.url
                      ? "border border-secondary/30 bg-secondary/15 text-secondary"
                      : "border border-border bg-muted/50 text-muted-foreground hover:border-secondary/20 hover:text-foreground"
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
                className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-secondary/30 hover:text-secondary"
              >
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Use Link</span>
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
          <div
            ref={toolsRef}
            className={`reveal-right ${toolsVisible ? "visible" : ""}`}
          >
            <h3 className="mb-6 font-display text-xl font-bold text-foreground">
              AI Creative Tools
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Access external AI providers for music, images, and video
              creation. No API keys required.
            </p>

            <div className="flex flex-col gap-6">
              {providerGroups.map((group) => {
                const isPrimary = group.color === "primary"
                return (
                  <div key={group.title}>
                    <h4
                      className={`mb-3 text-xs font-semibold uppercase tracking-widest ${
                        isPrimary ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {group.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.providers.map((p) => (
                        <a
                          key={p.name}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all ${
                            isPrimary
                              ? "border-primary/15 bg-primary/5 text-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                              : "border-secondary/15 bg-secondary/5 text-foreground hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
                          }`}
                        >
                          {p.name}
                          <ExternalLink className="h-3 w-3 opacity-40" />
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
