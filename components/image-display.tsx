"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Share2 } from "lucide-react"
import Image from "next/image"

interface ImageDisplayProps {
  imageUrl: string | null
  prompt: string
  isLoading: boolean
  onRegenerate: () => void
  size: string // Prop baru untuk menerima ukuran, cth: "1024x1792"
}

export function ImageDisplay({ imageUrl, prompt, isLoading, onRegenerate, size }: ImageDisplayProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  
  // Mem-parsing string ukuran menjadi angka
  const [width, height] = size.split('x').map(Number)

  // Reset status 'loaded' saat URL gambar berubah
  useEffect(() => {
    setIsImageLoaded(false)
  }, [imageUrl])

  const handleDownload = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `pollinations-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return

    try {
      await navigator.share({
        title: "AI Generated Image",
        text: prompt,
        url: imageUrl,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {!imageUrl && !isLoading && (
          <div className="aspect-video flex items-center justify-center bg-secondary/30 text-muted-foreground">
            Enter a prompt and generate an image
          </div>
        )}

        {isLoading && (
          <div className="aspect-video flex flex-col items-center justify-center bg-secondary/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Generating your image...</p>
          </div>
        )}

        {imageUrl && (
          <>
            <div className={`transition-all duration-500 ease-in-out ${isImageLoaded ? "opacity-100 transform scale-105" : "opacity-0 transform scale-100"}`}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={prompt || "Generated image"}
                width={width || 1024}      // Menggunakan lebar dinamis
                height={height || 1024}     // Menggunakan tinggi dinamis
                className="w-full h-auto" // Ini membuat gambar responsif
                onLoad={() => setIsImageLoaded(true)}
                priority
              />
            </div>

            {!isImageLoaded && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-secondary/30"
                style={{ aspectRatio: `${width || 1}/${height || 1}` }} // Placeholder dengan rasio aspek yg benar
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm line-clamp-1 flex-1 mr-2">{prompt}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={onRegenerate}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {navigator.share && (
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
