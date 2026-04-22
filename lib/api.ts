const BASE_URL = "http://localhost:8080"

interface ApiError {
  result_code: number
  error_code: string
  msg: string
}

// Access Token 재발급
async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) throw new Error("refresh 실패")

  const json = await res.json()
  setToken(json.data)
  return json.data
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",  // 쿠키 자동 전송
  })

  // 401 뜨면 자동 재발급 시도
  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken()
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      })
      const retryJson = await retryRes.json()
      if (!retryRes.ok) throw retryJson as ApiError
      return retryJson
    } catch {
      removeToken()
      window.location.href = "/login"
      throw new Error("인증 실패")
    }
  }

  const json = await res.json()
  if (!res.ok) throw json as ApiError
  return json
}

export function getToken() {
  return localStorage.getItem("accessToken")
}

export function setToken(token: string) {
  localStorage.setItem("accessToken", token)
}

export function removeToken() {
  localStorage.removeItem("accessToken")
}