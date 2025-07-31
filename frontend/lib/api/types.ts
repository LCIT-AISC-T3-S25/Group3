/**
 * API Type Definitions
 * TypeScript interfaces for all API requests and responses
 */

// Base API Response
export interface BaseApiResponse {
  success?: boolean
  message?: string
  timestamp?: string
}

// Error Response
export interface ApiErrorResponse extends BaseApiResponse {
  error: string
  code?: string
  details?: any
}

// Sentiment Analysis Types
export interface SentimentRequest {
  text: string
}

export interface SentimentResponse extends BaseApiResponse {
  sentiment: "Positive" | "Negative" | "Neutral"
  confidence: number
  scores?: {
    positive: number
    negative: number
    neutral: number
  }
}

// GAN Image Generation Types
export type GANRequest = {}

export interface GANResponse extends BaseApiResponse {
  file: string
  seed?: number
  metadata?: {
    width: number
    height: number
    format: string
  }
}

// GLIDE Text-to-Image Types
export interface GLIDERequest {
  text: string
  width?: number
  height?: number
  steps?: number
  guidance_scale?: number
}

export interface GLIDEResponse extends BaseApiResponse {
  generated_image_url: string
  prompt: string
  metadata?: {
    width: number
    height: number
    steps: number
    guidance_scale: number
    seed: number
  }
}

// RAG Chatbot Types
export interface RAGRequest {
  question: string
  context?: string
  max_tokens?: number
  temperature?: number
}

export interface RAGResponse extends BaseApiResponse {
  response: string
  sources: string[]
  confidence?: number
  metadata?: {
    tokens_used: number
    response_time: number
    model_version: string
  }
}

// Generic API Client Response
export interface ApiClientResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
}

// Mock Response Types
export interface MockSentimentResponse {
  sentiment: string
  confidence: number
}

export interface MockGANResponse {
  imageUrl: string
  file: string
}

export interface MockGLIDEResponse {
  imageUrl: string
  generated_image_url: string
  caption: string
}

export interface MockRAGResponse {
  response: string
  sources: string[]
}
