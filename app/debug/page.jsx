'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { calculateRemainingCredits } from '@/app/utils/creditCounter'
import { supabase } from '@/app/supabase'
import { ButtonLink, Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'

function StatusPill({ ok, label }) {
  return (
    <span className={`inline-flex items-center border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${ok ? 'border-accent text-accent' : 'border-red-500 text-red-400'}`}>
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 space-y-8 p-8 md:p-12">
          <section className="border border-border bg-card p-6 motion-fade-up">
            <h1 className="text-5xl font-bold tracking-[-0.05em] text-foreground">Debug Playground</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.1em] text-muted-foreground">
              Test major UI states with a local mock test user. This page does not write to Supabase.
            </p>
          </section>

          <section className="border border-border bg-card p-6 motion-fade-up motion-delay-1">
            <h2 className="mb-6 text-3xl font-bold tracking-[-0.04em] text-foreground">Test User Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Email</span>
                <Input
                  className="mt-2"
                  value={testUser.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Primary Major</span>
                <Input
                  className="mt-2"
                  value={testUser.major_primary}
                  onChange={(e) => handleChange('major_primary', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Secondary Major</span>
                <Input
                  className="mt-2"
                  value={testUser.major_secondary}
                  onChange={(e) => handleChange('major_secondary', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Credits Completed (0-120)</span>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  className="mt-2"
                  value={testUser.credits_completed}
                  onChange={(e) => handleChange('credits_completed', e.target.value, 'number')}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Years To Complete (1-4)</span>
                <Input
                  type="number"
                  min="1"
                  max="4"
                  className="mt-2"
                  value={testUser.years_to_complete}
                  onChange={(e) => handleChange('years_to_complete', e.target.value, 'number')}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">GPA Goal (2.0-4.0)</span>
                <Input
                  type="number"
                  min="2"
                  max="4"
                  step="0.1"
                  className="mt-2"
                  value={testUser.gpa_goal}
                  onChange={(e) => handleChange('gpa_goal', e.target.value, 'number')}
                />
              </label>
            </div>
          </section>

          <section className="border border-border bg-card p-6 motion-fade-up motion-delay-2">
            <h2 className="mb-6 text-3xl font-bold tracking-[-0.04em] text-foreground">Dashboard Component Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Credits Completed</p>
                <p className="text-4xl font-bold tracking-[-0.04em] text-accent">{testUser.credits_completed}</p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Credits Remaining</p>
                <p className="text-4xl font-bold tracking-[-0.04em] text-accent">{creditsRemaining}</p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">GPA Goal</p>
                <p className="text-4xl font-bold tracking-[-0.04em] text-accent">{testUser.gpa_goal.toFixed(1)}</p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Semesters Left</p>
                <p className="text-4xl font-bold tracking-[-0.04em] text-accent">{testUser.years_to_complete * 2}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                  <div className="mb-1 flex justify-between text-sm uppercase tracking-[0.08em] text-muted-foreground">
                  <span>Credit Progress</span>
                  <span>{testUser.credits_completed} / 120</span>
                </div>
                <div className="h-2 bg-muted">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${Math.min(100, ((testUser.credits_completed || 0) / 120) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm uppercase tracking-[0.08em] text-muted-foreground">
                  <span>Time Progress</span>
                  <span>{4 - testUser.years_to_complete} / 4 years</span>
                </div>
                <div className="h-2 bg-muted">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${((4 - testUser.years_to_complete) / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card p-6 motion-fade-up motion-delay-3">
            <h2 className="mb-4 text-3xl font-bold tracking-[-0.04em] text-foreground">Route Test Links</h2>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/dashboard" variant="primary">Dashboard</ButtonLink>
              <ButtonLink href="/planner" variant="outline">Planner</ButtonLink>
              <ButtonLink href="/easyA" variant="outline">Easy A</ButtonLink>
              <ButtonLink href="/professors" variant="outline">Professors</ButtonLink>
              <ButtonLink href="/settings" variant="outline">Settings</ButtonLink>
              <ButtonLink href="/onboarding" variant="outline">Onboarding</ButtonLink>
            </div>
          </section>

          <section className="border border-border bg-card p-6 motion-fade-up motion-delay-4">
            <h2 className="mb-4 text-3xl font-bold tracking-[-0.04em] text-foreground">Supabase Connection Check</h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusPill
                ok={!loadingConnection && connectionOk}
                label={loadingConnection ? 'Checking...' : connectionOk ? 'Connected' : 'Issues Detected'}
              />
              {lastChecked && (
                <span className="text-sm text-muted-foreground">Last checked: {new Date(lastChecked).toLocaleString()}</span>
              )}
            </div>

            <Button
              onClick={checkConnection}
              disabled={loadingConnection}
            >
              {loadingConnection ? 'Checking...' : 'Re-run checks'}
            </Button>

            <div className="space-y-3 mt-5">
              <div className="flex items-center justify-between border border-border p-3">
                <span>Supabase client configured</span>
                <StatusPill ok={Boolean(connectionResults?.configured)} label={connectionResults?.configured ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-border p-3">
                <span>Auth endpoint reachable</span>
                <StatusPill ok={Boolean(connectionResults?.authReachable)} label={connectionResults?.authReachable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-border p-3">
                <span>`profiles` table readable</span>
                <StatusPill ok={Boolean(connectionResults?.profilesReadable)} label={connectionResults?.profilesReadable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-border p-3">
                <span>`plans` table readable</span>
                <StatusPill ok={Boolean(connectionResults?.plansReadable)} label={connectionResults?.plansReadable ? 'OK' : 'Fail'} />
              </div>
              <div className="flex items-center justify-between border border-border p-3">
                <span>Active session</span>
                <StatusPill ok={Boolean(connectionResults?.hasSession)} label={connectionResults?.hasSession ? 'Yes' : 'No'} />
              </div>
            </div>

            {!!connectionResults?.errors?.length && (
              <div className="mt-5 border-l-4 border-red-500 bg-red-500/10 p-4">
                <h3 className="mb-2 font-semibold text-red-400">Errors</h3>
                <ul className="list-disc space-y-1 pl-5 text-red-400">
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
