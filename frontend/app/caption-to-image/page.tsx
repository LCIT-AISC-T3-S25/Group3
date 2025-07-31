"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { GLIDEApiClient } from "@/lib/api/clients/glide"
import { useMockApi } from "@/contexts/mock-api-context"
import { ErrorDisplay } from "@/components/error-display"
import { useApiError } from "@/hooks/use-api-error"
import { INPUT_LIMITS } from "@/config/constants"

export default function GLIDEPage() {
  const { isMockMode } = useMockApi()
  const [caption, setCaption] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { error, isLoading, executeWithErrorHandling, clearError } = useApiError()

  const generateImage = async () => {
    if (!caption.trim()) return

    await executeWithErrorHandling(
      () => GLIDEApiClient.generateImageFromText(caption, isMockMode),
      (result) => setImageUrl(result.imageUrl),
    )
  }

  const handleRetry = () => {
    clearError()
    generateImage()
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">GLIDE – Text-to-Image Generator</h1>
          </div>
          <p className="text-gray-400">Transform your text descriptions into stunning images using GLIDE</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Enter Caption</CardTitle>
              <CardDescription>
                Enter a detailed description of the image you want to generate (max{" "}
                {INPUT_LIMITS.GLIDE_CAPTION_MAX.toLocaleString()} characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="e.g., A serene mountain landscape at sunset with a lake reflection..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && generateImage()}
                  maxLength={INPUT_LIMITS.GLIDE_CAPTION_MAX}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {caption.length}/{INPUT_LIMITS.GLIDE_CAPTION_MAX.toLocaleString()}
                </div>
              </div>
              <Button
                onClick={generateImage}
                disabled={!caption.trim() || isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

          {isLoading && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
                  <p className="text-gray-400">Creating image from your caption...</p>
                  <p className="text-sm text-gray-500">"{caption}"</p>
                </div>
              </CardContent>
            </Card>
          )}

          {imageUrl && (
            <Card className="bg-gray-900/50 border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>Based on: "{caption}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Generated image: ${caption}`}
                    className="max-w-full h-auto rounded-lg border border-gray-700 shadow-lg"
                    onError={() => {
                      console.error("Image failed to load:", imageUrl)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
