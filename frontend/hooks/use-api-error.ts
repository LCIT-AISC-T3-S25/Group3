"use client"

import { useState, useCallback } from "react"
import { ApiError } from "@/lib/api-client"

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const executeWithErrorHandling = useCallback(
    async (
      apiCall: () => Promise<any>,
      onSuccess?: (result: any) => void,
      onError?: (error: ApiError) => void,
    ): Promise<any | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await apiCall()
        if (onSuccess) {
          onSuccess(result)
        }
        return result
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError("UNKNOWN_ERROR" as any, err instanceof Error ? err.message : "An unknown error occurred")
        setError(apiError)
        if (onError) {
          onError(apiError)
        }
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError,
  }
}
