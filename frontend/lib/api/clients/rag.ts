/**
 * RAG Chatbot API Client
 * Handles conversational AI with retrieval-augmented generation
 */

import { ApiClient } from "../config"
import type { RAGRequest, RAGResponse } from "../types"
import { RAG_CONFIG } from "@/config/env"
import { INPUT_LIMITS, MOCK_DATA } from "@/config/constants"

export class RAGApiClient extends ApiClient {
  private static readonly API_URL = RAG_CONFIG.API_URL
  private static readonly API_KEY = RAG_CONFIG.API_KEY
  private static readonly ENDPOINT = RAG_CONFIG.ENDPOINT

  /**
   * Ask a question to the RAG chatbot
   * @param question - Question to ask (max 2000 characters)
   * @param useMock - Whether to use mock data instead of real API
   * @param options - Additional chat options
   * @returns Promise<{response: string, sources: string[]}>
   */
  static async askQuestion(
    question: string,
    useMock = false,
    options?: {
      context?: string
      max_tokens?: number
      temperature?: number
    },
  ): Promise<{ response: string; sources: string[] }> {
    // Input validation
    this.validateInput(question, INPUT_LIMITS.RAG_QUESTION_MAX, "Question")

    if (useMock) {
      // Mock response with random answer
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const responses = MOCK_DATA.RAG_RESPONSES
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        sources: ["Document 1", "Document 2", "Document 3"],
      }
    }

    try {
      const url = `${this.API_URL}${this.ENDPOINT}`
      const requestBody: RAGRequest = {
        question: question.trim(),
        ...options,
      }

      const response = await this.makeRequest<RAGResponse>(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: this.getHeaders(this.API_KEY),
      })

      // Validate response structure
      if (!response.response || typeof response.response !== "string") {
        throw new Error("Invalid response format from chatbot service.")
      }

      return {
        response: response.response,
        sources: response.sources || [],
      }
    } catch (error) {
      console.error("RAG API Error:", error)
      throw error
    }
  }

  /**
   * Get available knowledge base sources
   * @returns Promise<string[]>
   */
  static async getKnowledgeBaseSources(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/sources`, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })

      if (response.ok) {
        const data = await response.json()
        return data.sources || []
      }

      return []
    } catch {
      return []
    }
  }

  /**
   * Get chat history (if supported by API)
   * @param sessionId - Session identifier
   * @returns Promise<Array<{question: string, response: string, timestamp: string}>>
   */
  static async getChatHistory(sessionId: string): Promise<
    Array<{
      question: string
      response: string
      timestamp: string
    }>
  > {
    try {
      const response = await fetch(`${this.API_URL}/history/${sessionId}`, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })

      if (response.ok) {
        const data = await response.json()
        return data.history || []
      }

      return []
    } catch {
      return []
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
