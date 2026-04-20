import { apiRequest, setToken, removeToken } from "./api"

// 구글 로그인 시작
export function startGoogleLogin() {
  window.location.href = "http://localhost:8080/api/v1/auth/google"
}

// 현재 유저 정보 조회
export async function getMe() {
  return apiRequest<{
    result_code: number
    msg: string
    data: {
      userId: string
      name: string
      email: string
      role: string
    }
  }>("/api/v1/auth/me")
}

// 유저 로그아웃
export async function logoutUser() {
  try {
    await apiRequest("/api/v1/auth/logout", { method: "POST" })
  } finally {
    removeToken()
  }
}

// 관리자 로그인
export async function adminLogin(loginId: string, password: string) {
  const res = await apiRequest<{
    result_code: number
    msg: string
    data: {
      accessToken: string
      adminUser: {
        adminId: string
        loginId: string
        name: string
      }
    }
  }>("/api/v1/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  })
  setToken(res.data.accessToken)
  return res
}

// 관리자 로그아웃
export async function adminLogout() {
  try {
    await apiRequest("/api/v1/admin/auth/logout", { method: "POST" })
  } finally {
    removeToken()
  }
}