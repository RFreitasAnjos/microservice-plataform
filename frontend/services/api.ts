const API_URL = process.env.NEXT_PUBLIC_API_URL

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean>
}

export async function api<T = any>(
  endpoint: string,
  options?: ApiOptions
): Promise<T> {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  let url = `${API_URL}${endpoint}`

  // Query params
  if (options?.params) {

    const query = new URLSearchParams()

    Object.entries(options.params).forEach(([key, value]) => {
      query.append(key, String(value))
    })

    url += `?${query.toString()}`
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  // tratamento de erro
  if (!response.ok) {

    if (response.status === 401) {

      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }

    }

    const error = await response.json().catch(() => null)

    throw new Error(
      error?.message || "Erro na requisição"
    )
  }

  return response.json()
}