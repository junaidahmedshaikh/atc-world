"use client"

import { useState, useEffect } from "react"
import PostCard from "./PostCard"
import type { Post } from "@/types"
import { toast } from "react-hot-toast"

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Simulate API call
      const mockPosts: Post[] = [
        {
          id: "1",
          type: "Article",
          title: "What if famous brands had regular fonts? Meet RegulaBrands!",
          content: "I've worked in UX for the better part of a decade. From now on, I plan to rei...",
          author: {
            id: "1",
            name: "Sarthak Kamra",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          image: "/images/post-image.png",
          views: 1400,
          createdAt: new Date().toISOString(),
          likes: 24,
          comments: 8,
        },
        {
          id: "2",
          type: "Education",
          title: "Tax Benefits for Investment under National Pension Scheme launched by Government",
          content: "I've worked in UX for the better part of a decade. From now on, I plan to rei...",
          author: {
            id: "2",
            name: "Sarah West",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          views: 1400,
          createdAt: new Date().toISOString(),
          likes: 12,
          comments: 3,
        },
      ]

      setPosts(mockPosts)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to load posts")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading posts...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
