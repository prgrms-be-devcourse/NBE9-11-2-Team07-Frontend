"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, UserCircle2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminLogin } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"

function AdminLoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isValid = Boolean(id && password)

  const handleLogin = async () => {
    if (!isValid) return
    try {
      setIsLoading(true)
      setError("")
      await adminLogin(id, password)
      login("admin")
      router.push("/admin/dashboard")
    } catch (err: any) {
      if (err?.error_code === "UNAUTHORIZED") {
        setError("아이디 또는 비밀번호가 올바르지 않습니다")
      } else {
        setError("일시적인 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) handleLogin()
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle2 className="size-6" />
          </div>
          <CardTitle className="text-2xl">관리자 로그인</CardTitle>
          <CardDescription>식당 예약 관리 시스템에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-id">아이디</Label>
            <Input
              id="admin-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">비밀번호</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력하세요"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleLogin}
            disabled={!isValid || isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-muted"
          >
            <Lock className="mr-2 size-4" />
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
          <div className="text-center">
            <Link
              href="/login"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              일반 로그인으로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}