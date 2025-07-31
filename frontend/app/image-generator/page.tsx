"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ImageIcon, Loader2, RefreshCw } from "lucide-react"
import { GANApiClient } from "@/lib/api/clients/gan"
import { useMockApi } from "@/contexts/mock-api-context"
import { ErrorDisplay } from "@/components/error-display"
import { useApiError } from "@/hooks/use-api-error"

export default function GANPage() {
  const { isMockMode } = useMockApi()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { error, isLoading, executeWithErrorHandling, clearError } = useApiError()

  const generateImage = async () => {
    await executeWithErrorHandling(
      () => GANApiClient.generateRandomImage(isMockMode),
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">GAN – Random Image Generator</h1>
          </div>
          <p className="text-gray-400">Generate unique random images using Generative Adversarial Networks (GANs)</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Generate Random Image</CardTitle>
              <CardDescription>Click the button below to generate a unique AI-created random image</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={generateImage}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Random Image...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Random Image
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
                  <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto" />
                  <p className="text-gray-400">Creating your unique random image...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {imageUrl && (
            <Card className="bg-gray-900/50 border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Generated Random Image</CardTitle>
                <CardDescription>Your AI-generated random artwork</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="AI Generated Random Image"
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
