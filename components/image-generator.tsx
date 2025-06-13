"use client"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { PromptInput } from "@/components/prompt-input.tsx"
import { ImageDisplay } from "@/components/image-display.tsx"
import { ParameterControls } from "@/components/parameter-controls.tsx"
import { HistoryPanel } from "@/components/history-panel.tsx"
import { PromptSuggestions } from "@/components/prompt-suggestions.tsx"
import type { ImageHistory, ImageParams, ImageModel } from "@/types/image-types.ts"
import { generateRandomSeed } from "@/lib/utils.ts"

export function ImageGenerator() {
  const [prompt, setPrompt] = useLocalStorage<string>("current-prompt", "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentParams, setCurrentParams] = useState<ImageParams>({
    model: "flux" as ImageModel,
    nologo: true,
    enhance: true,
    size: "1024x1792",
    quality: "hd",
    seed: generateRandomSeed(),
  })

  const [history, setHistory] = useLocalStorage<ImageHistory[]>("image-history", [])
  const [savedPrompts, setSavedPrompts] = useLocalStorage<string[]>("saved-prompts", [])

  // --- PERUBAHAN PADA FUNGSI INI ---
  const generateImage = async (regenerate = false) => {
    if ((!prompt && !regenerate) || isGenerating) return

    setIsGenerating(true)
    const workingParams = { ...currentParams }

    if (regenerate) {
      workingParams.seed = generateRandomSeed()
    }

    try {
      const params = new URLSearchParams()
      
      // 1. Menambahkan model sebagai query parameter
      params.append("model", workingParams.model)

      // 2. Menambahkan parameter lainnya
      const [width, height] = workingParams.size.split('x')
      if (width) params.append("width", width)
      if (height) params.append("height", height)
      if (workingParams.nologo) params.append("nologo", "true")
      if (workingParams.enhance) params.append("enhance", "true")
      params.append("quality", workingParams.quality)
      params.append("seed", workingParams.seed.toString())
      
      // 3. Hanya melakukan encode pada prompt saja
      const encodedPrompt = encodeURIComponent(prompt)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`

      console.log("Generating with URL:", imageUrl);

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
  // --- BATAS PERUBAHAN ---

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
          size={currentParams.size}
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
