"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText, Eye } from "lucide-react"
import { Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ModelInfo {
  id: string
  name: string
  description: string
  type: "image" | "text"
  endpoint: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface ModelDashboardProps {
  model: ModelInfo
}

interface PredictionResult {
  [key: string]: any
}

interface InterpretabilityData {
  lime?: any[]
  shap?: any[]
  features?: string[]
  importance?: number[]
}

export default function ModelDashboard({ model }: ModelDashboardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [interpretability, setInterpretability] = useState<InterpretabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    if (model.type === "image" && !file) {
      setError("Please select an image file")
      return
    }
    if (model.type === "text" && !text.trim()) {
      setError("Please enter some text")
      return
    }

    setLoading(true)
    setError(null)

    try {
      let response: Response

      if (model.type === "image") {
        const formData = new FormData()
        formData.append("file", file!)

        response = await fetch(model.endpoint, {
          method: "POST",
          body: formData,
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        })
      } else {
        response = await fetch(model.endpoint, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ text: text.trim() }),
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Generate mock interpretability data
      generateInterpretabilityData(data)
    } catch (err) {
      console.error("Prediction error:", err)
      setError(`Failed to get prediction: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const generateInterpretabilityData = (predictionResult: PredictionResult) => {
    // Mock interpretability data generation
    if (model.type === "text") {
      const words = text.split(" ").slice(0, 10)
      const limeData = words.map((word, index) => ({
        feature: word,
        importance: (Math.random() - 0.5) * 2, // Random importance between -1 and 1
        color: Math.random() - 0.5 > 0 ? "#22c55e" : "#ef4444",
      }))

      setInterpretability({
        lime: limeData,
        features: words,
        importance: limeData.map((d) => d.importance),
      })
    } else {
      // Mock SHAP data for images
      const regions = ["Top-left", "Top-right", "Center", "Bottom-left", "Bottom-right"]
      const shapData = regions.map((region) => ({
        region,
        importance: Math.random() * 0.8 + 0.1, // Random importance between 0.1 and 0.9
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }))

      setInterpretability({
        shap: shapData,
        features: regions,
        importance: shapData.map((d) => d.importance),
      })
    }
  }

  const getChartData = () => {
    if (!result) return []

    if (model.id === "cnn" || model.id === "vgg") {
      const confidence = Number.parseFloat(result["Confidence Score"] || "0")
      return [
        { name: "Confidence", value: confidence * 100 },
        { name: "Uncertainty", value: (1 - confidence) * 100 },
      ]
    }

    if (model.id === "gru") {
      const scores = result.raw_scores?.[0] || [0, 0, 0]
      return [
        { name: "Negative", value: scores[0] * 100 },
        { name: "Neutral", value: scores[1] * 100 },
        { name: "Positive", value: scores[2] * 100 },
      ]
    }

    if (model.id === "lstm") {
      const probability = result.probability || 0
      return [
        { name: result.sentiment || "Unknown", value: probability * 100 },
        { name: "Opposite", value: (1 - probability) * 100 },
      ]
    }

    return []
  }

  const getInterpretabilityChart = () => {
    if (!interpretability) return []

    if (model.type === "text" && interpretability.lime) {
      return interpretability.lime.map((item) => ({
        name: item.feature,
        value: Math.abs(item.importance),
        color: item.color,
      }))
    }

    if (model.type === "image" && interpretability.shap) {
      return interpretability.shap.map((item) => ({
        name: item.region,
        value: item.importance * 100,
        color: item.color,
      }))
    }

    return []
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-full ${model.bgColor}`}>
            <div className="text-white">{model.icon}</div>
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${model.color}`}>{model.name}</h1>
            <p className="text-gray-400">{model.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="h-5 w-5" />
              Input
            </CardTitle>
            <CardDescription className="text-gray-400">
              {model.type === "image" ? "Upload an image file" : "Enter text for analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {model.type === "image" ? (
              <div>
                <Label htmlFor="file-input" className="text-white">
                  Select Image
                </Label>
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {file && <div className="mt-2 text-sm text-gray-300">Selected: {file.name}</div>}
              </div>
            ) : (
              <div>
                <Label htmlFor="text-input" className="text-white">
                  Input Text
                </Label>
                <Textarea
                  id="text-input"
                  placeholder="Enter text for analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                />
              </div>
            )}

            <Button
              onClick={handlePredict}
              disabled={loading || (model.type === "image" ? !file : !text.trim())}
              className={`w-full ${model.bgColor} hover:opacity-90`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Predict"
              )}
            </Button>

            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="results" className="text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="visualization" className="text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Charts
                </TabsTrigger>
                <TabsTrigger value="interpretability" className="text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Interpretability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Prediction Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-300">Metric</TableHead>
                          <TableHead className="text-gray-300">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(result).map(([key, value]) => (
                          <TableRow key={key} className="border-gray-600">
                            <TableCell className="text-gray-300 capitalize">{key.replace(/_/g, " ")}</TableCell>
                            <TableCell className="text-white">
                              {typeof value === "string" ? (
                                <Badge variant="secondary" className={`${model.bgColor} text-white`}>
                                  {value}
                                </Badge>
                              ) : Array.isArray(value) ? (
                                <div className="space-y-1">
                                  {value.map((item, index) => (
                                    <div key={index} className="text-sm">
                                      {Array.isArray(item)
                                        ? item.map((v) => (typeof v === "number" ? v.toFixed(4) : v)).join(", ")
                                        : typeof item === "number"
                                          ? item.toFixed(4)
                                          : item}
                                    </div>
                                  ))}
                                </div>
                              ) : typeof value === "number" ? (
                                value.toFixed(4)
                              ) : (
                                String(value)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualization">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Prediction Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Value", color: model.bgColor },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {model.id === "gru" ? (
                          <Bar data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Cell fill={model.bgColor} />
                          </Bar>
                        ) : (
                          <Pie
                            data={getChartData()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        )}
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interpretability">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {model.type === "text" ? "LIME Analysis" : "SHAP Analysis"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {model.type === "text"
                        ? "Local Interpretable Model-agnostic Explanations for text features"
                        : "SHapley Additive exPlanations for image regions"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {interpretability ? (
                      <div className="space-y-6">
                        <ChartContainer
                          config={{
                            importance: { label: "Importance", color: model.bgColor },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <Bar data={getInterpretabilityChart()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="name" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Cell fill={model.bgColor} />
                            </Bar>
                          </ResponsiveContainer>
                        </ChartContainer>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Feature Importance</h4>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-600">
                                <TableHead className="text-gray-300">
                                  {model.type === "text" ? "Word" : "Region"}
                                </TableHead>
                                <TableHead className="text-gray-300">Importance</TableHead>
                                <TableHead className="text-gray-300">Impact</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(model.type === "text" ? interpretability.lime : interpretability.shap)?.map(
                                (item, index) => (
                                  <TableRow key={index} className="border-gray-600">
                                    <TableCell className="text-white">
                                      {model.type === "text" ? item.feature : item.region}
                                    </TableCell>
                                    <TableCell className="text-white">
                                      {model.type === "text"
                                        ? item.importance.toFixed(3)
                                        : (item.importance * 100).toFixed(1) + "%"}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="secondary"
                                        className={
                                          model.type === "text"
                                            ? item.importance > 0
                                              ? "bg-green-600 text-white"
                                              : "bg-red-600 text-white"
                                            : "bg-blue-600 text-white"
                                        }
                                      >
                                        {model.type === "text"
                                          ? item.importance > 0
                                            ? "Positive"
                                            : "Negative"
                                          : "Contributing"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        Make a prediction to see interpretability analysis
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-xl">Ready for Prediction</div>
                  <div className="text-sm">Upload your data and click predict to see results</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
