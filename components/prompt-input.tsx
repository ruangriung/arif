"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, Send, Sparkles } from "lucide-react"

interface PromptInputProps {
  prompt: string
  onPromptChange: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  onRegenerate: () => void
}

export function PromptInput({ prompt, onPromptChange, onSubmit, isGenerating, onRegenerate }: PromptInputProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating && !isEnhancing) {
      onSubmit(prompt)
    }
  }

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing || isGenerating) return

    setIsEnhancing(true)
    const originalPrompt = prompt
    onPromptChange("") // Kosongkan prompt untuk menampilkan hasil streaming

    try {
      const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          model: "openai",
          messages: [
            {
              role: "user",
              content: `You are an expert prompt engineer for AI image generators. Your task is to rewrite and enhance the following user prompt. Make it highly detailed, descriptive, and vivid, suitable for generating a stunning image. The output should ONLY be the new, enhanced prompt itself, without any of your own conversational text, explanations, or quotation marks. User prompt: "${prompt}"`,
            },
          ],
          stream: true,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6)
            if (data.trim() === "[DONE]") {
              reader.cancel()
              return
            }
            try {
              const chunk = JSON.parse(data)
              const content = chunk?.choices?.[0]?.delta?.content
              if (content) {
                onPromptChange((prev) => prev + content)
              }
            } catch (e) {
              console.error("Error parsing stream data:", data, e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      onPromptChange(originalPrompt) // Kembalikan prompt asli jika terjadi error
    } finally {
      setIsEnhancing(false)
    }
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
        <Button type="submit" disabled={!prompt.trim() || isGenerating || isEnhancing} className="flex-1">
          {isGenerating ? "Generating..." : "Generate Image"}
          <Send />
        </Button>
        <Button type="button" variant="outline" onClick={onRegenerate} disabled={!prompt.trim() || isGenerating || isEnhancing}>
          <RefreshCw />
          Regenerate
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleEnhancePrompt}
          disabled={!prompt.trim() || isGenerating || isEnhancing}
        >
          <Sparkles className={isEnhancing ? "animate-spin" : ""} />
          {isEnhancing ? "Enhancing..." : "Enhance"}
        </Button>
      </div>
    </form>
  )
}
