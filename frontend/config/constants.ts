/**
 * Application Constants
 * Centralized constants for the application
 */

// Input validation limits
export const INPUT_LIMITS = {
  SENTIMENT_TEXT_MAX: 5000,
  GLIDE_CAPTION_MAX: 1000,
  RAG_QUESTION_MAX: 2000,
} as const

// Mock response data
export const MOCK_DATA = {
  SENTIMENT_RESPONSES: [
    { sentiment: "Positive", confidence: 0.89 },
    { sentiment: "Negative", confidence: 0.76 },
    { sentiment: "Neutral", confidence: 0.82 },
  ],
  GAN_SAMPLE_IMAGE: "/sample_gan.png",
  RAG_RESPONSES: [
    "Based on the retrieved information, I can help you with that. This is a comprehensive answer that draws from multiple knowledge sources to provide you with accurate and relevant information.",
    "According to the documents in my knowledge base, here's what I found. The retrieval-augmented generation approach allows me to provide more contextual and factual responses.",
    "I've searched through the available information and found several relevant points. Let me break this down for you with the most pertinent details from the retrieved context.",
    "Drawing from the knowledge base, I can provide you with a detailed response. The RAG system has identified the most relevant information to answer your question effectively.",
  ],
} as const

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  LOADING_DELAY: 1500, // Minimum loading time for better UX
  ERROR_DISPLAY_DURATION: 5000,
} as const

// Model information for the landing page
export const MODEL_INFO = [
  {
    id: "sentiment",
    title: "Sentiment Analysis",
    description: "Analyze the emotional tone of text using Transformer models",
    href: "/sentiment",
    color: "from-teal-500 to-cyan-500",
    icon: "Brain",
  },
  {
    id: "image-generator",
    title: "Image Generator",
    description: "Generate random images using Generative Adversarial Networks",
    href: "/image-generator",
    color: "from-violet-500 to-purple-500",
    icon: "ImageIcon",
  },
  {
    id: "caption-to-image",
    title: "Caption to Image",
    description: "Transform text descriptions into images with GLIDE",
    href: "/caption-to-image",
    color: "from-emerald-500 to-teal-500",
    icon: "Sparkles",
  },
  {
    id: "chatbot",
    title: "RAG Chatbot",
    description: "Intelligent conversational AI with retrieval-augmented generation",
    href: "/chatbot",
    color: "from-pink-500 to-rose-500",
    icon: "MessageSquare",
  },
] as const
