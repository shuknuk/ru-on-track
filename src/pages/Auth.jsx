import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function Auth() {
  const navigate = useNavigate()
  const { user, profile, signIn, signUp, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      if (profile?.major_primary) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
      }
    }
  }, [user, profile, authLoading, navigate])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scarlet"></div>
      </div>
    )
  }

  const validateEmail = (email) => {
    if (!email.includes('@')) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validateForm = () => {
    const newErrors = {}

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setLoading(true)

    try {
      if (activeTab === 'signin') {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          toast.error(error.message || 'Failed to sign in')
        } else {
          toast.success('Signed in successfully!')
          navigate('/dashboard')
        }
      } else {
        const { error } = await signUp(formData.email, formData.password)
        if (error) {
          toast.error(error.message || 'Failed to sign up')
        } else {
          toast.success('Account created! Check your email to confirm your account.')
          navigate('/onboarding')
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 font-medium text-center ${activeTab === 'signin' ? 'text-scarlet border-b-2 border-scarlet' : 'text-gray-500'}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 font-medium text-center ${activeTab === 'signup' ? 'text-scarlet border-b-2 border-scarlet' : 'text-gray-500'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-scarlet mb-8">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Rutgers Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-scarlet focus:border-transparent transition`}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Enter any valid email address
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-scarlet focus:border-transparent transition`}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            {activeTab === 'signup' && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-scarlet focus:border-transparent transition`}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-scarlet text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                activeTab === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-scarlet hover:underline">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}