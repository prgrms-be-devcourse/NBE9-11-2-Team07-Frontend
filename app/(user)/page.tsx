"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  
  // Determine CTA link based on state
  const ctaHref = isLoggedIn ? "/reservation" : "/login"

  return (
    <main className="relative h-screen w-full">
      {/* Hero Background Image */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WnJgnzEgQp4IUxegnpyVZXC0LamPPT.png"
        alt="Gourmet steak dish"
        fill
        className="object-cover"
        priority
      />
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* CTA Button - positioned at bottom center */}
      <div className="absolute inset-x-0 bottom-32 flex justify-center">
        <Button
          asChild
          size="lg"
          className="h-12 bg-white/90 px-16 text-base font-medium text-foreground shadow-lg hover:bg-white"
        >
          <Link href={ctaHref}>예약하기</Link>
        </Button>
      </div>
    </main>
  )
}
