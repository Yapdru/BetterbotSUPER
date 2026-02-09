"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Send,
  Bot,
  User,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageCircle,
  Sparkles,
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
    return `Top picks for you:

- Apex Supercar: 780 HP, 340 km/h - Pure adrenaline
- Summit SUV: 450 HP Hybrid - Adventure ready
- Volt Electric: 600 HP dual motor - Zero emissions

Scroll up to the Cars section for full details!`
  }

  if (t === "/gadgets") {
    return `Popular gadgets:

- AutoSync Pro Watch ($399) - Vehicle diagnostics on your wrist
- SkyView Racing Drone ($1,299) - 4K aerial footage
- SonicDrive Headphones ($249) - Premium in-car audio
- GuardCam 360 ($199) - AI-powered dashcam

Which one interests you?`
  }

  if (/\b(car|cars|vehicle|auto|drive|speed|supercar|suv|electric)\b/i.test(lc)) {
    const responses = [
      "Great question about cars! Our featured lineup includes supercars, SUVs, and electric vehicles. Scroll to the Cars section for details, or try /cars for a quick list!",
      "Whether you're into speed, luxury, or sustainability, I can help. What matters most to you?",
      "The automotive world is evolving fast! From 780 HP supercars to smart EVs, there's something for everyone.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (/\b(gadget|tech|device|drone|watch|headphone|camera|dashcam)\b/i.test(lc)) {
    const responses = [
      "Tech is my thing! From AI-powered dashcams to racing drones, we have an amazing collection. Try /gadgets for a quick list!",
      "Our gadget collection is designed for car enthusiasts and tech lovers alike. What kind of tech are you looking for?",
      "Smart gadgets make every drive better! Check out the Gadgets section or ask me about specific products.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (/\b(service|consulting|software|analytics|development|ai solution)\b/i.test(lc)) {
    return "We offer AI Solutions, Software Development, Data Analytics, Consulting, Car Tech Integration, and Gadget Innovation. Scroll to our Services section to learn more, or ask about a specific service!"
  }

  if (/\b(hello|hi|hey|howdy|sup|good morning|good evening)\b/i.test(lc)) {
    return "Hey there! Welcome to DRAR CARS. I'm BetterBot, your AI assistant. Ask me about cars, gadgets, services, or try /help for commands!"
  }

  if (/\b(thank|thanks|cheers)\b/i.test(lc)) {
    return "You're welcome! Let me know if there's anything else I can help with."
  }

  if (/\b(who are you|your name|what are you)\b/i.test(lc)) {
    return "I'm BetterBot DC, the AI assistant for DRAR CARS. I can help you explore cars, gadgets, and tech services. Try /help to see all my commands!"
  }

  if (/\b(contact|email|phone|location|address)\b/i.test(lc)) {
    return "You can reach us at contact@drarcars.com or scroll down to the Contact section to send us a message directly. We're based in Sydney, Australia!"
  }

  const defaults = [
    "Interesting! Ask me about cars, gadgets, or services - or try /help for quick commands.",
    "I'm here to help with all things automotive and tech. What would you like to know?",
    "Got it! Try /cars for vehicle picks, /gadgets for tech, or just ask me anything.",
    "I can help you explore our full range of offerings. What's on your mind?",
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey! I'm BetterBot DC, your AI assistant. Ask me about cars, gadgets, services, or try /help!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages])

  // Handle hash navigation to #chatbot
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#chatbot") {
        setIsOpen(true)
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

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
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          setIsOpen(true)
          setHasNewMessage(false)
        }}
        className={`fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 glow-blue ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-secondary" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed right-4 bottom-4 z-50 flex w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl transition-all duration-300 ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: "min(560px, calc(100vh - 32px))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground">
                  BetterBot DC
                </h3>
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
              </div>
              <span className="text-xs text-secondary">AI Powered</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`rounded-lg p-2 transition-colors ${
                isSpeaking
                  ? "bg-secondary/15 text-secondary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label={isSpeaking ? "Disable speech" : "Enable speech"}
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
                  { role: "bot", text: "Chat cleared! How can I help you?" },
                ])
              }
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex gap-2.5 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-primary/15"
                    : "bg-gradient-to-br from-primary/20 to-secondary/20"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-secondary" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-3 flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <Bot className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {["/cars", "/gadgets", "/help"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd)
                setTimeout(() => {
                  setInput("")
                  setMessages((prev) => [...prev, { role: "user", text: cmd }])
                  setIsTyping(true)
                  setTimeout(() => {
                    const reply = liteReply(cmd)
                    setIsTyping(false)
                    setMessages((prev) => [
                      ...prev,
                      { role: "bot", text: reply },
                    ])
                  }, 500)
                }, 100)
              }}
              className="shrink-0 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border/50 p-3">
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
              placeholder="Ask about cars, gadgets..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={toggleMic}
              className={`shrink-0 rounded-xl px-3 transition-colors ${
                isListening
                  ? "bg-destructive/15 text-destructive"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 rounded-xl bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
