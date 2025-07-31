/**
 * API Error Handling
 * Comprehensive error management for API calls
 */

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

export class ApiErrorHandler {
  static getErrorType(error: any, response?: Response): ApiErrorType {
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

  static getErrorMessage(type: ApiErrorType, statusCode?: number): string {
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
        return "Authentication required. Please check your API key and try again."
      case ApiErrorType.NOT_FOUND:
        return "The requested resource was not found. The API endpoint may be unavailable."
      case ApiErrorType.RATE_LIMITED:
        return "Too many requests. Please wait a moment before trying again."
      default:
        return `An unexpected error occurred${statusCode ? ` (${statusCode})` : ""}. Please try again.`
    }
  }

  static createError(error: any, response?: Response): ApiError {
    const errorType = this.getErrorType(error, response)
    const errorMessage = this.getErrorMessage(errorType, response?.status)

    return new ApiError(
      errorType,
      errorMessage,
      response?.status,
      error instanceof Error ? error : new Error(String(error)),
    )
  }
}
