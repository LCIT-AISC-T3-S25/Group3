import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, ImageIcon, MessageSquare, Sparkles } from "lucide-react"
import { MockApiToggle } from "@/components/mock-api-toggle"

const models = [
  {
    id: "sentiment",
    title: "Sentiment Analysis",
    description: "Analyze the emotional tone of text using Transformer models",
    icon: Brain,
    href: "/sentiment",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "image-generator",
    title: "Image Generator",
    description: "Generate random images using Generative Adversarial Networks",
    icon: ImageIcon,
    href: "/image-generator",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "caption-to-image",
    title: "Caption to Image",
    description: "Transform text descriptions into images with GLIDE",
    icon: Sparkles,
    href: "/caption-to-image",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "chatbot",
    title: "RAG Chatbot",
    description: "Intelligent conversational AI with retrieval-augmented generation",
    icon: MessageSquare,
    href: "/chatbot",
    color: "from-pink-500 to-rose-500",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-4">
          <MockApiToggle />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">AI Model Showcase</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore cutting-edge AI models for sentiment analysis, image generation, and intelligent conversation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {models.map((model) => {
            const IconComponent = model.icon
            return (
              <Card
                key={model.id}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group flex flex-col h-full"
              >
                <CardHeader className="pb-4 flex-grow">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${model.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-teal-300 transition-colors">
                    {model.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={model.href}>
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-500 hover:to-violet-500 text-white border-0 transition-all duration-300">
                      Try Model
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
