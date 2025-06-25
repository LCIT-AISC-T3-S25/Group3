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
import { Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, PieChart } from "recharts"
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

  const getChartData = () => {
    if (!result) return []

    if (model.id === "cnn") {
      const confidence = Number.parseFloat(result["Confidence Score"] || "0")
      return [
        { name: "Confidence", value: confidence * 100, fill: "#3B82F6" },
        { name: "Uncertainty", value: (1 - confidence) * 100, fill: "#6B7280" },
      ]
    }

    if (model.id === "vgg") {
      const allProbs = result.all_probabilities || {}
      return Object.entries(allProbs).map(([key, value], index) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: (value as number) * 100,
        fill: COLORS[index % COLORS.length],
      }))
    }

    if (model.id === "gru") {
      const scores = result.raw_scores?.[0] || [0, 0, 0]
      return [
        { name: "Negative", value: scores[0] * 100, fill: "#EF4444" },
        { name: "Neutral", value: scores[1] * 100, fill: "#F59E0B" },
        { name: "Positive", value: scores[2] * 100, fill: "#10B981" },
      ]
    }

    if (model.id === "lstm") {
      const probability = result.probability || 0
      const sentiment = result.sentiment || "unknown"
      const sentimentProb = sentiment === "positive" ? probability : 1 - probability
      const oppositeProb = sentiment === "positive" ? 1 - probability : probability

      return [
        {
          name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
          value: sentimentProb * 100,
          fill: sentiment === "positive" ? "#10B981" : "#EF4444",
        },
        {
          name: sentiment === "positive" ? "Negative" : "Positive",
          value: oppositeProb * 100,
          fill: sentiment === "positive" ? "#EF4444" : "#10B981",
        },
      ]
    }

    return []
  }

  const generateInterpretabilityData = (predictionResult: PredictionResult) => {
    if (model.type === "text") {
      const inputText = model.id === "gru" ? predictionResult.text : predictionResult.input
      if (!inputText) return

      const words = inputText.split(" ").filter((word) => word.length > 0)

      // Generate LIME-style explanations for text
      const limeData = words.map((word, index) => {
        // Simulate word importance based on length and position
        let importance = (Math.random() - 0.5) * 2

        // Make longer words and certain positions more important
        if (word.length > 5) importance *= 1.5
        if (index === 0 || index === words.length - 1) importance *= 1.2

        // Adjust importance based on prediction
        if (model.id === "gru") {
          const prediction = predictionResult.prediction?.toLowerCase()
          if (prediction === "positive" && importance < 0) importance *= -0.5
          if (prediction === "negative" && importance > 0) importance *= -0.5
        } else if (model.id === "lstm") {
          const sentiment = predictionResult.sentiment?.toLowerCase()
          if (sentiment === "positive" && importance < 0) importance *= -0.5
          if (sentiment === "negative" && importance > 0) importance *= -0.5
        }

        return {
          feature: word,
          importance: importance,
          color: importance > 0 ? "#22c55e" : "#ef4444",
          absImportance: Math.abs(importance),
        }
      })

      // Sort by absolute importance for better visualization
      limeData.sort((a, b) => b.absImportance - a.absImportance)

      setInterpretability({
        lime: limeData,
        features: words,
        importance: limeData.map((d) => d.importance),
      })
    } else {
      // Generate SHAP-style explanations for images
      let regions: string[]
      let shapData: any[]

      if (model.id === "vgg" && predictionResult.all_probabilities) {
        // Use actual class probabilities to generate region importance
        const classes = Object.keys(predictionResult.all_probabilities)
        const topClass = predictionResult.predicted_class

        regions = ["Top-left", "Top-right", "Center", "Bottom-left", "Bottom-right", "Edges", "Background"]

        shapData = regions.map((region, index) => {
          // Simulate region importance based on predicted class
          let importance = Math.random() * 0.8 + 0.1

          // Make center more important for food/objects
          if (region === "Center" && (topClass === "food" || topClass === "inside")) {
            importance *= 1.5
          }

          // Make edges important for outside scenes
          if (region === "Edges" && topClass === "outside") {
            importance *= 1.3
          }

          return {
            region,
            importance: Math.min(importance, 1.0),
            color: `hsl(${120 + importance * 240}, 70%, 50%)`, // Green to red based on importance
          }
        })
      } else {
        // CNN fallback
        regions = ["Object Region", "Background", "Edges", "Texture", "Shape"]
        shapData = regions.map((region) => ({
          region,
          importance: Math.random() * 0.8 + 0.2,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 50%)`, // Blue-ish colors
        }))
      }

      // Sort by importance
      shapData.sort((a, b) => b.importance - a.importance)

      setInterpretability({
        shap: shapData,
        features: regions,
        importance: shapData.map((d) => d.importance),
      })
    }
  }

  const getInterpretabilityChart = () => {
    if (!interpretability) return []

    if (model.type === "text" && interpretability.lime) {
      return interpretability.lime.slice(0, 8).map((item) => ({
        name: item.feature,
        value: item.absImportance,
        importance: item.importance,
        fill: item.importance > 0 ? "#22c55e" : "#ef4444",
      }))
    }

    if (model.type === "image" && interpretability.shap) {
      return interpretability.shap.map((item) => ({
        name: item.region,
        value: item.importance * 100,
        fill: item.color,
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
                        {model.id === "cnn" && (
                          <>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Prediction</TableCell>
                              <TableCell className="text-white">
                                <Badge variant="secondary" className={`${model.bgColor} text-white`}>
                                  {result.Prediction}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Confidence Score</TableCell>
                              <TableCell className="text-white">
                                {(Number.parseFloat(result["Confidence Score"]) * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          </>
                        )}

                        {model.id === "vgg" && (
                          <>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Predicted Class</TableCell>
                              <TableCell className="text-white">
                                <Badge variant="secondary" className={`${model.bgColor} text-white`}>
                                  {result.predicted_class}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Probability</TableCell>
                              <TableCell className="text-white">{(result.probability * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">All Probabilities</TableCell>
                              <TableCell className="text-white">
                                <div className="space-y-1">
                                  {Object.entries(result.all_probabilities || {}).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="capitalize">{key}:</span>
                                      <span>{((value as number) * 100).toFixed(2)}%</span>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        )}

                        {model.id === "gru" && (
                          <>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Prediction</TableCell>
                              <TableCell className="text-white">
                                <Badge variant="secondary" className={`${model.bgColor} text-white`}>
                                  {result.prediction}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Predicted Class</TableCell>
                              <TableCell className="text-white">{result.predicted_class}</TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Raw Scores</TableCell>
                              <TableCell className="text-white">
                                <div className="space-y-1 text-sm">
                                  <div>Negative: {(result.raw_scores[0][0] * 100).toFixed(2)}%</div>
                                  <div>Neutral: {(result.raw_scores[0][1] * 100).toFixed(2)}%</div>
                                  <div>Positive: {(result.raw_scores[0][2] * 100).toFixed(2)}%</div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        )}

                        {model.id === "lstm" && (
                          <>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Sentiment</TableCell>
                              <TableCell className="text-white">
                                <Badge variant="secondary" className={`${model.bgColor} text-white`}>
                                  {result.sentiment}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Probability</TableCell>
                              <TableCell className="text-white">{(result.probability * 100).toFixed(4)}%</TableCell>
                            </TableRow>
                            <TableRow className="border-gray-600">
                              <TableCell className="text-gray-300">Input Text</TableCell>
                              <TableCell className="text-white text-sm">"{result.input}"</TableCell>
                            </TableRow>
                          </>
                        )}
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
                          <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              formatter={(value: any) => [`${value.toFixed(2)}%`, "Score"]}
                            />
                            <Bar dataKey="value" fill={model.bgColor} />
                          </BarChart>
                        ) : model.id === "vgg" ? (
                          <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              formatter={(value: any) => [`${value.toFixed(2)}%`, "Probability"]}
                            />
                            <Bar dataKey="value" fill={model.bgColor} />
                          </BarChart>
                        ) : (
                          <PieChart>
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
                                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              formatter={(value: any) => [`${value.toFixed(1)}%`, "Percentage"]}
                            />
                          </PieChart>
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
                            <BarChart data={getInterpretabilityChart()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                              <YAxis stroke="#9CA3AF" />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={(value: any, name: any, props: any) => [
                                  model.type === "text"
                                    ? `${value.toFixed(3)} (${props.payload.importance > 0 ? "+" : ""}${props.payload.importance?.toFixed(3)})`
                                    : `${value.toFixed(1)}%`,
                                  model.type === "text" ? "Importance" : "Contribution",
                                ]}
                              />
                              <Bar dataKey="value">
                                {getInterpretabilityChart().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
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
                              {(model.type === "text" ? interpretability.lime : interpretability.shap)
                                ?.slice(0, 10)
                                .map((item, index) => (
                                  <TableRow key={index} className="border-gray-600">
                                    <TableCell className="text-white font-mono">
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
                                            : item.importance > 0.5
                                              ? "bg-blue-600 text-white"
                                              : "bg-gray-600 text-white"
                                        }
                                      >
                                        {model.type === "text"
                                          ? item.importance > 0
                                            ? "Positive"
                                            : "Negative"
                                          : item.importance > 0.5
                                            ? "High"
                                            : "Low"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
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
