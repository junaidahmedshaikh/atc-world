"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface HeroSectionProps {
  onJoinClick: () => void;
}

export default function HeroSection({ onJoinClick }: HeroSectionProps) {
  const { user } = useAuth();

  return (
    <div className="position-relative overflow-hidden">
      <div className="hero-bg position-absolute w-100 h-100">
        <Image
          src={`https://cybertex.edu/wp-content/uploads/2022/09/network-engineer-cybersecurity.jpg`}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="position-absolute w-100 h-100 bg-dark opacity-50"></div>
      </div>

      <div className="position-relative text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Computer Engineering</h1>
              <p className="lead mb-4">
                142,765 Computer Engineers follow this
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-top">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-lg-8">
              <ul className="nav nav-tabs border-0">
                <li className="nav-item">
                  <a className="nav-link active border-0 fw-medium text-dark">
                    All Posts(32)
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link border-0 text-muted">Article</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link border-0 text-muted">Event</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link border-0 text-muted">Education</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link border-0 text-muted">Job</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 text-end">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-secondary">
                  Write a Post
                </button>
                {!user && (
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={onJoinClick}
                  >
                    <span>👥</span> Join Group
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
