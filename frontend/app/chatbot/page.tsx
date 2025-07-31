"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare, Loader2, Send, Bot, User } from "lucide-react"
import { RAGApiClient } from "@/lib/api/clients/rag"
import { useMockApi } from "@/contexts/mock-api-context"
import { ErrorDisplay } from "@/components/error-display"
import { useApiError } from "@/hooks/use-api-error"
import { INPUT_LIMITS } from "@/config/constants"

interface Message {
  role: "user" | "assistant" | "error"
  content: string
}

export default function ChatbotPage() {
  const { isMockMode } = useMockApi()
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const { error, isLoading, executeWithErrorHandling, clearError } = useApiError()

  const askQuestion = async () => {
    if (!question.trim()) return

    const userMessage: Message = { role: "user", content: question }
    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = question
    setQuestion("")

    await executeWithErrorHandling(
      () => RAGApiClient.askQuestion(currentQuestion, isMockMode),
      (result) => {
        const assistantMessage: Message = { role: "assistant", content: result.response }
        setMessages((prev) => [...prev, assistantMessage])
      },
      (error) => {
        const errorMessage: Message = {
          role: "error",
          content: error.message || "Sorry, I encountered an error. Please try again.",
        }
        setMessages((prev) => [...prev, errorMessage])
      },
    )
  }

  const handleRetry = () => {
    clearError()
    // Remove the last error message and retry with the last user question
    setMessages((prev) => {
      const lastUserMessage = [...prev].reverse().find((msg) => msg.role === "user")
      if (lastUserMessage) {
        setQuestion(lastUserMessage.content)
        return prev.filter((msg) => msg.role !== "error")
      }
      return prev
    })
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">RAG Chatbot</h1>
          </div>
          <p className="text-gray-400">Intelligent conversational AI with retrieval-augmented generation</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length > 0 && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                              : message.role === "error"
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : "bg-gradient-to-r from-pink-500 to-rose-500"
                          }`}
                        >
                          {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                              : message.role === "error"
                                ? "bg-red-900/50 border border-red-800 text-red-200"
                                : "bg-gray-800 text-gray-100"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter your question and get an intelligent response powered by RAG (max{" "}
                {INPUT_LIMITS.RAG_QUESTION_MAX.toLocaleString()} characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="What would you like to know? Ask me anything..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), askQuestion())}
                  maxLength={INPUT_LIMITS.RAG_QUESTION_MAX}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                  {question.length}/{INPUT_LIMITS.RAG_QUESTION_MAX.toLocaleString()}
                </div>
              </div>
              <Button
                onClick={askQuestion}
                disabled={!question.trim() || isLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && messages.length === 0 && <ErrorDisplay error={error} onRetry={handleRetry} />}

          {messages.length === 0 && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Start a conversation by asking a question above</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
