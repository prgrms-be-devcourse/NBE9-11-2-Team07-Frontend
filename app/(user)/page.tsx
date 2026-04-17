import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="relative h-[calc(100vh-56px)]">
      {/* Hero Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WnJgnzEgQp4IUxegnpyVZXC0LamPPT.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* CTA Button */}
      <div className="relative flex h-full items-center justify-center">
        <Button
          asChild
          size="lg"
          className="bg-white/90 px-12 py-6 text-lg font-medium text-foreground hover:bg-white"
        >
          <Link href="/reservation">예약하기</Link>
        </Button>
      </div>
    </main>
  )
}
