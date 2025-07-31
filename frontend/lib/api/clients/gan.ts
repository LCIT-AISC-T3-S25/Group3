/**
 * GAN Image Generation API Client
 * Handles random image generation using Generative Adversarial Networks
 */

import { ApiClient } from "../config"
import type { GANResponse } from "../types"
import { GAN_CONFIG } from "@/config/env"
import { MOCK_DATA } from "@/config/constants"

export class GANApiClient extends ApiClient {
  private static readonly API_URL = GAN_CONFIG.API_URL
  private static readonly API_KEY = GAN_CONFIG.API_KEY
  private static readonly ENDPOINT = GAN_CONFIG.ENDPOINT

  /**
   * Generate a random image using GAN
   * @param useMock - Whether to use mock data instead of real API
   * @returns Promise<{imageUrl: string, file: string}>
   */
  static async generateRandomImage(useMock = false): Promise<{ imageUrl: string; file: string }> {
    if (useMock) {
      // Mock response with sample image
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        imageUrl: MOCK_DATA.GAN_SAMPLE_IMAGE,
        file: "sample_gan.png",
      }
    }

    try {
      const url = `${this.API_URL}${this.ENDPOINT}`

      const response = await this.makeRequest<GANResponse>(url, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })

      // Validate response structure
      if (!response.file || typeof response.file !== "string") {
        throw new Error("Invalid response format from image generation service.")
      }

      const imageUrl = `${this.API_URL}/${response.file}`

      // Validate that the image URL is accessible
      await this.validateImageUrl(imageUrl)

      return {
        imageUrl,
        file: response.file,
      }
    } catch (error) {
      console.error("GAN API Error:", error)
      throw error
    }
  }

  /**
   * Get available image formats
   * @returns Promise<string[]>
   */
  static async getSupportedFormats(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/formats`, {
        method: "GET",
        headers: this.getHeaders(this.API_KEY),
      })

      if (response.ok) {
        const data = await response.json()
        return data.formats || ["png", "jpg"]
      }

      return ["png", "jpg"] // Default formats
    } catch {
      return ["png", "jpg"] // Default formats
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
