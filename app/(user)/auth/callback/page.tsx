"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      router.replace("/login")
      return
    }

    login("user", token)

    const callbackUrl = sessionStorage.getItem("callbackUrl") ?? "/mypage"
    sessionStorage.removeItem("callbackUrl")
    router.replace(callbackUrl)
  }, [router, searchParams, login])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">로그인 처리 중...</p>
    </div>
  )
}