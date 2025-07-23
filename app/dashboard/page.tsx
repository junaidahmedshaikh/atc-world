"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ToastProvider, useToast } from "@/components/Toast"

interface Post {
  id: string
  title: string
  content: string
  category: string
  author: string
  createdAt: string
  views: number
  image?: string
}

const DashboardContent: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Article",
  })

  const categories = ["Article", "Event", "Education", "Job"]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Load posts from localStorage
    const savedPosts = localStorage.getItem("posts")
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts)
      setPosts(parsedPosts)
      setFilteredPosts(parsedPosts)
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory])

  const savePosts = (newPosts: Post[]) => {
    localStorage.setItem("posts", JSON.stringify(newPosts))
    setPosts(newPosts)
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      showToast("Please fill in all fields", "error")
      return
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      author: user?.firstName + " " + user?.lastName || "Anonymous",
      createdAt: new Date().toISOString(),
      views: 0,
      image: `/placeholder.svg?height=200&width=300&query=${formData.category.toLowerCase()}`,
    }

    const updatedPosts = [newPost, ...posts]
    savePosts(updatedPosts)

    setFormData({ title: "", content: "", category: "Article" })
    setShowCreateModal(false)
    showToast("Post created successfully!", "success")
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
    })
    setShowCreateModal(true)
  }

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingPost) return

    const updatedPosts = posts.map((post) => (post.id === editingPost.id ? { ...post, ...formData } : post))

    savePosts(updatedPosts)
    setEditingPost(null)
    setFormData({ title: "", content: "", category: "Article" })
    setShowCreateModal(false)
    showToast("Post updated successfully!", "success")
  }

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId)
      savePosts(updatedPosts)
      showToast("Post deleted successfully!", "success")
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="fw-bold mb-2">Welcome back, {user?.firstName}!</h2>
                    <p className="text-muted mb-0">Manage your posts and explore the community</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <button className="btn btn-primary btn-lg" onClick={() => setShowCreateModal(true)}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <i className="bi bi-file-text text-primary fs-1"></i>
                <h4 className="fw-bold mt-2">{posts.length}</h4>
                <p className="text-muted mb-0">Total Posts</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <i className="bi bi-eye text-success fs-1"></i>
                <h4 className="fw-bold mt-2">{posts.reduce((sum, post) => sum + post.views, 0)}</h4>
                <p className="text-muted mb-0">Total Views</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <i className="bi bi-heart text-danger fs-1"></i>
                <h4 className="fw-bold mt-2">0</h4>
                <p className="text-muted mb-0">Likes</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <i className="bi bi-share text-info fs-1"></i>
                <h4 className="fw-bold mt-2">0</h4>
                <p className="text-muted mb-0">Shares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Your Posts ({filteredPosts.length})</h5>
              </div>
              <div className="card-body">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-file-text text-muted" style={{ fontSize: "4rem" }}></i>
                    <h4 className="text-muted mt-3">No posts found</h4>
                    <p className="text-muted">Create your first post to get started!</p>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm card-hover">
                          <img
                            src={post.image || "/placeholder.svg"}
                            className="card-img-top"
                            alt={post.title}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-secondary">{post.category}</span>
                              <small className="text-muted ms-auto">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <h6 className="card-title fw-bold">{post.title}</h6>
                            <p className="card-text text-muted small">{post.content.substring(0, 100)}...</p>
                            <div className="d-flex align-items-center justify-content-between">
                              <small className="text-muted">
                                <i className="bi bi-eye me-1"></i>
                                {post.views} views
                              </small>
                              <div className="btn-group">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditPost(post)}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Post Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingPost ? "Edit Post" : "Create New Post"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
                    setFormData({ title: "", content: "", category: "Article" })
                  }}
                ></button>
              </div>
              <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      Content
                    </label>
                    <textarea
                      className="form-control"
                      id="content"
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingPost(null)
                      setFormData({ title: "", content: "", category: "Article" })
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPost ? "Update Post" : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const DashboardPage: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <DashboardContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default DashboardPage
