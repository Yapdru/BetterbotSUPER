"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X, Bot } from "lucide-react"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Cars", href: "#cars" },
  { label: "Gadgets", href: "#gadgets" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/90 backdrop-blur-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="DRAR CARS Logo"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold leading-none tracking-tight text-foreground">
              DRAR <span className="text-primary">CARS</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Cars & Gadgets
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#music"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Music
          </a>
          <a
            href="#chatbot"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-blue"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border/50 bg-background/95 px-6 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2">
              <a
                href="#music"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-3 text-center text-sm font-medium text-foreground"
              >
                Music
              </a>
              <a
                href="#chatbot"
                onClick={() => setIsOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Bot className="h-4 w-4" />
                AI Assistant
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
