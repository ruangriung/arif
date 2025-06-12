export type ImageModel = "flux" | "turbo" | "gptimage"

export interface ImageParams {
  model: ImageModel
  nologo: boolean
  enhance: boolean
  size: string
  quality: string
  seed: number
}

export interface ImageHistory {
  id: string
  prompt: string
  imageUrl: string
  params: ImageParams
  timestamp: string
}
