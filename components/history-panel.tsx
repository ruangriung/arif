"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { ImageHistory } from "@/types/image-types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import Image from "next/image"

interface HistoryPanelProps {
  history: ImageHistory[]
  onSelectHistory: (item: ImageHistory) => void
}

export function HistoryPanel({ history, onSelectHistory }: HistoryPanelProps) {
  const [, setHistory] = useLocalStorage<ImageHistory[]>("image-history", [])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your history?")) {
      setHistory([])
    }
  }

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory(history.filter((item) => item.id !== id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Update the handleSelectHistory function to prevent infinite loops
  const handleSelectHistory = (item: ImageHistory) => {
    if (selectedId === item.id) return // Don't update if already selected
    setSelectedId(item.id)
    onSelectHistory(item)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Generation History</h3>
          {history.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleClearHistory}>
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Your generation history will appear here</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg overflow-hidden border cursor-pointer transition-all ${
                  selectedId === item.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                }`}
                onClick={() => {
                  handleSelectHistory(item)
                }}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-2 bg-card">
                  <p className="text-xs line-clamp-2">{item.prompt}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
