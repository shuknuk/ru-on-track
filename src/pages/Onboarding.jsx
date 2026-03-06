import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import majorsData from '@/data/rutgers-majors.json'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Major selection
    major_primary: '',
    major_secondary: '',

    // Step 2: Academic standing
    credits_completed: 0,
    years_to_complete: 4,

    // Step 3: Preferences
    gpa_goal: 3.5,
    max_credits_per_semester: 15,
  })

  const calculateGradYear = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    // If it's already second half of year, count from next year
    const baseYear = currentMonth >= 7 ? currentYear + 1 : currentYear
    return baseYear + formData.years_to_complete
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? Number(value) : value
    }))
  }

  const handleStep1Submit = () => {
    if (!formData.major_primary) {
      toast.error('Please select a primary major')
      return false
    }
    setCurrentStep(2)
    return true
  }

  const handleStep2Submit = () => {
    if (formData.credits_completed < 0 || formData.credits_completed > 200) {
      toast.error('Please enter a valid number of completed credits (0-200)')
      return false
    }
    setCurrentStep(3)
    return true
  }

  const handleCompleteOnboarding = async () => {
    setLoading(true)
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          major_primary: formData.major_primary,
          major_secondary: formData.major_secondary || null,
          credits_completed: formData.credits_completed,
          years_to_complete: formData.years_to_complete,
          grad_year: calculateGradYear(),
          gpa_goal: formData.gpa_goal,
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Create default plan
      const { error: planError } = await supabase
        .from('plans')
        .insert([{
          user_id: user?.id,
          name: 'My 4-Year Plan',
          is_active: true,
        }])

      if (planError) throw planError

      toast.success('Onboarding completed!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to save onboarding data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Major *
        </label>
        <select
          name="major_primary"
          value={formData.major_primary}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-scarlet focus:border-transparent transition"
          required
        >
          <option value="">Select a major</option>
          {majorsData.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Major (Optional)
        </label>
        <select
          name="major_secondary"
          value={formData.major_secondary}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-scarlet focus:border-transparent transition"
        >
          <option value="">None</option>
          {majorsData.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Add a second major if you're pursuing a double major
        </p>
      </div>

      <button
        onClick={handleStep1Submit}
        className="w-full bg-scarlet text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        Continue to Step 2
      </button>
    </div>
  )

  const renderStep2 = () => {
    const gradYear = calculateGradYear()
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credits Already Completed
          </label>
          <input
            type="number"
            name="credits_completed"
            value={formData.credits_completed}
            onChange={handleInputChange}
            min="0"
            max="200"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-scarlet focus:border-transparent transition"
          />
          <p className="mt-2 text-sm text-gray-500">
            Including transfer credits and AP credits
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years to Complete Degree
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(years => (
              <button
                key={years}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, years_to_complete: years }))}
                className={`py-3 rounded-lg font-medium transition ${formData.years_to_complete === years ? 'bg-scarlet text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {years} {years === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Suggested graduation year:</span> {gradYear}
            <br />
            <span className="font-semibold">Credits remaining:</span> {Math.max(0, 120 - formData.credits_completed)}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            onClick={handleStep2Submit}
            className="flex-1 bg-scarlet text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Continue to Step 3
          </button>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          GPA Goal: <span className="font-bold text-scarlet">{formData.gpa_goal.toFixed(1)}</span>
        </label>
        <input
          type="range"
          name="gpa_goal"
          min="2.0"
          max="4.0"
          step="0.1"
          value={formData.gpa_goal}
          onChange={handleInputChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>2.0</span>
            <span>3.0</span>
            <span>4.0</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Max Credits Per Semester
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[9, 12, 15, 18].map(credits => (
            <button
              key={credits}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, max_credits_per_semester: credits }))}
              className={`py-3 rounded-lg font-medium transition ${formData.max_credits_per_semester === credits ? 'bg-scarlet text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {credits} credits
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Rutgers recommends 15 credits per semester for on-time graduation
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={handleCompleteOnboarding}
          disabled={loading}
          className="flex-1 bg-scarlet text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Onboarding'}
        </button>
      </div>
    </div>
  )

  const steps = [
    { number: 1, title: 'Select Major' },
    { number: 2, title: 'Academic Standing' },
    { number: 3, title: 'Preferences' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-scarlet mb-2">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Step {currentStep} of 3: {steps[currentStep - 1]?.title}
        </p>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map(step => (
              <div key={step.number} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${currentStep >= step.number ? 'bg-scarlet text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.number}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-scarlet rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  )
}