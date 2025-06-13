"use client"

import type React from "react"

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
  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      onParamsChange({ seed: value })
    }
  }

  const handleRandomSeed = () => {
    onParamsChange({ seed: generateRandomSeed() })
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
          <Select value={params.size} onValueChange={(value) => onParamsChange({ size: value })}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="512x512">512x512</SelectItem>
              <SelectItem value="768x768">768x768</SelectItem>
              <SelectItem value="1024x1024">1024x1024</SelectItem>
              <SelectItem value="1536x1536">1536x1536</SelectItem>
              <SelectItem value="512x768">512x768 (Portrait)</SelectItem>
              <SelectItem value="768x512">768x512 (Landscape)</SelectItem>
              <SelectItem value="1024x1536">1024x1536 (Portrait)</SelectItem>
              <SelectItem value="1536x1024">1536x1024 (Landscape)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div className="flex items-center justify-between">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seed">Seed</Label>
            <Button variant="outline" size="sm" onClick={handleRandomSeed} className="h-8 px-2">
              <Dices className="h-4 w-4 mr-1" />
              Random
"use client"

import type React from "react"
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
      // Jika beralih ke kustom, default ke 1024x1024 jika ukuran saat ini adalah preset.
      const predefined = ["1024x1792", "1024x1024", "1792x1024"]
      if (predefined.includes(params.size)) {
        onParamsChange({ size: "1024x1024" })
      }
      // Jika sudah kustom, biarkan saja.
    } else {
      // Ini adalah preset
      onParamsChange({ size: value })
    }
  }

  const handleCustomSizeChange = (dimension: "width" | "height", value: string) => {
    const currentSize = params.size.split("x")
    const width = dimension === "width" ? value : currentSize[0]
    const height = dimension === "height" ? value : currentSize[1]

    if (Number(width) > 0 && Number(height) > 0) {
      onParamsChange({ size: `${width}x${height}` })
    }
  }

  const predefinedSizes = ["1024x1792", "1024x1024", "1792x1024"]
  const isCustomSize = !predefinedSizes.includes(params.size)
  const selectValue = isCustomSize ? "custom" : params.size
  const [customWidth, customHeight] = isCustomSize ? params.size.split("x") : ["", ""]

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
          <Select value={selectValue} onValueChange={handleSizePresetChange}>
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

        {isCustomSize && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <Label htmlFor="customWidth" className="text-xs text-muted-foreground">Width</Label>
              <Input
                id="customWidth"
                type="number"
                placeholder="1024"
                value={customWidth}
                onChange={(e) => handleCustomSizeChange("width", e.target.value)}
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
                onChange={(e) => handleCustomSizeChange("height", e.target.value)}
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
