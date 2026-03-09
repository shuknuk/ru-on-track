'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/app/AuthProvider'
import Markdown from '@/app/components/common/Markdown'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { ThemeToggle } from '@/app/components/theme/ThemeToggle'
import { FadeIn } from '@/app/components/motion/MotionPrimitives'

export default function Auth() {
  const router = useRouter()
  const { user, signIn, signUp, loading: authLoading, authInitWarning } = useAuth()
  const [activeTab, setActiveTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin border-b-2 border-t-2 border-accent"></div>
      </div>
    )
  }

  const validateEmail = (email) => {
    const normalized = email.trim()
    if (!normalized) {
      return 'Email is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validateForm = () => {
    const newErrors = {}

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const withTimeout = async (promise, timeoutMs = 10000) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out. Please check your internet and try again.')), timeoutMs)
    })
    return Promise.race([promise, timeoutPromise])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitMessage('')

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setLoading(true)

    try {
      if (activeTab === 'signin') {
        const { error } = await withTimeout(signIn(formData.email.trim(), formData.password))
        if (error) {
          setSubmitError(error.message || 'Failed to sign in')
          toast.error(error.message || 'Failed to sign in')
        } else {
          toast.success('Signed in successfully!')
          router.replace('/dashboard')
          setTimeout(() => {
            if (window.location.pathname === '/auth') {
              window.location.href = '/dashboard'
            }
          }, 800)
        }
      } else {
        const { data, error } = await withTimeout(signUp(formData.email.trim(), formData.password))
        if (error) {
          setSubmitError(error.message || 'Failed to sign up')
          toast.error(error.message || 'Failed to sign up')
        } else {
          if (data?.session) {
            toast.success('Account created!')
            router.push('/dashboard')
          } else {
            setSubmitMessage('Check your email to confirm your account before signing in.')
            toast.success('Check your email to confirm your account.')
          }
        }
      }
    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      <Toaster position="top-center" />
      <FadeIn className="w-full max-w-md border border-border bg-card" amount={0.2}>
        <div className="flex justify-end border-b border-border px-4 py-3">
          <ThemeToggle />
        </div>
        <div className="flex border-b border-border">
          <button
            className={`flex-1 border-b-2 py-4 text-center text-xs font-semibold uppercase tracking-[0.1em] ${activeTab === 'signin' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 border-b-2 py-4 text-center text-xs font-semibold uppercase tracking-[0.1em] ${activeTab === 'signup' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <h1 className="mb-8 text-center font-sans text-4xl font-bold tracking-[-0.04em] text-foreground">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>

          {authInitWarning && (
            <FadeIn className="mb-6 border-l-2 border-yellow-500 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300" once={false} amount={0.01}>
              {authInitWarning}
            </FadeIn>
          )}

          {submitError && (
            <FadeIn className="mb-6 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400" once={false} amount={0.01}>
              {submitError}
            </FadeIn>
          )}
          {submitMessage && (
            <FadeIn className="mb-6 border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm text-accent" once={false} amount={0.01}>
              {submitMessage}
            </FadeIn>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Rutgers Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
              <Markdown className="mt-2 text-sm text-muted-foreground" content="Enter any valid email address" />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'border-red-500' : ''}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
              <Markdown className="mt-2 text-sm text-muted-foreground" content="Must be at least 8 characters" />
            </div>

            {activeTab === 'signup' && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {activeTab === 'signin' ? 'Signing in...' : 'Signing up...'}
                </span>
              ) : (
                activeTab === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm uppercase tracking-[0.1em] text-muted-foreground hover:text-accent">
              Back to home
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
