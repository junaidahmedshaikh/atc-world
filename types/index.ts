export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: "user" | "admin"
}

export interface Post {
  id: string
  type: "Article" | "Education" | "Event" | "Job"
  title: string
  content: string
  author: User
  image?: string
  views: number
  likes: number
  comments: number
  createdAt: string
}

export interface Group {
  id: string
  name: string
  description: string
  members: number
  icon: string
}
