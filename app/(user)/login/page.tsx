"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login, logout } = useAuth()
  
  // Admin login state
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [adminId, setAdminId] = useState("")
  const [adminPw, setAdminPw] = useState("")
  const [adminError, setAdminError] = useState("")

  const handleGoogleSignIn = async () => {
    // TODO: Implement actual sign in with next-auth
    // signIn('google', { callbackUrl: '/mypage' })
    console.log("Google sign in clicked")
  }

  // Test: Login as user
  const handleTestUserLogin = () => {
    login("user")
    router.push("/mypage")
  }

  // Test: Logout / stay as guest
  const handleTestLogout = () => {
    logout()
  }

  // Admin login handler
  const handleAdminLogin = () => {
    if (adminId === "admin" && adminPw === "admin") {
      login("admin")
      router.push("/admin/dashboard")
    } else {
      setAdminError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-6">
        {/* Title */}
        <h1 className="text-center text-xl font-semibold text-foreground">
          로그인 / 회원가입
        </h1>

        {/* Google Sign In Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          className="h-12 w-full gap-3 border-border bg-background text-foreground hover:bg-accent"
        >
          <GoogleIcon className="size-5" />
          <span>Google 계정으로 계속하기</span>
        </Button>

        {/* Dev Test Buttons */}
        <div className="space-y-3 border-t border-dashed border-muted-foreground/30 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            개발용 테스트 버튼
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={handleTestUserLogin}
            className="h-12 w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            테스트: 유저로 로그인
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleTestLogout}
            className="h-12 w-full border-gray-400 text-gray-500 hover:bg-gray-50"
          >
            테스트: 비로그인 상태로
          </Button>
          
          {/* Admin Login Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdminForm(!showAdminForm)}
            className="w-full text-xs text-muted-foreground"
          >
            {showAdminForm ? "관리자 로그인 닫기" : "관리자 로그인"}
          </Button>
          
          {showAdminForm && (
            <div className="space-y-3 rounded-lg border border-muted p-4">
              <input
                type="text"
                placeholder="아이디"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
              {adminError && (
                <p className="text-xs text-destructive">{adminError}</p>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={handleAdminLogin}
                className="h-10 w-full"
              >
                관리자 로그인
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
