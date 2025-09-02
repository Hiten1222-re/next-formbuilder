"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Eye, Settings, LogIn, Zap, Check, Star, Infinity, Brain } from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const steps = [
    {
      icon: LogIn,
      title: "Login",
      description: "Sign in to your account",
      color: "primary",
    },
    {
      icon: Settings,
      title: "Build",
      description: "Create your custom form",
      color: "purple",
    },
    {
      icon: Eye,
      title: "Preview",
      description: "See your form in action",
      color: "success",
    },
  ]

  const features = [
    {
      icon: Settings,
      title: "Drag & Drop Builder",
      description: "Intuitive interface with real-time preview",
      gradient: "primary",
    },
    {
      icon: Brain,
      title: "AI-Powered Forms",
      description: "Generate forms instantly with AI assistance",
      gradient: "purple",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for any device",
      gradient: "success",
    },
  ]

  const freeFeatures = ["5 forms per month", "Basic form elements", "Standard templates", "Email notifications"]

  const premiumFeatures = [
    { text: "Unlimited forms", icon: Infinity },
    { text: "AI form generation", icon: Brain },
    { text: "Advanced analytics", icon: Zap },
    { text: "Custom branding", icon: Star },
    { text: "Priority support", icon: Check },
  ]

  useEffect(() => {
    Cookies.remove('client')
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white bg-opacity-80 backdrop-blur border-bottom">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <div className="bg-gradient-primary rounded-2 p-2 me-2">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="fw-bold fs-4 text-gradient-primary">Dynamic Form Builder</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link href='/login' className="btn btn-outline-primary">Login</Link>
            <Link href='/builder' className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 position-relative overflow-hidden">
        <div className="hero-bg position-absolute top-0 start-0 w-100 h-100"></div>
        <div className="container position-relative py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className={`hero-content ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
                <span className="badge bg-gradient-primary text-white mb-4 p-2 fs-6">
                  <Sparkles className="me-2" size={16} />
                  AI-Powered Form Builder
                </span>
                <h1 className="display-1 fw-bold mb-4 text-gradient-hero">
                  Create Forms with
                  <span className="d-block text-gradient-primary">AI Magic</span>
                </h1>
                <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                  Build stunning, interactive forms in minutes. Preview in real-time, customize with ease, and leverage
                  AI for unlimited possibilities.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link href='/builder' className="btn btn-lg btn-gradient-primary px-4 py-3">
                    Start Building Free
                    <ArrowRight className="ms-2" size={20} />
                  </Link>
                  <Link href="#" className="btn btn-lg btn-outline-primary px-4 py-3">
                    Watch Demo
                    <Eye className="ms-2" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Steps Section */}
      <section className="py-5 bg-light bg-opacity-50">
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-4 fw-bold mb-3">Simple 3-Step Process</h2>
              <p className="lead text-muted">From idea to live form in minutes</p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between position-relative">
                {/* Connection Line */}
                <div className="connection-line d-none d-md-block position-absolute top-50 start-0 end-0 translate-middle-y"></div>

                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isPassed = currentStep > index

                  return (
                    <div key={index} className="d-flex flex-column align-items-center mb-4 mb-md-0 position-relative">
                      <div
                        className={`
                        step-circle rounded-circle d-flex align-items-center justify-content-center mb-3 position-relative
                        ${isActive ? "step-active" : ""}
                        ${isPassed ? "step-passed" : ""}
                        ${!isActive && !isPassed ? "step-inactive" : ""}
                      `}
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Icon size={32} className="text-white" />
                        {isPassed && (
                          <div
                            className="position-absolute top-0 end-0 bg-success rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "24px", height: "24px", transform: "translate(25%, -25%)" }}
                          >
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className={`h5 fw-semibold mb-2 ${isActive ? "text-primary" : "text-dark"}`}>{step.title}</h3>
                      <p className="text-muted text-center" style={{ maxWidth: "200px" }}>
                        {step.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row g-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="col-md-4">
                  <div className="card h-100 border-0 shadow-lg feature-card bg-white bg-opacity-80 backdrop-blur">
                    <div className="card-body p-4">
                      <div
                        className={`bg-gradient-${feature.gradient} rounded-3 d-inline-flex align-items-center justify-content-center mb-3 feature-icon`}
                        style={{ width: "48px", height: "48px" }}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <h4 className="card-title h5 fw-bold">{feature.title}</h4>
                      <p className="card-text text-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Premium Plans */}
      <section className="py-5 bg-gradient-light">
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="badge bg-gradient-warning text-dark mb-3 p-2 fs-6">
                <Star className="me-2" size={16} />
                Limited Time Offer
              </span>
              <h2 className="display-4 fw-bold mb-3">Unlock Premium Features</h2>
              <p className="lead text-muted">Get unlimited forms and AI-powered assistance</p>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-lg-5">
              {/* Free Plan */}
              <div className="card h-100 border-2 border-secondary shadow-lg">
                <div className="card-body p-4">
                  <h3 className="card-title h4 fw-bold">Free Plan</h3>
                  <p className="card-text text-muted mb-3">Perfect for getting started</p>
                  <div className="mb-4">
                    <span className="display-5 fw-bold">$0</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="d-flex align-items-center mb-2">
                        <Check size={20} className="text-success me-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-outline-primary w-100 mt-4">Get Started Free</button>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              {/* Premium Plan */}
              <div className="card h-100 border-0 shadow-lg premium-card position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-warning text-dark px-3 py-2">
                    <Sparkles className="me-1" size={16} />
                    Most Popular
                  </span>
                </div>
                <div className="card-body p-4 text-white">
                  <h3 className="card-title h4 fw-bold text-white">Premium Plan</h3>
                  <p className="card-text text-white-50 mb-3">Everything you need to scale</p>
                  <div className="mb-4">
                    <span className="display-5 fw-bold text-white">$19</span>
                    <span className="text-white-50">/month</span>
                    <div className="small text-white-50 text-decoration-line-through">$39/month</div>
                  </div>
                  <ul className="list-unstyled">
                    {premiumFeatures.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <li key={index} className="d-flex align-items-center mb-2">
                          <Icon size={20} className="text-warning me-3" />
                          <span className="text-white">{feature.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <button className="btn btn-light text-primary w-100 mt-4 fw-semibold">
                    Start Premium Trial
                    <ArrowRight className="ms-2" size={16} />
                  </button>
                  <p className="text-center text-white-50 small mt-3 mb-0">
                    50% off for limited time • No credit card required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary">
        <div className="container py-5 text-center">
          <h2 className="display-4 fw-bold text-white mb-4">Ready to Build Amazing Forms?</h2>
          <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Join thousands of creators who trust our platform to build beautiful, functional forms that convert.
          </p>
          <button className="btn btn-light btn-lg text-primary px-4 py-3 fw-semibold">
            Start Your Free Trial
            <ArrowRight className="ms-2" size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="bg-gradient-primary rounded-2 p-2 me-2">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="fw-bold fs-4">Dynamic Form Builder</span>
            </div>
            <div className="text-muted">© 2024 Dynamic Form Builder. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
