/**
 * API Configuration and Base Client
 * Centralized API configuration and base client functionality
 */

import { APP_CONFIG } from "@/config/env"
import { ApiError, ApiErrorHandler } from "./errors"

export abstract class ApiClient {
  protected static async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API_TIMEOUT)

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

        const apiError = ApiErrorHandler.createError(null, response)
        if (errorDetails) {
          apiError.message = errorDetails
        }
        throw apiError
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      throw ApiErrorHandler.createError(error)
    }
  }

  protected static getHeaders(apiKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`
      // Alternative: headers['X-API-Key'] = apiKey
    }

    return headers
  }

  protected static validateInput(input: string, maxLength: number, fieldName: string): void {
    if (!input || input.trim().length === 0) {
      throw new ApiError("VALIDATION_ERROR" as any, `Please enter ${fieldName.toLowerCase()} to continue.`)
    }

    if (input.length > maxLength) {
      throw new ApiError(
        "VALIDATION_ERROR" as any,
        `${fieldName} is too long. Please limit to ${maxLength} characters.`,
      )
    }
  }

  protected static async validateImageUrl(imageUrl: string): Promise<void> {
    try {
      const imageCheck = await fetch(imageUrl, { method: "HEAD" })
      if (!imageCheck.ok) {
        throw new ApiError("SERVER_ERROR" as any, "Generated image is not accessible. Please try again.")
      }
    } catch {
      // If HEAD request fails, log the issue but don't throw
      console.warn("Could not verify image accessibility:", imageUrl)
    }
  }
}
