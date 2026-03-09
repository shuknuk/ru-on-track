'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/app/supabase'
import { useAuth } from '@/app/AuthProvider'
import majorsData from '@/app/data/rutgers-majors.json'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'

export default function Onboarding() {
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    major_primary: '',
    major_secondary: '',
    credits_completed: '',
    years_to_complete: 4,
    gpa_goal: 3.5,
    max_credits_per_semester: 15,
  })

  const completedCredits = formData.credits_completed === '' ? 0 : Number(formData.credits_completed)

  const calculateGradYear = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
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

  const handleCreditsChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '')

    if (digitsOnly === '') {
      setFormData(prev => ({ ...prev, credits_completed: '' }))
      return
    }

    const normalized = digitsOnly.replace(/^0+(?=\d)/, '')
    const numericValue = Number(normalized)

    if (numericValue < 0 || numericValue > 21) return

    setFormData(prev => ({ ...prev, credits_completed: normalized }))
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
    if (formData.credits_completed === '' || completedCredits < 0 || completedCredits > 21) {
      toast.error('Please enter a valid number of completed credits (0-21)')
      return false
    }
    setCurrentStep(3)
    return true
  }

  const handleCompleteOnboarding = async () => {
    setLoading(true)
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          major_primary: formData.major_primary,
          major_secondary: formData.major_secondary || null,
          credits_completed: completedCredits,
          years_to_complete: formData.years_to_complete,
          grad_year: calculateGradYear(),
          gpa_goal: formData.gpa_goal,
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      const { error: planError } = await supabase
        .from('plans')
        .insert([{
          user_id: user?.id,
          name: 'My 4-Year Plan',
          is_active: true,
        }])

      if (planError) throw planError

      await refreshProfile()

      toast.success('Onboarding completed!')
      router.push('/dashboard')
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
        <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Primary Major *
        </label>
        <select
          name="major_primary"
          value={formData.major_primary}
          onChange={handleInputChange}
          className="h-12 w-full border border-border bg-input px-4 text-base text-foreground outline-none transition-colors focus:border-accent"
          required
        >
          <option value="">Select a major</option>
          {majorsData.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Secondary Major (Optional)
        </label>
        <select
          name="major_secondary"
          value={formData.major_secondary}
          onChange={handleInputChange}
          className="h-12 w-full border border-border bg-input px-4 text-base text-foreground outline-none transition-colors focus:border-accent"
        >
          <option value="">None</option>
          {majorsData.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleStep1Submit}
        className="w-full justify-center"
      >
        Continue to Step 2
      </Button>
    </div>
  )

  const renderStep2 = () => {
    const gradYear = calculateGradYear()
    return (
      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Credits Already Completed
          </label>
          <Input
            type="text"
            name="credits_completed"
            value={formData.credits_completed}
            onChange={handleCreditsChange}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a whole number from 0 to 21 (including transfer and AP credits)
          </p>
          <p className="mt-1 text-sm">
            <a
              href="https://sasundergrad.rutgers.edu/degree-requirements/policies/credits-and-residency"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Rutgers SAS credits and residency policy
            </a>
          </p>
        </div>

        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Years to Complete Degree
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(years => (
              <button
                key={years}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, years_to_complete: years }))}
                className={`border px-2 py-3 text-sm uppercase tracking-[0.08em] transition ${formData.years_to_complete === years ? 'border-accent text-accent' : 'border-border text-muted-foreground hover:text-foreground'}`}
              >
                {years} {years === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-border bg-muted p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Suggested graduation year:</span> {gradYear}
            <br />
            <span className="font-semibold">Credits remaining:</span> {Math.max(0, 120 - completedCredits)}
          </p>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={() => setCurrentStep(1)}
            variant="outline"
            className="flex-1 justify-center"
          >
            Back
          </Button>
          <Button
            onClick={handleStep2Submit}
            className="flex-1 justify-center"
          >
            Continue to Step 3
          </Button>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-4 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
          GPA Goal: <span className="font-bold text-accent">{formData.gpa_goal.toFixed(1)}</span>
        </label>
        <input
          type="range"
          name="gpa_goal"
          min="2.0"
          max="4.0"
          step="0.1"
          value={formData.gpa_goal}
          onChange={handleInputChange}
          className="h-2 w-full cursor-pointer appearance-none bg-muted"
        />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>2.0</span>
          <span>3.0</span>
          <span>4.0</span>
        </div>
      </div>

      <div>
        <label className="mb-4 block font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Max Credits Per Semester
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[9, 12, 15, 18].map(credits => (
            <button
              key={credits}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, max_credits_per_semester: credits }))}
              className={`border px-2 py-3 text-sm uppercase tracking-[0.08em] transition ${formData.max_credits_per_semester === credits ? 'border-accent text-accent' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {credits} credits
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={() => setCurrentStep(2)}
          variant="outline"
          className="flex-1 justify-center"
        >
          Back
        </Button>
        <Button
          onClick={handleCompleteOnboarding}
          disabled={loading}
          className="flex-1 justify-center"
        >
          {loading ? 'Saving...' : 'Complete Onboarding'}
        </Button>
      </div>
    </div>
  )

  const steps = [
    { number: 1, title: 'Select Major' },
    { number: 2, title: 'Academic Standing' },
    { number: 3, title: 'Preferences' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl border border-border bg-card p-8">
        <h1 className="mb-2 text-center font-sans text-5xl font-bold tracking-[-0.05em] text-foreground">
          Complete Your Profile
        </h1>
        <p className="mb-8 text-center text-sm uppercase tracking-[0.1em] text-muted-foreground">
          Step {currentStep} of 3: {steps[currentStep - 1]?.title}
        </p>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map(step => (
              <div key={step.number} className="text-center">
                <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center border ${currentStep >= step.number ? 'border-accent text-accent' : 'border-border text-muted-foreground'}`}>
                  {step.number}
                </div>
                <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  )
}
