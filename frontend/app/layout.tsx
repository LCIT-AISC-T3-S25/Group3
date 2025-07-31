import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { MockApiProvider } from "@/contexts/mock-api-context"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "AI Models Dashboard",
  description: "Explore cutting-edge AI models for sentiment analysis, image generation, and intelligent conversation",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <MockApiProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </MockApiProvider>
      </body>
    </html>
  )
}
