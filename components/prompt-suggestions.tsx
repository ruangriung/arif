"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { promptCategories, promptSuggestions } from "@/data/prompt-suggestions"

interface PromptSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function PromptSuggestions({ onSelectSuggestion }: PromptSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredSuggestions = selectedCategory
    ? promptSuggestions.filter((s) => s.categories.includes(selectedCategory))
    : promptSuggestions

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Prompt Suggestions</h3>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {promptCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 bg-secondary/50 rounded-md cursor-pointer hover:bg-secondary"
              onClick={() => onSelectSuggestion(suggestion.prompt)}
            >
              <p className="text-sm">{suggestion.prompt}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestion.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
