"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider, useToast } from "@/components/Toast";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        showToast("Login successful!", "success");
        router.push("/dashboard");
      } else {
        showToast("Invalid credentials", "error");
      }
    } catch (error) {
      showToast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Sign In</h2>
                  <p className="text-muted">Welcome back to ATG.WORLD</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="bg-blue-500! text-white! rounded-lg! p-2! w-full! font-bold! hover:bg-blue-600! transition-colors! duration-300!"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner me-2"></span>
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Create new for free!
                    </Link>
                  </p>
                </div>

                <hr className="my-4" />

                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-facebook me-2"></i>
                    Sign in with Facebook
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-google me-2"></i>
                    Sign in with Google
                  </button>
                </div>

                <div className="text-center mt-3">
                  <Link
                    href="#"
                    className="text-muted text-decoration-none small"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <LoginForm />
      </ToastProvider>
    </AuthProvider>
  );
};

export default LoginPage;
