export const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  return !!token
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

let onUnauthorized: (() => void) | null = null

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorized = callback
}

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    if (onUnauthorized) {
      onUnauthorized()
    }
  }

  return response
}