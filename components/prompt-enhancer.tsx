"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { styleModifiers, qualityModifiers } from "@/data/prompt-suggestions"

interface PromptEnhancerProps {
  prompt: string
  onPromptChange: (prompt: string) => void
}

export function PromptEnhancer({ prompt, onPromptChange }: PromptEnhancerProps) {
  const [open, setOpen] = useState(false)
  const [workingPrompt, setWorkingPrompt] = useState("")

  const openDialog = () => {
    setWorkingPrompt(prompt)
    setOpen(true)
  }

  const applyModifier = (modifier: string) => {
    if (workingPrompt.includes(modifier)) {
      return // Don't add duplicates
    }

    setWorkingPrompt((prev) => {
      if (prev.trim() === "") return modifier
      return `${prev}, ${modifier}`
    })
  }

  const applyEnhancedPrompt = () => {
    onPromptChange(workingPrompt)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={openDialog} disabled={!prompt} className="w-full sm:w-auto">
          <Sparkles className="h-4 w-4 mr-2" />
          Enhance Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enhance Your Prompt</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-secondary/30 p-3 rounded-md mb-4">
            <p className="text-sm font-medium mb-1">Current Prompt:</p>
            <p className="text-sm">{workingPrompt}</p>
          </div>

          <Tabs defaultValue="style">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="style">Style Modifiers</TabsTrigger>
              <TabsTrigger value="quality">Quality Modifiers</TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="mt-4">
              <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
                {styleModifiers.map((modifier) => (
                  <Badge
                    key={modifier}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => applyModifier(modifier)}
                  >
                    {modifier}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quality" className="mt-4">
              <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
                {qualityModifiers.map((modifier) => (
                  <Badge
                    key={modifier}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => applyModifier(modifier)}
                  >
                    {modifier}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyEnhancedPrompt}>Apply Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
