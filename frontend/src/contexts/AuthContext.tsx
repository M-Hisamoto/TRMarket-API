import { createContext } from 'react'
import type { AuthResponse } from '../types'

export interface AuthContextType {
  token: string | null
  user: { email: string; role: string } | null
  login: (data: AuthResponse) => void
  logout: () => void
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)