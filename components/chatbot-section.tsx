"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
} from "lucide-react"

interface Message {
  role: "user" | "bot"
  text: string
}

const COMMANDS_HELP = `Available commands:
/help - Show this help
/time - Current date and time
/coin - Flip a coin
/echo <text> - Echo your text
/roll <N>d<S> - Roll N dice with S sides
/cars - Quick car recommendations
/gadgets - Popular gadgets list`

function liteReply(text: string): string {
  const t = text.trim()
  const lc = t.toLowerCase()

  if (t === "/help") return COMMANDS_HELP
  if (t === "/time") return `Current time: ${new Date().toLocaleString()}`
  if (t === "/coin") return Math.random() < 0.5 ? "Heads!" : "Tails!"
  if (/^\/echo\s+/.test(t)) return t.replace(/^\/echo\s+/, "")

  const rollMatch = t.match(/^\/roll\s+(\d+)d(\d+)\s*$/i)
  if (rollMatch) {
    const n = Math.min(Number(rollMatch[1]), 20)
    const sides = Number(rollMatch[2])
    const results: number[] = []
    let sum = 0
    for (let i = 0; i < n; i++) {
      const r = 1 + Math.floor(Math.random() * sides)
      results.push(r)
      sum += r
    }
    return `Rolled ${n}d${sides}: ${results.join(", ")} | Total: ${sum}`
  }

  if (t === "/cars") {
    return `Here are some top picks for you:
- Apex Supercar: 780 HP, 340 km/h - Pure adrenaline
- Summit SUV: 450 HP Hybrid - Adventure ready
- Volt Electric: 600 HP dual motor - Zero emissions, maximum thrill

Ask me anything about these cars!`
  }

  if (t === "/gadgets") {
    return `Popular gadgets right now:
- AutoSync Pro Watch ($399) - Vehicle diagnostics on your wrist
- SkyView Racing Drone ($1,299) - 4K aerial footage
- SonicDrive Headphones ($249) - Premium in-car audio
- GuardCam 360 ($199) - AI-powered dashcam

Which one interests you?`
  }

  // Car-related responses
  if (/\b(car|cars|vehicle|auto|drive|speed)\b/i.test(lc)) {
    const carResponses = [
      "Great question about cars! Our featured lineup includes supercars, SUVs, and electric vehicles. Check the Cars section above for details, or ask me about a specific type!",
      "I love talking about cars! Whether you're into speed, luxury, or sustainability, I can help you find the perfect ride. What matters most to you?",
      "The automotive world is evolving fast! From 780 HP supercars to smart electric vehicles, there's something for everyone. What type of car catches your eye?",
    ]
    return carResponses[Math.floor(Math.random() * carResponses.length)]
  }

  // Gadget-related responses
  if (/\b(gadget|tech|device|drone|watch|headphone|camera)\b/i.test(lc)) {
    const gadgetResponses = [
      "Tech is my thing! From AI-powered dashcams to racing drones, we have an amazing collection. Try /gadgets for a quick list!",
      "Our gadget collection is designed for car enthusiasts and tech lovers alike. What kind of tech are you looking for?",
      "Smart gadgets make every drive better! Check out the Gadgets section or ask me about specific products.",
    ]
    return gadgetResponses[Math.floor(Math.random() * gadgetResponses.length)]
  }

  // Greetings
  if (/\b(hello|hi|hey|howdy|sup)\b/i.test(lc)) {
    return "Hey there! Welcome to DRAR CARS. I'm BetterBot, your AI assistant. Ask me about cars, gadgets, or try /help for commands!"
  }

  // Default responses
  const defaults = [
    "Interesting! Feel free to ask me about cars, gadgets, or try /help for available commands.",
    "I'm here to help with all things automotive and tech. What would you like to know?",
    "Got it! Try asking about our featured cars or latest gadgets. I'm also great with quick commands like /coin or /roll 2d6!",
    "I can help you explore our car collection, compare gadgets, or just chat. What's on your mind?",
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

export function ChatbotSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey! I'm BetterBot DC, your AI assistant for DRAR CARS. Ask me about cars, gadgets, or try /help to see what I can do!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages])

  const speak = useCallback(
    (text: string) => {
      if (!isSpeaking) return
      try {
        speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.rate = 1
        u.pitch = 1
        u.lang = "en-AU"
        speechSynthesis.speak(u)
      } catch {
        // Speech not available
      }
    },
    [isSpeaking]
  )

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setIsTyping(true)

    // Simulate typing delay for natural feel
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600))

    const reply = liteReply(text)
    setIsTyping(false)
    setMessages((prev) => [...prev, { role: "bot", text: reply }])
    speak(reply)
  }, [input, speak])

  const toggleMic = () => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null
    if (!SR) return

    if (!recognitionRef.current) {
      const rec = new SR()
      rec.lang = "en-AU"
      rec.interimResults = true
      rec.maxAlternatives = 1
      rec.onresult = (e: SpeechRecognitionEvent) => {
        let txt = ""
        for (let i = e.resultIndex; i < e.results.length; i++) {
          txt += e.results[i][0].transcript
        }
        setInput(txt)
      }
      rec.onend = () => setIsListening(false)
      rec.onerror = () => setIsListening(false)
      recognitionRef.current = rec
    }

    if (!isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        // Already started
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch {
        // Already stopped
      }
    }
  }

  return (
    <section id="chatbot" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-5">
          {/* Left info */}
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              AI Assistant
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              <span className="text-balance">
                Meet <span className="text-primary">BetterBot</span> DC
              </span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Your intelligent companion for exploring cars and gadgets. Ask
              questions, get recommendations, or just have a conversation.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Smart Recommendations
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get personalized car and gadget suggestions based on your
                    preferences.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <HelpCircle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Quick Commands
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use /help, /cars, /gadgets, /coin, /roll and more for
                    instant actions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat panel */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card lg:col-span-3 glow-blue">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    BetterBot DC
                  </h3>
                  <span className="text-xs text-secondary">
                    Online - AI Powered
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className={`rounded-lg p-2 transition-colors ${
                    isSpeaking
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={
                    isSpeaking ? "Disable speech" : "Enable speech"
                  }
                >
                  {isSpeaking ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() =>
                    setMessages([
                      {
                        role: "bot",
                        text: "Chat cleared! How can I help you?",
                      },
                    ])
                  }
                  className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={logRef} className="h-96 overflow-y-auto px-6 py-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-4 flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-primary/20"
                        : "bg-secondary/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </pre>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mb-4 flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                    <Bot className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask about cars, gadgets, or try /help..."
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={toggleMic}
                  className={`rounded-xl px-3 transition-colors ${
                    isListening
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={
                    isListening ? "Stop listening" : "Start voice input"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
