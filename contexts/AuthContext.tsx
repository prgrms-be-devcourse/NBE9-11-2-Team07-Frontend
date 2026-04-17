"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "user" | "admin" | null

interface AuthContextType {
  isLoggedIn: boolean
  userRole: UserRole
  login: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("test_auth")
    if (storedAuth) {
      const { isLoggedIn, userRole } = JSON.parse(storedAuth)
      setIsLoggedIn(isLoggedIn)
      setUserRole(userRole)
    }
  }, [])

  const login = (role: UserRole) => {
    setIsLoggedIn(true)
    setUserRole(role)
    localStorage.setItem("test_auth", JSON.stringify({ isLoggedIn: true, userRole: role }))
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    localStorage.removeItem("test_auth")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
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
