"use client"

import { useState, useEffect } from "react"
import { MapPin, Edit3 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Group {
  id: string
  name: string
  icon: string
  members?: number
}

export default function Sidebar() {
  const { user } = useAuth()
  const [location, setLocation] = useState("Noida, India")
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    // Mock recommended groups
    setGroups([
      { id: "1", name: "Leisure", icon: "🎯" },
      { id: "2", name: "Activism", icon: "✊" },
      { id: "3", name: "MBA", icon: "🎓" },
      { id: "4", name: "Philosophy", icon: "🤔" },
    ])
  }, [])

  return (
    <div className="p-4 bg-white h-100">
      {/* Location Section */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <MapPin size={16} className="text-muted" />
            <span className="fw-medium">{location}</span>
          </div>
          <button className="btn btn-link p-0 text-muted">
            <Edit3 size={16} />
          </button>
        </div>
        <p className="text-muted small">
          Your location will help us serve better and extend a personalised experience.
        </p>
      </div>

      <hr />

      {/* Recommended Groups */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0">
            <span className="me-2">👍</span>
            RECOMMENDED GROUPS
          </h6>
        </div>

        <div className="d-flex flex-column gap-3">
          {groups.map((group) => (
            <div key={group.id} className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-light p-2">
                  <span>{group.icon}</span>
                </div>
                <span className="fw-medium">{group.name}</span>
              </div>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Follow</button>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <button className="btn btn-link text-primary text-decoration-none">See More...</button>
        </div>
      </div>
    </div>
  )
}
