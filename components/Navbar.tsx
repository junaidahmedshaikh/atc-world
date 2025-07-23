"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onShowAuthModal: (mode: "login" | "register") => void;
}

const Navbar: React.FC<NavbarProps> = ({ onShowAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <i className="bi bi-globe2 me-2"></i>
          ATG.WORLD
        </Link>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <div className="navbar-nav me-auto">
            <Link href="/" className="nav-link fw-semibold">
              <i className="bi bi-house me-1"></i>
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="nav-link fw-semibold">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Link>
                <Link href="/posts" className="nav-link fw-semibold">
                  <i className="bi bi-file-text me-1"></i>
                  Posts
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="nav-link fw-semibold">
                    <i className="bi bi-shield-check me-1"></i>
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="navbar-nav">
            {isAuthenticated ? (
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center fw-semibold"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt="Avatar"
                    className="avatar-custom me-2"
                  />
                  <span className="d-none d-md-inline">{user?.firstName}</span>
                  <i className="bi bi-chevron-down ms-1"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                  <li>
                    <Link href="/profile" className="dropdown-item py-2">
                      <i className="bi bi-person me-2 text-primary"></i>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="dropdown-item py-2">
                      <i className="bi bi-speedometer2 me-2 text-success"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-primary btn-custom"
                  onClick={() => onShowAuthModal("login")}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Sign In
                </button>
                <button
                  className="btn btn-primary-custom btn-custom"
                  onClick={() => onShowAuthModal("register")}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
