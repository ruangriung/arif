"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, Send, Sparkles } from "lucide-react"

interface PromptInputProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  onRegenerate: () => void
}

export function PromptInput({ prompt, onPromptChange, onSubmit, isGenerating, onRegenerate }: PromptInputProps) {
  // Update the handleSubmit function to prevent multiple submissions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt)
    }
  }

  const handleEnhancePrompt = () => {
    // Add some common enhancers to the prompt
    const enhancers = [
      "highly detailed",
      "professional photography",
      "sharp focus",
      "dramatic lighting",
      "8k resolution",
    ]

    const randomEnhancers = enhancers
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .join(", ")

    onPromptChange(`${prompt}, ${randomEnhancers}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          Enter your prompt
        </label>
        <Textarea
          id="prompt"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!prompt.trim() || isGenerating} className="flex-1">
          {isGenerating ? "Generating..." : "Generate Image"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" onClick={onRegenerate} disabled={!prompt.trim() || isGenerating}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleEnhancePrompt}
          disabled={!prompt.trim() || isGenerating}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Enhance
        </Button>
      </div>
    </form>
  )
}
