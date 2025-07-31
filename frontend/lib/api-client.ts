import { API_CONFIG, API_TIMEOUT, MOCK_RESPONSES } from "@/config/api"

// Error types for better error handling
export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  RATE_LIMITED = "RATE_LIMITED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    public message: string,
    public statusCode?: number,
    public originalError?: Error,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Generic API client with comprehensive error handling
export class ApiClient {
  private static getErrorType(error: any, response?: Response): ApiErrorType {
    if (error.name === "AbortError") {
      return ApiErrorType.TIMEOUT_ERROR
    }

    if (!response) {
      return ApiErrorType.NETWORK_ERROR
    }

    switch (response.status) {
      case 400:
        return ApiErrorType.VALIDATION_ERROR
      case 401:
        return ApiErrorType.UNAUTHORIZED
      case 404:
        return ApiErrorType.NOT_FOUND
      case 429:
        return ApiErrorType.RATE_LIMITED
      case 500:
      case 502:
      case 503:
      case 504:
        return ApiErrorType.SERVER_ERROR
      default:
        return ApiErrorType.UNKNOWN_ERROR
    }
  }

  private static getErrorMessage(type: ApiErrorType, statusCode?: number): string {
    switch (type) {
      case ApiErrorType.NETWORK_ERROR:
        return "Unable to connect to the server. Please check your internet connection and try again."
      case ApiErrorType.TIMEOUT_ERROR:
        return "Request timed out. The server is taking too long to respond. Please try again."
      case ApiErrorType.SERVER_ERROR:
        return "The server is experiencing issues. Please try again in a few moments."
      case ApiErrorType.VALIDATION_ERROR:
        return "Invalid input provided. Please check your data and try again."
      case ApiErrorType.UNAUTHORIZED:
        return "Authentication required. Please log in and try again."
      case ApiErrorType.NOT_FOUND:
        return "The requested resource was not found. The API endpoint may be unavailable."
      case ApiErrorType.RATE_LIMITED:
        return "Too many requests. Please wait a moment before trying again."
      default:
        return `An unexpected error occurred${statusCode ? ` (${statusCode})` : ""}. Please try again.`
    }
  }

  private static async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorType = this.getErrorType(null, response)
        const errorMessage = this.getErrorMessage(errorType, response.status)

        // Try to get error details from response body
        let errorDetails = ""
        try {
          const errorBody = await response.text()
          if (errorBody) {
            const parsed = JSON.parse(errorBody)
            errorDetails = parsed.message || parsed.error || ""
          }
        } catch {
          // Ignore parsing errors
        }

        throw new ApiError(errorType, errorDetails || errorMessage, response.status)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      const errorType = this.getErrorType(error)
      const errorMessage = this.getErrorMessage(errorType)

