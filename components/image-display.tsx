"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Share2, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageDisplayProps {
  imageUrl: string | null
  prompt: string
  isLoading: boolean
  onRegenerate: () => void
  size: string
}

export function ImageDisplay({ imageUrl, prompt, isLoading, onRegenerate, size }: ImageDisplayProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isImageVisible, setIsImageVisible] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const [width, height] = (size || "1x1").split('x').map(Number)
  const aspectRatio = (width > 0 && height > 0) ? `${width} / ${height}` : '1 / 1'

  useEffect(() => {
    setIsImageLoaded(false)
    setIsImageVisible(false)
  }, [imageUrl])

  const handleImageLoad = () => {
    setIsImageLoaded(true)
    setTimeout(() => setIsImageVisible(true), 50)
  }

  // --- FUNGSI DOWNLOAD BARU ---
  const handleDownload = async () => {
    if (!imageUrl) return
    setIsDownloading(true)
    try {
      // 1. Fetch gambar sebagai data blob
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // 2. Buat URL sementara untuk blob
      const objectUrl = URL.createObjectURL(blob)
      
      // 3. Buat link dan picu download
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `ruangriung-${prompt.slice(0, 20) || 'image'}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 4. Hapus URL sementara dari memori
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Download error:", error)
      // Jika gagal, coba buka di tab baru sebagai fallback
      window.open(imageUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }
  // --- BATAS FUNGSI DOWNLOAD BARU ---

  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return
    try {
      await navigator.share({
        title: "AI Generated Image by RuangRiung",
        text: prompt,
        url: imageUrl,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
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
              Imajinasikan kebebasanmu...
            </span>
          )}

          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
              <p className="text-muted-foreground">Menghasilkan mahakaryamu...</p>
            </div>
          )}

          {imageUrl && (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin h-12 w-12 text-primary" />
                </div>
              )}
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
              
              {/* --- PERBAIKAN PADA OVERLAY --- */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20 transition-opacity duration-300 delay-200
                  ${isImageVisible ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm line-clamp-1 flex-1 mr-2">{prompt}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={onRegenerate} disabled={isLoading}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleDownload} disabled={isDownloading}>
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    </Button>
                    {navigator.share && (
                      <Button size="sm" variant="secondary" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/* --- BATAS PERBAIKAN OVERLAY --- */}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
