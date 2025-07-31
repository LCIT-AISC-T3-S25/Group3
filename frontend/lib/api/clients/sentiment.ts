/**
 * Sentiment Analysis API Client
 * Handles sentiment analysis requests using Transformer models
 */

import { ApiClient } from "../config"
import type { SentimentRequest, SentimentResponse, MockSentimentResponse } from "../types"
import { SENTIMENT_CONFIG } from "@/config/env"
import { INPUT_LIMITS, MOCK_DATA } from "@/config/constants"

export class SentimentApiClient extends ApiClient {
  private static readonly API_URL = SENTIMENT_CONFIG.API_URL
  private static readonly API_KEY = SENTIMENT_CONFIG.API_KEY
  private static readonly ENDPOINT = SENTIMENT_CONFIG.ENDPOINT

  /**
   * Analyze sentiment of the provided text
   * @param text - Text to analyze (max 5000 characters)
   * @param useMock - Whether to use mock data instead of real API
   * @returns Promise<SentimentResponse | MockSentimentResponse>
   */
  static async analyzeSentiment(text: string, useMock = false): Promise<SentimentResponse | MockSentimentResponse> {
    // Input validation
    this.validateInput(text, INPUT_LIMITS.SENTIMENT_TEXT_MAX, "Text")

    if (useMock) {
      // Mock response with random sentiment
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const responses = MOCK_DATA.SENTIMENT_RESPONSES
      return responses[Math.floor(Math.random() * responses.length)]
    }

    try {
      const url = `${this.API_URL}${this.ENDPOINT}`
      const requestBody: SentimentRequest = { text: text.trim() }

      const response = await this.makeRequest<SentimentResponse>(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: this.getHeaders(this.API_KEY),
      })

      // Validate response structure
      if (!response.sentiment || typeof response.confidence !== "number") {
        throw new Error("Invalid response format from sentiment analysis service.")
      }

      return response
    } catch (error) {
      console.error("Sentiment API Error:", error)
      throw error
    }
  }

  /**
   * Get API health status
   * @returns Promise<boolean>
   */
  static async getHealthStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })
      return response.ok
    } catch {
      return false
    }
  }
}
