"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getMe, logoutUser } from "@/lib/auth"
import { getToken, removeToken } from "@/lib/api"

type UserRole = "user" | "admin" | null

interface AuthContextType {
  isLoggedIn: boolean
  userRole: UserRole
  userName: string | null
  login: (role: UserRole, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    getMe()
      .then((res) => {
        setIsLoggedIn(true)
        const role = res.data.role
        setUserRole(role === "ADMIN" || role === "ROLE_ADMIN" ? "admin" : "user")
        setUserName(res.data.name)
      })
      .catch(() => {
        removeToken()
      })
  }, [])

  const login = (role: UserRole, token?: string) => {
    if (token) {
      localStorage.setItem("accessToken", token)
    }
    setIsLoggedIn(true)
    setUserRole(role)
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch {}
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}