/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

// Sentiment Analysis API Configuration
export const SENTIMENT_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_SENTIMENT_API_URL || "http://localhost:5001",
  API_KEY: process.env.NEXT_PUBLIC_SENTIMENT_API_KEY || "",
  ENDPOINT: "/predict",
} as const

// GAN Image Generation API Configuration
export const GAN_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_GAN_API_URL || "http://localhost:5002",
  API_KEY: process.env.NEXT_PUBLIC_GAN_API_KEY || "",
  ENDPOINT: "/generate",
} as const

// GLIDE Text-to-Image API Configuration
export const GLIDE_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_GLIDE_API_URL || "http://localhost:8000",
  API_KEY: process.env.NEXT_PUBLIC_GLIDE_API_KEY || "",
  ENDPOINT: "/predict",
} as const

// RAG Chatbot API Configuration
export const RAG_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:5004",
  API_KEY: process.env.NEXT_PUBLIC_RAG_API_KEY || "",
  ENDPOINT: "/ask",
} as const

// Global Configuration
export const APP_CONFIG = {
  API_TIMEOUT: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
  ENABLE_MOCK_MODE: process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === "true",
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === "true",
} as const

// Validation function to check if required environment variables are set
export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    "NEXT_PUBLIC_SENTIMENT_API_URL",
    "NEXT_PUBLIC_GAN_API_URL",
    "NEXT_PUBLIC_GLIDE_API_URL",
    "NEXT_PUBLIC_RAG_API_URL",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

// Development helper to log configuration
export function logConfiguration() {
  if (APP_CONFIG.DEBUG) {
    console.group("🔧 API Configuration")
    console.log("Sentiment API:", SENTIMENT_CONFIG.API_URL)
    console.log("GAN API:", GAN_CONFIG.API_URL)
    console.log("GLIDE API:", GLIDE_CONFIG.API_URL)
    console.log("RAG API:", RAG_CONFIG.API_URL)
    console.log("Mock Mode:", APP_CONFIG.ENABLE_MOCK_MODE)
    console.log("Timeout:", APP_CONFIG.API_TIMEOUT + "ms")
    console.groupEnd()
  }
}
