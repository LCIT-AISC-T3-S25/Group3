"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, ImageIcon, BarChart3, ArrowLeft } from "lucide-react"
import ModelDashboard from "./components/model-dashboard"

interface CNNResult {
  Prediction: string
  "Confidence Score": string
}

interface GRUResult {
  prediction: string
  raw_scores: number[][]
  text: string
}

interface LSTMResult {
  input: string
  probability: number
  sentiment: string
}

interface VGGResult {
  Prediction: string
  "Confidence Score": string
}

interface ModelInfo {
  id: string
  name: string
  description: string
  type: "image" | "text"
  endpoint: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_IP;

const models: ModelInfo[] = [
  {
    id: "cnn",
    name: "CNN Model",
    description: "Convolutional Neural Network for image classification",
    type: "image",
    endpoint:"http://104.197.94.208:8001/predict",
    icon: <ImageIcon className="h-8 w-8" />,
    color: "text-blue-400",
    bgColor: "bg-blue-600",
  },
  {
    id: "gru",
    name: "GRU Model",
    description: "Gated Recurrent Unit for sentiment analysis",
    type: "text",
    endpoint:"http://104.197.94.208:8002/predict",
    icon: <Brain className="h-8 w-8" />,
    color: "text-green-400",
    bgColor: "bg-green-600",
  },
  {
    id: "lstm",
    name: "LSTM Model",
    description: "Long Short-Term Memory for sentiment analysis",
    type: "text",
    endpoint:"http://104.197.94.208:8003/predict",
    icon: <MessageSquare className="h-8 w-8" />,
    color: "text-purple-400",
    bgColor: "bg-purple-600",
  },
  {
    id: "vgg",
    name: "VGG Model",
    description: "Visual Geometry Group for image classification",
    type: "image",
    endpoint:"http://104.197.94.208:8004/predict",
    icon: <BarChart3 className="h-8 w-8" />,
    color: "text-orange-400",
    bgColor: "bg-orange-600",
  },
];


export default function Dashboard() {
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null)

  if (selectedModel) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="p-4">
          <Button onClick={() => setSelectedModel(null)} variant="ghost" className="text-white hover:bg-gray-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
        </div>
        <ModelDashboard model={selectedModel} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">ML Models Dashboard</h1>
          <p className="text-gray-400">Select a model to start making predictions with interpretability</p>
        </div>

        {/* Desktop: 2x2 Grid, Mobile: Single Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {models.map((model) => (
            <Card
              key={model.id}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedModel(model)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 p-4 rounded-full ${model.bgColor} w-fit`}>
                  <div className="text-white">{model.icon}</div>
                </div>
                <CardTitle className={`text-2xl ${model.color}`}>{model.name}</CardTitle>
                <CardDescription className="text-gray-400 text-center">{model.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary" className={`${model.bgColor} text-white mb-4`}>
                  {model.type === "image" ? "Image Classification" : "Sentiment Analysis"}
                </Badge>
                <div className="text-gray-300 text-sm mb-4">Click to open dashboard</div>
                <Button className={`w-full ${model.bgColor} hover:opacity-90`}>Open Dashboard</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
              <div>
                <div className="font-medium text-blue-400">Real-time Predictions</div>
                <div className="text-sm">Get instant results from deployed models</div>
              </div>
              <div>
                <div className="font-medium text-green-400">LIME & SHAP Integration</div>
                <div className="text-sm">Understand model decisions with interpretability</div>
              </div>
              <div>
                <div className="font-medium text-purple-400">Interactive Visualizations</div>
                <div className="text-sm">Charts and graphs for result analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
