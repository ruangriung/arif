"use client"

import React, { useState, useEffect } from "react"
import type { ImageParams, ImageModel } from "@/types/image-types"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dices } from "lucide-react"
import { generateRandomSeed } from "@/lib/utils"

interface ParameterControlsProps {
  params: ImageParams
  onParamsChange: (params: Partial<ImageParams>) => void
}

export function ParameterControls({ params, onParamsChange }: ParameterControlsProps) {
  const predefinedSizes = ["1024x1792", "1024x1024", "1792x1024"]

  // State untuk melacak apakah mode "Custom" dipilih di dropdown
  const [isCustomMode, setIsCustomMode] = useState(!predefinedSizes.includes(params.size))
  
  // State untuk nilai input kustom
  const [customWidth, setCustomWidth] = useState(params.size.split("x")[0])
  const [customHeight, setCustomHeight] = useState(params.size.split("x")[1])

  // Sinkronkan state lokal jika props dari parent berubah (misalnya, memilih dari riwayat)
  useEffect(() => {
    const isCustom = !predefinedSizes.includes(params.size)
    setIsCustomMode(isCustom)
    if (isCustom) {
      const [w, h] = params.size.split("x")
      setCustomWidth(w)
      setCustomHeight(h)
    }
  }, [params.size])

  // Update parent state saat nilai kustom berubah
  useEffect(() => {
    if (isCustomMode) {
      const width = parseInt(customWidth, 10)
      const height = parseInt(customHeight, 10)
      if (width > 0 && height > 0) {
        onParamsChange({ size: `${width}x${height}` })
      }
    }
  }, [customWidth, customHeight, isCustomMode])

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      onParamsChange({ seed: value })
    }
  }

  const handleRandomSeed = () => {
    onParamsChange({ seed: generateRandomSeed() })
  }

  const handleSizePresetChange = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true)
      // Jika ukuran saat ini adalah preset, default ke 1024x1024 saat beralih ke kustom
      if (predefinedSizes.includes(params.size)) {
        setCustomWidth("1024")
        setCustomHeight("1024")
      }
    } else {
      setIsCustomMode(false)
      onParamsChange({ size: value })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Image Parameters</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={params.model} onValueChange={(value) => onParamsChange({ model: value as ImageModel })}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flux">Flux</SelectItem>
              <SelectItem value="turbo">Turbo</SelectItem>
              <SelectItem value="gptimage">GPT Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Image Size</Label>
          <Select value={isCustomMode ? "custom" : params.size} onValueChange={handleSizePresetChange}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1792">1024x1792 (Portrait)</SelectItem>
              <SelectItem value="1024x1024">1024x1024 (Square)</SelectItem>
              <SelectItem value="1792x1024">1792x1024 (Landscape)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isCustomMode && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <Label htmlFor="customWidth" className="text-xs text-muted-foreground">Width</Label>
              <Input
                id="customWidth"
                type="number"
                placeholder="1024"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customHeight" className="text-xs text-muted-foreground">Height</Label>
              <Input
                id="customHeight"
                type="number"
                placeholder="1792"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="quality">Quality</Label>
          <Select value={params.quality} onValueChange={(value) => onParamsChange({ quality: value })}>
            <SelectTrigger id="quality">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="hd">HD</SelectItem>
              <SelectItem value="best">Best</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="nologo" className="cursor-pointer">
            Remove Logo
          </Label>
          <Switch
            id="nologo"
            checked={params.nologo}
            onCheckedChange={(checked) => onParamsChange({ nologo: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enhance" className="cursor-pointer">
            Enhance Image
          </Label>
          <Switch
            id="enhance"
            checked={params.enhance}
            onCheckedChange={(checked) => onParamsChange({ enhance: checked })}
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seed">Seed</Label>
            <Button variant="outline" size="sm" onClick={handleRandomSeed} className="h-8 px-2">
              <Dices className="h-4 w-4 mr-1" />
              Random
            </Button>
          </div>
          <Input id="seed" type="number" value={params.seed} onChange={handleSeedChange} />
          <p className="text-xs text-muted-foreground">
            Same seed with same prompt will generate identical images. Change for variations.
          </p>
        </div>
      </div>
    </div>
  )
}
