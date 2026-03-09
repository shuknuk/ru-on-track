'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { calculateRemainingCredits } from '@/app/utils/creditCounter'
import { supabase } from '@/app/supabase'

function StatusPill({ ok, label }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {label}
    </span>
  )
}

export default function DebugPage() {
  const [testUser, setTestUser] = useState({
    email: 'testuser@rutgers.edu',
    major_primary: 'Computer Science',
    major_secondary: 'Mathematics',
    credits_completed: 14,
    years_to_complete: 3,
    gpa_goal: 3.7,
    is_premium: false,
  })
  const [loadingConnection, setLoadingConnection] = useState(true)
  const [connectionResults, setConnectionResults] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)

  const checkConnection = useCallback(async () => {
    setLoadingConnection(true)

    if (!supabase) {
      setConnectionResults({
        configured: false,
        authReachable: false,
        profilesReadable: false,
        plansReadable: false,
        hasSession: false,
        errors: ['Supabase client is not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'],
      })
      setLastChecked(new Date().toISOString())
      setLoadingConnection(false)
      return
    }

    const errors = []

    const authRes = await supabase.auth.getSession()
    const authReachable = !authRes.error
    if (authRes.error) errors.push(`Auth check failed: ${authRes.error.message}`)

    const profilesRes = await supabase.from('profiles').select('id').limit(1)
    const profilesReadable = !profilesRes.error
    if (profilesRes.error) errors.push(`Profiles check failed: ${profilesRes.error.message}`)

    const plansRes = await supabase.from('plans').select('id').limit(1)
    const plansReadable = !plansRes.error
    if (plansRes.error) errors.push(`Plans check failed: ${plansRes.error.message}`)

    setConnectionResults({
      configured: true,
      authReachable,
      profilesReadable,
      plansReadable,
      hasSession: Boolean(authRes.data?.session),
      errors,
    })
    setLastChecked(new Date().toISOString())
    setLoadingConnection(false)
  }, [])

  const creditsRemaining = useMemo(
    () => calculateRemainingCredits(testUser.credits_completed || 0),
    [testUser.credits_completed]
  )
  const connectionOk = Boolean(
    connectionResults?.configured &&
    connectionResults?.authReachable &&
    connectionResults?.profilesReadable &&
    connectionResults?.plansReadable
  )

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const handleChange = (name, value, type = 'text') => {
    setTestUser((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-scarlet">Debug Playground</h1>
            <p className="text-gray-600 mt-2">
              Test major UI states with a local mock test user. This page does not write to Supabase.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Test User Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Primary Major</span>
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.major_primary}
                  onChange={(e) => handleChange('major_primary', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Secondary Major</span>
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.major_secondary}
                  onChange={(e) => handleChange('major_secondary', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Credits Completed (0-120)</span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.credits_completed}
                  onChange={(e) => handleChange('credits_completed', e.target.value, 'number')}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Years To Complete (1-4)</span>
                <input
                  type="number"
                  min="1"
                  max="4"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.years_to_complete}
                  onChange={(e) => handleChange('years_to_complete', e.target.value, 'number')}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">GPA Goal (2.0-4.0)</span>
                <input
                  type="number"
                  min="2"
                  max="4"
                  step="0.1"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={testUser.gpa_goal}
                  onChange={(e) => handleChange('gpa_goal', e.target.value, 'number')}
                />
              </label>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Dashboard Component Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Credits Completed</p>
                <p className="text-3xl font-bold text-scarlet">{testUser.credits_completed}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Credits Remaining</p>
                <p className="text-3xl font-bold text-scarlet">{creditsRemaining}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">GPA Goal</p>
                <p className="text-3xl font-bold text-scarlet">{testUser.gpa_goal.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Semesters Left</p>
                <p className="text-3xl font-bold text-scarlet">{testUser.years_to_complete * 2}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Credit Progress</span>
                  <span>{testUser.credits_completed} / 120</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.min(100, ((testUser.credits_completed || 0) / 120) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time Progress</span>
                  <span>{4 - testUser.years_to_complete} / 4 years</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-scarlet rounded-full"
                    style={{ width: `${((4 - testUser.years_to_complete) / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Route Test Links</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="bg-scarlet text-white px-4 py-2 rounded-lg">Dashboard</Link>
              <Link href="/planner" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Planner</Link>
              <Link href="/easyA" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Easy A</Link>
              <Link href="/professors" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Professors</Link>
              <Link href="/settings" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Settings</Link>
              <Link href="/onboarding" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Onboarding</Link>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Supabase Connection Check</h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusPill
                ok={!loadingConnection && connectionOk}
                label={loadingConnection ? 'Checking...' : connectionOk ? 'Connected' : 'Issues Detected'}
              />
              {lastChecked && (
                <span className="text-sm text-gray-500">Last checked: {new Date(lastChecked).toLocaleString()}</span>
              )}
            </div>

            <button
              onClick={checkConnection}
              disabled={loadingConnection}
              className="bg-scarlet text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loadingConnection ? 'Checking...' : 'Re-run checks'}
            </button>

            <div className="space-y-3 mt-5">
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <span>Supabase client configured</span>
                <StatusPill ok={Boolean(connectionResults?.configured)} label={connectionResults?.configured ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <span>Auth endpoint reachable</span>
                <StatusPill ok={Boolean(connectionResults?.authReachable)} label={connectionResults?.authReachable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <span>`profiles` table readable</span>
                <StatusPill ok={Boolean(connectionResults?.profilesReadable)} label={connectionResults?.profilesReadable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <span>`plans` table readable</span>
                <StatusPill ok={Boolean(connectionResults?.plansReadable)} label={connectionResults?.plansReadable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <span>Active session</span>
                <StatusPill ok={Boolean(connectionResults?.hasSession)} label={connectionResults?.hasSession ? 'Yes' : 'No'} />
              </div>
            </div>

            {!!connectionResults?.errors?.length && (
              <div className="mt-5 border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <h3 className="text-red-700 font-semibold mb-2">Errors</h3>
                <ul className="list-disc pl-5 text-red-700 space-y-1">
                  {connectionResults.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
