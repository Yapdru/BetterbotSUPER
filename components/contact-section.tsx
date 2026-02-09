"use client"

import { useState } from "react"
import { Send, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function ContactSection() {
  const [ref, visible] = useScrollAnimation<HTMLDivElement>()
  const [formRef, formVisible] = useScrollAnimation<HTMLDivElement>()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="relative py-28">
      {/* Background accents */}
      <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div
          ref={ref}
          className={`reveal mb-16 text-center ${visible ? "visible" : ""}`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Get In Touch
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-balance">
              Contact{" "}
              <span className="text-primary glow-text-blue">Us</span> Today
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            For inquiries about our services or to discuss a project, feel free
            to reach out. We are here to help your business thrive.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <div
            ref={formRef}
            className={`reveal-left lg:col-span-2 ${formVisible ? "visible" : ""}`}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Location</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sydney, Australia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    contact@drarcars.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    +61 2 1234 5678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className={`reveal-right lg:col-span-3 ${formVisible ? "visible" : ""}`}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/50 bg-card p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="+61 400 000 000"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  submitted
                    ? "bg-secondary/20 text-secondary"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue"
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
