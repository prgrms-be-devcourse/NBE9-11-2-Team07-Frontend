"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Animated dots spinner component
function LoadingSpinner() {
  return (
    <div className="relative h-32 w-32">
      {/* Center large dot */}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
      
      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45 * Math.PI) / 180
        const radius = 40
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const sizes = [12, 8, 10, 6, 14, 8, 10, 6]
        const size = sizes[i]
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              width: size,
              height: size,
              left: `calc(50% + ${x}px - ${size / 2}px)`,
              top: `calc(50% + ${y}px - ${size / 2}px)`,
              animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        )
      })}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default function WaitingPage() {
  const router = useRouter()
  const [isTimedOut, setIsTimedOut] = useState(false)

  useEffect(() => {
    // 2 minute timeout
    const timeout = setTimeout(() => {
      setIsTimedOut(true)
      // Redirect to home after showing error
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }, 120000) // 2 minutes

    return () => clearTimeout(timeout)
  }, [router])

  if (isTimedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-destructive">
          <svg
            className="h-12 w-12 text-destructive-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          연결 시간 초과
        </h1>
        <p className="text-center text-muted-foreground">
          잠시 후 홈으로 이동합니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <LoadingSpinner />
      
      <h1 className="mt-12 text-2xl font-bold text-foreground">
        좌석 상태를 실시간으로 확인하고 있습니다
      </h1>
      
      <p className="mt-4 text-center text-muted-foreground">
        마지막 한 자리까지 꼼꼼히 확인 중이에요. 잠시만 기다려 주세요!
      </p>
    </div>
  )
}
