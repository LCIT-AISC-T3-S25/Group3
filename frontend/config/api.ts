// API Configuration
// TODO: Move these to environment variables for production

export const API_CONFIG = {
  TRANSFORMER: {
    URL: process.env.NEXT_PUBLIC_TRANSFORMER_API_URL || "http://localhost:5001",
    ENDPOINT: "/predict",
    PORT: 5001,
  },
  GAN: {
    URL: process.env.NEXT_PUBLIC_GAN_API_URL || "http://localhost:5002",
    ENDPOINT: "/generate",
    PORT: 5002,
  },
  GLIDE: {
    URL: process.env.NEXT_PUBLIC_GLIDE_API_URL || "http://localhost:8000",
    ENDPOINT: "/predict",
    PORT: 8000,
  },
  RAG: {
    URL: process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:5004",
    ENDPOINT: "/ask",
    PORT: 5004,
  },
} as const

// API Request timeout in milliseconds
export const API_TIMEOUT = 30000

// Mock data for testing
export const MOCK_RESPONSES = {
  SENTIMENT: {
    positive: { sentiment: "Positive", confidence: 0.89 },
    negative: { sentiment: "Negative", confidence: 0.76 },
    neutral: { sentiment: "Neutral", confidence: 0.82 },
  },
  GAN_SAMPLE_IMAGE: "/sample_gan.png",
  GLIDE_PLACEHOLDER: "/placeholder.svg?height=512&width=512",
  RAG_RESPONSES: [
    "Based on the retrieved information, I can help you with that. This is a comprehensive answer that draws from multiple knowledge sources to provide you with accurate and relevant information.",
    "According to the documents in my knowledge base, here's what I found. The retrieval-augmented generation approach allows me to provide more contextual and factual responses.",
    "I've searched through the available information and found several relevant points. Let me break this down for you with the most pertinent details from the retrieved context.",
    "Drawing from the knowledge base, I can provide you with a detailed response. The RAG system has identified the most relevant information to answer your question effectively.",
  ],
}
