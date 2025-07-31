"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Loader2 } from "lucide-react"
import { SentimentApiClient } from "@/lib/api/clients/sentiment"
import { useMockApi } from "@/contexts/mock-api-context"
import { ErrorDisplay } from "@/components/error-display"
import { useApiError } from "@/hooks/use-api-error"
import { INPUT_LIMITS } from "@/config/constants"

export default function SentimentPage() {
  const { isMockMode } = useMockApi()
  const [text, setText] = useState("")
  const [result, setResult] = useState<{ sentiment: string; confidence: number } | null>(null)
  const { error, isLoading, executeWithErrorHandling, clearError } = useApiError()

  const analyzeSentiment = async () => {
    if (!text.trim()) return

    await executeWithErrorHandling(
      () => SentimentApiClient.analyzeSentiment(text, isMockMode),
      (result) => setResult(result),
    )
  }

  const handleRetry = () => {
    clearError()
    analyzeSentiment()
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "text-green-400"
      case "Negative":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Sentiment Analysis</h1>
          </div>
          <p className="text-gray-400">Analyze the emotional tone of your text using advanced Transformer models</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Enter Text to Analyze</CardTitle>
              <CardDescription>
                Type or paste any text to determine its sentiment (max{" "}
                {INPUT_LIMITS.SENTIMENT_TEXT_MAX.toLocaleString()} characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && analyzeSentiment()}
                  maxLength={INPUT_LIMITS.SENTIMENT_TEXT_MAX}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {text.length}/{INPUT_LIMITS.SENTIMENT_TEXT_MAX.toLocaleString()}
                </div>
              </div>
              <Button
                onClick={analyzeSentiment}
                disabled={!text.trim() || isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Sentiment"
                )}
              </Button>
            </CardContent>
          </Card>

          {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

          {result && (
            <Card className="bg-gray-900/50 border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`text-4xl font-bold ${getSentimentColor(result.sentiment)}`}>{result.sentiment}</div>
                  <div className="text-gray-400">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
