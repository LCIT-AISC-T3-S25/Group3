/**
 * GLIDE Text-to-Image API Client
 * Handles text-to-image generation using GLIDE model
 */

import { ApiClient } from "../config"
import type { GLIDERequest, GLIDEResponse } from "../types"
import { GLIDE_CONFIG } from "@/config/env"
import { INPUT_LIMITS } from "@/config/constants"

export class GLIDEApiClient extends ApiClient {
  private static readonly API_URL = GLIDE_CONFIG.API_URL
  private static readonly API_KEY = GLIDE_CONFIG.API_KEY
  private static readonly ENDPOINT = GLIDE_CONFIG.ENDPOINT

  /**
   * Generate image from text description
   * @param text - Text description for image generation (max 1000 characters)
   * @param useMock - Whether to use mock data instead of real API
   * @param options - Additional generation options
   * @returns Promise<{imageUrl: string, generated_image_url: string, caption: string}>
   */
  static async generateImageFromText(
    text: string,
    useMock = false,
    options?: {
      width?: number
      height?: number
      steps?: number
      guidance_scale?: number
    },
  ): Promise<{ imageUrl: string; generated_image_url: string; caption: string }> {
    // Input validation
    this.validateInput(text, INPUT_LIMITS.GLIDE_CAPTION_MAX, "Caption")

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
      const url = `${this.API_URL}${this.ENDPOINT}`
      const requestBody: GLIDERequest = {
        text: text.trim(),
        ...options,
      }

      const response = await this.makeRequest<GLIDEResponse>(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: this.getHeaders(this.API_KEY),
      })

      // Validate response structure
      if (!response.generated_image_url || typeof response.generated_image_url !== "string") {
        throw new Error("Invalid response format from image generation service.")
      }

      // Validate that the image URL is accessible
      await this.validateImageUrl(response.generated_image_url)

      return {
        imageUrl: response.generated_image_url,
        generated_image_url: response.generated_image_url,
        caption: text.trim(),
      }
    } catch (error) {
      console.error("GLIDE API Error:", error)
      throw error
    }
  }

  /**
   * Get default generation parameters
   * @returns Promise<object>
   */
  static async getDefaultParameters(): Promise<{
    width: number
    height: number
    steps: number
    guidance_scale: number
  }> {
    try {
      const response = await fetch(`${this.API_URL}/defaults`, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })

      if (response.ok) {
        const data = await response.json()
        return (
          data.parameters || {
            width: 512,
            height: 512,
            steps: 50,
            guidance_scale: 7.5,
          }
        )
      }

      return {
        width: 512,
        height: 512,
        steps: 50,
        guidance_scale: 7.5,
      }
    } catch {
      return {
        width: 512,
        height: 512,
        steps: 50,
        guidance_scale: 7.5,
      }
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
