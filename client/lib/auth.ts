export interface AuthUser {
  id: string
  email: string
  username: string
  balance: number
  token: string
}

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const setAuthUser = (user: AuthUser) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuthUser = () => {
  localStorage.removeItem('user')
}

export const updateAuthUser = (user: any) => {
  const current = getAuthUser()
  if (current) {
    localStorage.setItem('user', JSON.stringify({ ...current, ...user }))
  }
}

export const isAuthenticated = (): boolean => {
  return getAuthUser() !== null
}

export const getAuthToken = (): string | null => {
  const user = getAuthUser()
  return user ? user.token : null
}
