import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "DRAR CARS — Innovative Technology Solutions | Cars & Gadgets",
  description:
    "DRAR CARS is a cutting-edge technology company offering AI solutions, premium cars, and innovative gadgets. Powered by BetterBot AI assistant.",
  keywords: [
    "cars",
    "gadgets",
    "AI",
    "automotive",
    "technology",
    "DRAR CARS",
    "software development",
    "Sydney",
  ],
}

export const viewport: Viewport = {
  themeColor: "#0c1320",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
