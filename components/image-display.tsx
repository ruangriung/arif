"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card" //
import { Button } from "@/components/ui/button" //
import { Download, RefreshCw, Share2 } from "lucide-react"
import Image from "next/image"

interface ImageDisplayProps {
  imageUrl: string | null
  prompt: string
  isLoading: boolean
  onRegenerate: () => void
  size: string
}

export function ImageDisplay({ imageUrl, prompt, isLoading, onRegenerate, size }: ImageDisplayProps) {
  // --- PERUBAHAN DI SINI ---
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isImageVisible, setIsImageVisible] = useState(false)

  const [width, height] = (size || "1x1").split('x').map(Number)
  const aspectRatio = (width > 0 && height > 0) ? `${width} / ${height}` : '1 / 1'

  useEffect(() => {
    // Reset status saat URL gambar berubah atau saat mulai loading
    setIsImageLoaded(false)
    setIsImageVisible(false)
  }, [imageUrl])

  const handleImageLoad = () => {
    setIsImageLoaded(true)
    // Beri sedikit jeda sebelum memulai animasi untuk efek yang lebih mulus
    setTimeout(() => setIsImageVisible(true), 50)
  }
  // --- BATAS PERUBAHAN ---

  const handleDownload = () => {
    // ... (fungsi tidak berubah)
  }

  const handleShare = async () => {
    // ... (fungsi tidak berubah)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          className="w-full relative bg-secondary/30 flex items-center justify-center overflow-hidden rounded-t-lg"
          style={{ aspectRatio: aspectRatio }}
        >
          {!imageUrl && !isLoading && (
            <span className="text-muted-foreground text-center p-4">
              Enter a prompt and generate an image
            </span>
          )}

          {isLoading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Generating your image...</p>
            </div>
          )}

          {imageUrl && (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
              {/* --- PERUBAHAN PADA KOMPONEN IMAGE --- */}
              <Image
                src={imageUrl}
                alt={prompt || "Generated image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-contain transition-all duration-500 ease-in-out
                  ${isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                onLoad={handleImageLoad}
                priority
              />
              {/* --- BATAS PERUBAHAN --- */}
              
              {/* Overlay ditempatkan di sini, di dalam kontainer relatif */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-20 opacity-0 transition-opacity hover:opacity-100">
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
        </div>
      </CardContent>
    </Card>
  )
}
