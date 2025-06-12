import { ImageGenerator } from "@/components/image-generator"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground text-center mb-8">Imajinasikan Kebebasan</p>
        <ImageGenerator />
      </div>
    </main>
  )
}
