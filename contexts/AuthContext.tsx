"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type AuthState,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  authenticateUser,
  registerUser,
} from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedAuth = getStoredAuth()
    setAuthState(storedAuth)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authenticateUser(email, password)
      if (result) {
        const { user, token } = result
        setStoredAuth(user, token)
        setAuthState({ user, token, isAuthenticated: true })
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<boolean> => {
    try {
      const result = await registerUser(userData)
      if (result) {
        const { user, token } = result
        setStoredAuth(user, token)
        setAuthState({ user, token, isAuthenticated: true })
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    clearStoredAuth()
    setAuthState({ user: null, token: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
