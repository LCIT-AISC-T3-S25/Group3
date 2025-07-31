"use client"

import { AlertCircle, RefreshCw, Wifi, Clock, Server, Shield, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApiError, ApiErrorType } from "@/lib/api-client"

interface ErrorDisplayProps {
  error: ApiError | Error | string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ error, onRetry, className = "" }: ErrorDisplayProps) {
  const getErrorIcon = (type: ApiErrorType) => {
    switch (type) {
      case ApiErrorType.NETWORK_ERROR:
        return <Wifi className="w-8 h-8 text-red-400" />
      case ApiErrorType.TIMEOUT_ERROR:
        return <Clock className="w-8 h-8 text-yellow-400" />
      case ApiErrorType.SERVER_ERROR:
        return <Server className="w-8 h-8 text-red-400" />
      case ApiErrorType.VALIDATION_ERROR:
        return <AlertCircle className="w-8 h-8 text-orange-400" />
      case ApiErrorType.UNAUTHORIZED:
        return <Shield className="w-8 h-8 text-red-400" />
      case ApiErrorType.NOT_FOUND:
        return <Search className="w-8 h-8 text-gray-400" />
      case ApiErrorType.RATE_LIMITED:
        return <Zap className="w-8 h-8 text-yellow-400" />
      default:
        return <AlertCircle className="w-8 h-8 text-red-400" />
    }
  }

  const getErrorColor = (type: ApiErrorType) => {
    switch (type) {
      case ApiErrorType.VALIDATION_ERROR:
        return "border-orange-800 bg-orange-900/20"
      case ApiErrorType.TIMEOUT_ERROR:
      case ApiErrorType.RATE_LIMITED:
        return "border-yellow-800 bg-yellow-900/20"
      case ApiErrorType.NOT_FOUND:
        return "border-gray-800 bg-gray-900/20"
      default:
        return "border-red-800 bg-red-900/20"
    }
  }

  const errorMessage =
    error instanceof ApiError ? error.message : error instanceof Error ? error.message : String(error)

  const errorType = error instanceof ApiError ? error.type : ApiErrorType.UNKNOWN_ERROR
  const showRetry = onRetry && errorType !== ApiErrorType.VALIDATION_ERROR

  return (
    <Card className={`${getErrorColor(errorType)} ${className}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {getErrorIcon(errorType)}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Something went wrong</h3>
            <p className="text-sm text-gray-300 max-w-md">{errorMessage}</p>
          </div>
          {showRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
