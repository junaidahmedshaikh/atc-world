"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";

interface AuthModalProps {
  show: boolean;
  mode: "login" | "register";
  onHide: () => void;
  onModeChange: (mode: "login" | "register") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  show,
  mode,
  onHide,
  onModeChange,
}) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === "register") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.email.trim()) {
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
      let success = false;

      if (mode === "register") {
        success = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      } else {
        success = await login(formData.email, formData.password);
      }

      if (success) {
        showToast(
          mode === "register"
            ? "Account created successfully!"
            : "Welcome back!",
          "success"
        );
        onHide();
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        showToast("Authentication failed. Please try again.", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Something went wrong!", "error");
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

  if (!show) return null;

  return (
    <div
      className="modal show d-block modal-custom"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h4 className="modal-title mb-1">
                {mode === "login" ? "Welcome Back!" : "Join ATG.WORLD"}
              </h4>
              <p className="mb-0 opacity-90">
                {mode === "login"
                  ? "Sign in to continue your journey"
                  : "Let's learn, share & inspire each other 🚀"}
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className={`form-control form-control-custom ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className={`form-control form-control-custom ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control form-control-custom ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control form-control-custom ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {mode === "register" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control form-control-custom ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "25px",
                  border: "none",
                  padding: "12px 30px",
                  fontWeight: "600",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div
                      className="loading-spinner-custom me-2"
                      style={{ width: "20px", height: "20px" }}
                    ></div>
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        mode === "login"
                          ? "bi-box-arrow-in-right "
                          : "bi-person-plus"
                      } me-2`}
                    ></i>
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </>
                )}
              </button>

              <div className="text-center mb-3">
                <div className="d-flex align-items-center">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted">or continue with</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-custom w-100"
                  >
                    <i className="bi bi-facebook text-primary me-2"></i>
                    Facebook
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-custom w-100"
                  >
                    <i className="bi bi-google text-danger me-2"></i>
                    Google
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="mb-0">
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    onClick={() =>
                      onModeChange(mode === "login" ? "register" : "login")
                    }
                  >
                    {mode === "login" ? "Create new for free!" : "Sign In"}
                  </button>
                </p>
              </div>

              {mode === "register" && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-decoration-none">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-decoration-none">
                      Privacy Policy
                    </a>
                  </small>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