      throw new ApiError(errorType, errorMessage, undefined, error instanceof Error ? error : new Error(String(error)))
    }
  }

  // Sentiment Analysis API with error handling
  static async analyzeSentiment(text: string, useMock = false): Promise<{ sentiment: string; confidence: number }> {
    if (!text || text.trim().length === 0) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Please enter some text to analyze.")
    }

    if (text.length > 5000) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Text is too long. Please limit to 5000 characters.")
    }

    if (useMock) {
      // Mock response with random sentiment
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const sentiments = Object.values(MOCK_RESPONSES.SENTIMENT)
      return sentiments[Math.floor(Math.random() * sentiments.length)]
    }

    try {
      const url = `${API_CONFIG.TRANSFORMER.URL}${API_CONFIG.TRANSFORMER.ENDPOINT}`
      const response = await this.makeRequest<{ sentiment: string; confidence: number }>(url, {
        method: "POST",
        body: JSON.stringify({ text: text.trim() }),
      })

      // Validate response structure
      if (!response.sentiment || typeof response.confidence !== "number") {
        throw new ApiError(ApiErrorType.SERVER_ERROR, "Invalid response format from sentiment analysis service.")
      }

      return response
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(ApiErrorType.UNKNOWN_ERROR, "Failed to analyze sentiment. Please try again.")
    }
  }

  // GAN Image Generation API with error handling
  static async generateRandomImage(useMock = false): Promise<{ imageUrl: string; file: string }> {
    if (useMock) {
      // Mock response with sample image
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        imageUrl: MOCK_RESPONSES.GAN_SAMPLE_IMAGE,
        file: "sample_gan.png",
      }
    }

    try {
      const url = API_CONFIG.GAN.URL + API_CONFIG.GAN.ENDPOINT
      const response = await this.makeRequest<{ file: string }>(url, {
        method: "GET",
      })

      // Validate response structure
      if (!response.file || typeof response.file !== "string") {
        throw new ApiError(ApiErrorType.SERVER_ERROR, "Invalid response format from image generation service.")
      }

      const imageUrl = `${API_CONFIG.GAN.URL}/${response.file}`

      // Validate that the image URL is accessible
      try {
        const imageCheck = await fetch(imageUrl, { method: "HEAD" })
        if (!imageCheck.ok) {
          throw new ApiError(ApiErrorType.SERVER_ERROR, "Generated image is not accessible. Please try again.")
        }
      } catch {
        // If HEAD request fails, still return the URL but log the issue
        console.warn("Could not verify image accessibility:", imageUrl)
      }

      return {
        imageUrl,
        file: response.file,
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(ApiErrorType.UNKNOWN_ERROR, "Failed to generate image. Please try again.")
    }
  }

  // GLIDE Caption to Image API with error handling
  static async generateImageFromText(
    text: string,
    useMock = false,
  ): Promise<{ imageUrl: string; generated_image_url: string; caption: string }> {
    if (!text || text.trim().length === 0) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Please enter a caption to generate an image.")
    }

    if (text.length > 1000) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Caption is too long. Please limit to 1000 characters.")
    }

    if (useMock) {
      // Mock response with placeholder image
      await new Promise((resolve) => setTimeout(resolve, 2500))
      const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(text)}`
      return {
        imageUrl,
        generated_image_url: imageUrl,
        caption: text.trim(),
      }
    }

    try {
      const url = API_CONFIG.GLIDE.URL + API_CONFIG.GLIDE.ENDPOINT
      const response = await this.makeRequest<{ generated_image_url: string }>(url, {
        method: "POST",
        body: JSON.stringify({ text: text.trim() }),
      })

      // Validate response structure
      if (!response.generated_image_url || typeof response.generated_image_url !== "string") {
        throw new ApiError(ApiErrorType.SERVER_ERROR, "Invalid response format from image generation service.")
      }

      // Validate that the image URL is accessible
      try {
        const imageCheck = await fetch(response.generated_image_url, { method: "HEAD" })
        if (!imageCheck.ok) {
          throw new ApiError(ApiErrorType.SERVER_ERROR, "Generated image is not accessible. Please try again.")
        }
      } catch {
        // If HEAD request fails, still return the URL but log the issue
        console.warn("Could not verify image accessibility:", response.generated_image_url)
      }

      return {
        imageUrl: response.generated_image_url,
        generated_image_url: response.generated_image_url,
        caption: text.trim(),
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(ApiErrorType.UNKNOWN_ERROR, "Failed to generate image from caption. Please try again.")
    }
  }

  // RAG Chatbot API with error handling
  static async askQuestion(question: string, useMock = false): Promise<{ response: string; sources: string[] }> {
    if (!question || question.trim().length === 0) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Please enter a question to get a response.")
    }

    if (question.length > 2000) {
      throw new ApiError(ApiErrorType.VALIDATION_ERROR, "Question is too long. Please limit to 2000 characters.")
    }

    if (useMock) {
      // Mock response with random answer
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const responses = MOCK_RESPONSES.RAG_RESPONSES
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        sources: ["Document 1", "Document 2", "Document 3"],
      }
    }

    try {
      const url = `${API_CONFIG.RAG.URL}${API_CONFIG.RAG.ENDPOINT}`
      const response = await this.makeRequest<{ response: string; sources?: string[] }>(url, {
        method: "POST",
        body: JSON.stringify({ question: question.trim() }),
      })

      // Validate response structure
      if (!response.response || typeof response.response !== "string") {
        throw new ApiError(ApiErrorType.SERVER_ERROR, "Invalid response format from chatbot service.")
      }

      return {
        response: response.response,
        sources: response.sources || [],
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(ApiErrorType.UNKNOWN_ERROR, "Failed to get response from chatbot. Please try again.")
    }
  }
}
