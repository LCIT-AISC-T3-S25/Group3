"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MockApiContextType {
  isMockMode: boolean
  toggleMockMode: () => void
}

const MockApiContext = createContext<MockApiContextType | undefined>(undefined)

export function MockApiProvider({ children }: { children: ReactNode }) {
  const [isMockMode, setIsMockMode] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mockApiMode")
    if (saved !== null) {
      setIsMockMode(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("mockApiMode", JSON.stringify(isMockMode))
  }, [isMockMode])

  const toggleMockMode = () => {
    setIsMockMode(!isMockMode)
  }

  return <MockApiContext.Provider value={{ isMockMode, toggleMockMode }}>{children}</MockApiContext.Provider>
}

export function useMockApi() {
  const context = useContext(MockApiContext)
  if (context === undefined) {
    throw new Error("useMockApi must be used within a MockApiProvider")
  }
  return context
}
