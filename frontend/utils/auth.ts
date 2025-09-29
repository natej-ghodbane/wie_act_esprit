export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

export function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json))) as T
  } catch {
    return null
  }
}

export function getRoleFromStorageOrToken(): string | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('role')
  if (stored) return stored
  const token = getStoredToken()
  if (!token) return null
  const payload = decodeJwt<any>(token)
  if (!payload) return null
  // Common claim keys: role, roles, authorities
  const role = payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : null) || (Array.isArray(payload.authorities) ? payload.authorities[0] : null)
  return role || null
}

export function isBuyerRole(role: string | null | undefined): boolean {
  if (!role) return false
  const r = String(role).toLowerCase()
  return r === 'buyer' || r === 'role_buyer' || r === 'buyer_role' || r.includes('buyer')
} 