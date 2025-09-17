"use client"

import { useRef, useState } from "react"
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, Github } from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const email = useRef()
  const password = useRef()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",

    confirmPassword: "",
    fullName: "",
    rememberMe: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSignUp == false) {
      const res = await fetch('http://localhost:3100/user')
      const success = await res.json()
      // console.log(success);
      const filter1 = success.filter((e) => e.email == email.current.value)
      if(filter1[0].password!=password.current.value){alert("incorrect password or email"); return}
      if (filter1.length > 0) {
        console.log(filter1);

        const result = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ' + email.current.value + password.current.value
        let str = ''
        for (let i = 0; i < 50; i++) {
          str += result.charAt(Math.floor(Math.random() * result.length))
        }
        const dict = { 'token': str, 'id': filter1[0].id }
        console.log(filter1[0].id);
        
        const resform = await fetch(`http://localhost:3100/user/${filter1[0].id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 'token': str })
        })

      

        if (res.ok) {
          Cookies.set("client", JSON.stringify(dict))
          router.push("/")
        }

      }
      else {
        alert("account not found")
      }
      console.log('Successfully login');

    }
    else {
      const resacc = await fetch('http://localhost:3100/user', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!resacc.ok) {
        console.error('kaam ni hua');

      }
      console.log("Account created successfully")
    }

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      rememberMe: false,
    })
    // Handle form submission logic here
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      rememberMe: false,
    })
  }

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side - Image */}
      <div className="col-lg-6 d-none d-lg-block position-relative overflow-hidden">
        <div
          className="h-100 position-relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary opacity-75"></div>

          {/* Content */}
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5">
            <div className="text-center">
              <div className="mb-4">
                <div
                  className="bg-gradient-primary bg-opacity-20 rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <Sparkles size={40} className="text-white" />
                </div>
              </div>
              <h2 className="display-5 fw-bold mb-3">Welcome to Dynamic Form Builder</h2>
              <p className="lead mb-4 opacity-90">
                Create stunning forms with AI-powered tools and real-time preview capabilities.
              </p>
              <div className="d-flex justify-content-center gap-4 text-white-50">
                <div className="text-center">
                  <div className="h4 fw-bold">10K+</div>
                  <small>Forms Created</small>
                </div>
                <div className="text-center">
                  <div className="h4 fw-bold">5K+</div>
                  <small>Happy Users</small>
                </div>
                <div className="text-center">
                  <div className="h4 fw-bold">99%</div>
                  <small>Uptime</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {/* Header */}
          <div className="text-center mb-5">
            <Link href="/" className="text-decoration-none">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-gradient-primary rounded-2 p-2 me-2">
                  <Sparkles className="text-white" size={24} />
                </div>
                <span className="fw-bold fs-3 text-gradient-primary">Form Builder</span>
              </div>
            </Link>
            <h1 className="h3 fw-bold text-dark mb-2">{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p className="text-muted">
              {isSignUp ? "Start building amazing forms today" : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="mb-4">
            <button className="btn btn-outline-dark w-100 mb-3 py-2">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                width="20"
                height="20"
                className="me-2"
              />
              Continue with Google
            </button>
            <button className="btn btn-outline-dark w-100 mb-3 py-2">
              <Github size={20} className="me-2" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="text-center mb-4">
            <div className="position-relative">
              <hr className="my-4" />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-semibold">
                  <User size={16} className="me-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                <Mail size={16} className="me-2" />
                Email Address
              </label>
              <input
                type="email"
                ref={email}
                className="form-control form-control-lg"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                <Lock size={16} className="me-2" />
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  ref={password}
                  className="form-control form-control-lg pe-5"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                  onClick={togglePasswordVisibility}
                  style={{ border: "none", background: "none" }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  <Lock size={16} className="me-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required={isSignUp}
                />
              </div>
            )}

            {!isSignUp && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-decoration-none text-primary">
                  Forgot password?
                </Link>
              </div>
            )}

            {isSignUp && (
              <div className="mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="agreeTerms" required={isSignUp} />
                  <label className="form-check-label text-muted small" htmlFor="agreeTerms">
                    I agree to the{" "}
                    <Link href="#" className="text-primary text-decoration-none">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary text-decoration-none">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-gradient-primary btn-lg w-100 mb-4">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight size={20} className="ms-2" />
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center">
            <p className="text-muted mb-0">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={switchMode} className="btn btn-link p-0 text-primary text-decoration-none fw-semibold">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-5">
            <div className="d-flex justify-content-center gap-4 small text-muted">
              <Link href="#" className="text-muted text-decoration-none">
                Help
              </Link>
              <Link href="#" className="text-muted text-decoration-none">
                Privacy
              </Link>
              <Link href="#" className="text-muted text-decoration-none">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
