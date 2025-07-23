"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { mockPosts } from "@/constant";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  views: string;
  authorImage: string;
  image: string;
  category: "Article" | "Event" | "Education" | "Job";
  date: string;
  likes: number;
  comments: number;
}

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeFilter, setActiveFilter] = useState<string>("All Posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(mockPosts as Post[]);
    setFilteredPosts(mockPosts as Post[]);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (activeFilter !== "All Posts") {
      filtered = filtered.filter((post) => post.category === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [activeFilter, searchTerm, posts]);

  const filterOptions = [
    { name: "All Posts", count: posts.length, icon: "bi-grid" },
    {
      name: "Article",
      count: posts.filter((p) => p.category === "Article").length,
      icon: "bi-file-text",
    },
    {
      name: "Event",
      count: posts.filter((p) => p.category === "Event").length,
      icon: "bi-calendar-event",
    },
    {
      name: "Education",
      count: posts.filter((p) => p.category === "Education").length,
      icon: "bi-mortarboard",
    },
    {
      name: "Job",
      count: posts.filter((p) => p.category === "Job").length,
      icon: "bi-briefcase",
    },
  ];

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "Article":
        return "category-article";
      case "Event":
        return "category-event";
      case "Education":
        return "category-education";
      case "Job":
        return "category-job";
      default:
        return "category-article";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Article":
        return "bi-file-text";
      case "Event":
        return "bi-calendar-event";
      case "Education":
        return "bi-mortarboard";
      case "Job":
        return "bi-briefcase";
      default:
        return "bi-file-text";
    }
  };

  return (
    <div className="min-vh-100">
      <Navbar
        onShowAuthModal={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url(https://cybertex.edu/wp-content/uploads/2022/09/network-engineer-cybersecurity.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="display-3 fw-bold mb-4 fade-in">
                  Computer Engineering
                </h1>
                <p
                  className="lead mb-4 fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <i className="bi bi-people me-2"></i>
                  142,765 Computer Engineers follow this
                </p>

                {/* Search Bar */}
                <div
                  className="search-container mb-4 fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for your favorite groups in ATG"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="bi bi-search search-icon"></i>
                </div>

                <div className="fade-in" style={{ animationDelay: "0.6s" }}>
                  {!user ? (
                    <>
                      {/* <button
                        className="btn btn-primary-custom btn-custom btn-lg me-3"
                        onClick={() => {
                          setAuthMode("register")
                          setShowAuthModal(true)
                        }}
                      >
                        <i className="bi bi-people me-2"></i>
                        Join Group
                      </button>
                      <button className="btn btn-outline-custom btn-custom btn-lg">
                        <i className="bi bi-eye me-2"></i>
                        Explore Posts
                      </button> */}
                    </>
                  ) : (
                    <div>
                      <button className="btn btn-primary-custom btn-custom btn-lg me-3">
                        <i className="bi bi-plus-circle me-2"></i>
                        Write a Post
                      </button>
                      <Link
                        href="/dashboard"
                        className="btn btn-outline-custom btn-custom btn-lg"
                      >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Go to Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="filter-tabs slide-up">
                <div className="d-flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter.name}
                      className={`filter-tab ${
                        activeFilter === filter.name ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter(filter.name)}
                    >
                      <i className={`${filter.icon} me-2`}></i>
                      {filter.name}
                      <span className="badge bg-light text-dark ms-2">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <div
                className="btn-group slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <button className="btn btn-outline-primary btn-custom">
                  <i className="bi bi-pencil-square me-2"></i>
                  Write a Post
                </button>
                {!user && (
                  <button
                    className="btn btn-primary-custom btn-custom"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthModal(true);
                    }}
                  >
                    <i className="bi bi-people me-2"></i>
                    Join Group
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Posts Grid */}
              <div className="row g-4">
                {filteredPosts.length === 0 ? (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <i
                        className="bi bi-search text-muted"
                        style={{ fontSize: "4rem" }}
                      ></i>
                      <h4 className="text-muted mt-3">No posts found</h4>
                      <p className="text-muted">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="col-12 fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-custom">
                        <div className="row g-0">
                          <div className="col-md-4">
                            <img
                              src={post.image || "/placeholder.svg"}
                              className="card-image w-100 h-100"
                              alt={post.title}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center mb-3">
                                <span
                                  className={`category-badge ${getCategoryClass(
                                    post.category
                                  )}`}
                                >
                                  <i
                                    className={`${getCategoryIcon(
                                      post.category
                                    )} me-1`}
                                  ></i>
                                  {post.category}
                                </span>
                                <small className="text-muted ms-auto">
                                  <i className="bi bi-clock me-1"></i>
                                  {post.date}
                                </small>
                              </div>

                              <h5 className="card-title fw-bold mb-3">
                                <Link
                                  href={`/posts/${post.id}`}
                                  className="text-decoration-none text-dark"
                                >
                                  {post.title}
                                </Link>
                              </h5>

                              <p className="card-text text-muted mb-3">
                                {post.excerpt}
                              </p>

                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={post.authorImage}
                                    className="avatar-custom me-2"
                                    alt={post.author}
                                  />
                                  <div>
                                    <small className="fw-semibold d-block">
                                      {post.author}
                                    </small>
                                    <small className="text-muted">
                                      <i className="bi bi-eye me-1"></i>
                                      {post.views}
                                    </small>
                                  </div>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                  <button className="btn btn-link p-0 text-muted">
                                    <i className="bi bi-heart me-1"></i>
                                    {post.likes}
                                  </button>
                                  <button className="btn btn-link p-0 text-muted">
                                    <i className="bi bi-chat me-1"></i>
                                    {post.comments}
                                  </button>
                                  <button className="btn btn-link p-0 text-muted">
                                    <i className="bi bi-share"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="col-lg-4">
              {/* Location Widget */}
              <div className="sidebar-custom mb-4 slide-up">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt text-primary me-2"></i>
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent fw-semibold"
                      defaultValue="Noida, India"
                    />
                  </div>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Your location will help us serve better and extend a
                  personalised experience.
                </small>
              </div>

              {/* Recommended Groups */}
              <div
                className="sidebar-custom slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h6 className="fw-bold mb-4">
                  <i className="bi bi-hand-thumbs-up text-success me-2"></i>
                  RECOMMENDED GROUPS
                </h6>

                {[
                  { name: "Leisure", icon: "🎯", members: "1.2k" },
                  { name: "Activism", icon: "✊", members: "856" },
                  { name: "MBA", icon: "🎓", members: "2.1k" },
                  { name: "Philosophy", icon: "🤔", members: "743" },
                ].map((group, index) => (
                  <div
                    key={group.name}
                    className="d-flex align-items-center justify-content-between mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <span style={{ fontSize: "1.2rem" }}>{group.icon}</span>
                      </div>
                      <div>
                        <div className="fw-semibold">{group.name}</div>
                        <small className="text-muted">
                          {group.members} members
                        </small>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm btn-custom">
                      Follow
                    </button>
                  </div>
                ))}

                <div className="text-center mt-4">
                  <button className="btn btn-link text-primary fw-semibold">
                    See More... <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        mode={authMode}
        onHide={() => setShowAuthModal(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <HomePage />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
