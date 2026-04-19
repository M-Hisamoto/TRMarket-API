import { useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse } from '../types'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }))
    setToken(data.token)
    setUser({ email: data.email, role: data.role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      isAdmin: user?.role === 'ROLE_ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  )
}