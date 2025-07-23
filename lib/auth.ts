"use client"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// Simulate JWT token generation
export const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ ...user, exp: Date.now() + 24 * 60 * 60 * 1000 }))
}

// Simulate JWT token verification
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}

// Local storage helpers
export const getStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false }
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return { user: null, token: null, isAuthenticated: false }
  }

  const user = verifyToken(token)
  if (!user) {
    localStorage.removeItem("token")
    return { user: null, token: null, isAuthenticated: false }
  }

  return { user, token, isAuthenticated: true }
}

export const setStoredAuth = (user: User, token: string) => {
  localStorage.setItem("token", token)
}

export const clearStoredAuth = () => {
  localStorage.removeItem("token")
}

// Simulate user database
const users: User[] = [
  {
    id: "1",
    email: "admin@atg.world",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string } | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, accept any email/password combination
  let user = users.find((u) => u.email === email)

  if (!user) {
    // Create new user if doesn't exist
    user = {
      id: Date.now().toString(),
      email,
      firstName: email.split("@")[0],
      lastName: "User",
      role: "user",
      avatar: `/placeholder.svg?height=40&width=40&query=${email.split("@")[0]}`,
    }
    users.push(user)
  }

  const token = generateToken(user)
  return { user, token }
}

export const registerUser = async (userData: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<{ user: User; token: string } | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (users.find((u) => u.email === userData.email)) {
    throw new Error("User already exists")
  }

  const user: User = {
    id: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: "user",
    avatar: `/placeholder.svg?height=40&width=40&query=${userData.firstName}`,
  }

  users.push(user)
  const token = generateToken(user)
  return { user, token }
}
