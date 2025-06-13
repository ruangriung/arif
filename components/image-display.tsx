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
  size: string // Prop untuk menerima ukuran, cth: "1024x1792"
}

export function ImageDisplay({ imageUrl, prompt, isLoading, onRegenerate, size }: ImageDisplayProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  
  // Mem-parsing string ukuran menjadi angka untuk rasio aspek
  const [width, height] = size.split('x').map(Number)
  const aspectRatio = width && height ? `${width} / ${height}` : '1 / 1'

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

  // Wrapper div untuk mengontrol rasio aspek
  const ImageContainer = ({ children }: { children: React.ReactNode }) => (
    <div
      className="w-full relative bg-secondary/30 flex items-center justify-center overflow-hidden rounded-t-lg"
      style={{ aspectRatio: aspectRatio }}
    >
      {children}
    </div>
  )

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {!imageUrl && !isLoading && (
          <ImageContainer>
            <span className="text-muted-foreground text-center p-4">
              Enter a prompt and generate an image
            </span>
          </ImageContainer>
        )}

        {isLoading && (
          <ImageContainer>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Generating your image...</p>
            </div>
          </ImageContainer>
        )}

        {imageUrl && (
          <div className="relative">
            <ImageContainer>
                {/* Loader overlay */}
                {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}
                {/* Gambar itu sendiri */}
                <Image
                    src={imageUrl}
                    alt={prompt || "Generated image"}
                    fill // Gunakan 'fill' agar gambar mengisi kontainer sepenuhnya
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-contain transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    priority
                />
            </ImageContainer>
            
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
