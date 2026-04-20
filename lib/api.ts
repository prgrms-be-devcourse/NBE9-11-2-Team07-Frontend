const BASE_URL = "http://localhost:8080"

interface ApiError {
  result_code: number
  error_code: string
  msg: string
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
  })

  const json = await res.json()

  if (!res.ok) {
    throw json as ApiError
  }

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

