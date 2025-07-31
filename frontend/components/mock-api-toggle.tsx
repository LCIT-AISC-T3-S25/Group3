"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMockApi } from "@/contexts/mock-api-context"

export function MockApiToggle() {
  const { isMockMode, toggleMockMode } = useMockApi()

  return (
    <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2">
      <Label htmlFor="mock-api-toggle" className="text-sm text-gray-300">
        Mock API
      </Label>
      <Switch
        id="mock-api-toggle"
        checked={isMockMode}
        onCheckedChange={toggleMockMode}
        className="data-[state=checked]:bg-teal-600"
      />
      <span className="text-xs text-gray-400">{isMockMode ? "ON" : "OFF"}</span>
    </div>
  )
}
