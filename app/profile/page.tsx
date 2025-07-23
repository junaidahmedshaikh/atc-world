"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ToastProvider, useToast } from "@/components/Toast"

const ProfileContent: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  })
  const [isEditing, setIsEditing] = useState(false)

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user profile via API
    showToast("Profile updated successfully!", "success")
    setIsEditing(false)
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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img
                    src={user?.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <h2 className="fw-bold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-muted">{user?.email}</p>
                  <span className={`badge ${user?.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="text-center">
                    {isEditing ? (
                      <div>
                        <button type="submit" className="btn btn-primary me-2">
                          Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <i className="bi bi-pencil me-2"></i>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfilePage: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <ProfileContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default ProfilePage
