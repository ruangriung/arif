"use client"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptInput } from "@/components/prompt-input"
import { ImageDisplay } from "@/components/image-display"
import { ParameterControls } from "@/components/parameter-controls"
import { HistoryPanel } from "@/components/history-panel"
import { PromptSuggestions } from "@/components/prompt-suggestions"
import type { ImageHistory, ImageParams, ImageModel } from "@/types/image-types"
import { generateRandomSeed } from "@/lib/utils"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentParams, setCurrentParams] = useState<ImageParams>({
    model: "flux" as ImageModel,
    nologo: true,
    enhance: true,
    size: "1024x1792", // Ukuran default baru
    quality: "hd",
    seed: generateRandomSeed(),
  })

  const [history, setHistory] = useLocalStorage<ImageHistory[]>("image-history", [])
  const [savedPrompts, setSavedPrompts] = useLocalStorage<string[]>("saved-prompts", [])

  const generateImage = async (regenerate = false) => {
    if ((!prompt && !regenerate) || isGenerating) return

    setIsGenerating(true)

    const workingParams = { ...currentParams }

    if (regenerate) {
      workingParams.seed = generateRandomSeed()
    }

    try {
      const params = new URLSearchParams()
      if (workingParams.nologo) params.append("nologo", "true")
      if (workingParams.enhance) params.append("enhance", "true")
      params.append("size", workingParams.size)
      params.append("quality", workingParams.quality)
      params.append("seed", workingParams.seed.toString())

      const encodedPrompt = encodeURIComponent(`${workingParams.model}:${prompt}`)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`

      setCurrentImage(imageUrl)

      if (regenerate) {
        setCurrentParams(workingParams)
      }

      const newHistoryItem: ImageHistory = {
        id: Date.now().toString(),
        prompt,
        imageUrl,
        params: { ...workingParams },
        timestamp: new Date().toISOString(),
      }

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50))

      if (prompt && !savedPrompts.includes(prompt)) {
        setSavedPrompts((prev) => [prompt, ...prev].slice(0, 100))
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePromptSubmit = (inputPrompt: string) => {
    generateImage()
  }

  const handleRegenerate = () => {
    generateImage(true)
  }

  const handleParamsChange = (params: Partial<ImageParams>) => {
    setCurrentParams((prev) => ({ ...prev, ...params }))
  }

  const handleSelectHistory = (item: ImageHistory) => {
    setPrompt(item.prompt)
    setCurrentParams(item.params)
    setCurrentImage(item.imageUrl)
  }

  const handleSelectSavedPrompt = (savedPrompt: string) => {
    setPrompt(savedPrompt)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="mb-6">
          <CardContent className="p-6">
            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handlePromptSubmit}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
            />
          </CardContent>
        </Card>

        <ImageDisplay
          imageUrl={currentImage}
          prompt={prompt}
          isLoading={isGenerating}
          onRegenerate={handleRegenerate}
        />

        <Card className="mt-6">
          <CardContent className="p-6">
            <ParameterControls params={currentParams} onParamsChange={handleParamsChange} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="saved">Saved Prompts</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <HistoryPanel history={history} onSelectHistory={handleSelectHistory} />
          </TabsContent>
          <TabsContent value="saved">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Saved Prompts</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {savedPrompts.map((savedPrompt, index) => (
                    <div
                      key={index}
                      className="p-2 bg-secondary/50 rounded-md cursor-pointer hover:bg-secondary"
                      onClick={() => handleSelectSavedPrompt(savedPrompt)}
                    >
                      {savedPrompt}
                    </div>
                  ))}
                  {savedPrompts.length === 0 && <p className="text-muted-foreground text-sm">No saved prompts yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="suggestions">
            <PromptSuggestions onSelectSuggestion={handleSelectSavedPrompt} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
