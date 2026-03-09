'use client'

import Link from 'next/link'
import { useAuth } from '@/app/AuthProvider'
import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { calculateRemainingCredits } from '@/app/utils/creditCounter'
import Markdown from '@/app/components/common/Markdown'

export default function Dashboard() {
  const { profile } = useAuth()

  const totalCreditsPlanned = 0
  const creditsCompleted = profile?.credits_completed || 0
  const creditsRemaining = calculateRemainingCredits(creditsCompleted)
  const gpaGoal = profile?.gpa_goal || 3.5
  const yearsRemaining = profile?.years_to_complete || 4

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-8 motion-fade-up">
            <h1 className="mb-3 font-sans text-5xl font-extrabold tracking-[-0.05em] text-foreground">
              Welcome back{profile?.email ? `, ${profile.email.split('@')[0]}` : ''}!
            </h1>
            <Markdown
              className="text-sm uppercase tracking-[0.08em] text-muted-foreground"
              content={[
                profile?.major_primary ? `Major: **${profile.major_primary}**` : '',
                profile?.major_secondary ? `& **${profile.major_secondary}**` : '',
                profile?.grad_year ? `• Graduating **${profile.grad_year}**` : '',
              ].filter(Boolean).join(' ')}
            />
          </div>

          <div className="mb-10 grid grid-cols-1 gap-0 border border-border md:grid-cols-2 lg:grid-cols-4 motion-stagger">
            <div className="border border-border bg-card p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">Credits Planned</h2>
              <p className="text-4xl font-extrabold tracking-[-0.04em] text-accent">{totalCreditsPlanned}</p>
              <Markdown className="mt-2 text-sm text-muted-foreground" content="Courses in your plan" />
            </div>
            <div className="border border-border bg-card p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">Credits Remaining</h2>
              <p className="text-4xl font-extrabold tracking-[-0.04em] text-accent">{creditsRemaining}</p>
              <Markdown className="mt-2 text-sm text-muted-foreground" content="To reach 120 credits" />
            </div>
            <div className="border border-border bg-card p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">GPA Goal</h2>
              <p className="text-4xl font-extrabold tracking-[-0.04em] text-accent">{gpaGoal.toFixed(1)}</p>
              <Markdown className="mt-2 text-sm text-muted-foreground" content="Target GPA" />
            </div>
            <div className="border border-border bg-card p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">Semesters Left</h2>
              <p className="text-4xl font-extrabold tracking-[-0.04em] text-accent">{yearsRemaining * 2}</p>
              <Markdown className="mt-2 text-sm text-muted-foreground" content={`${yearsRemaining} year${yearsRemaining !== 1 ? 's' : ''}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 motion-stagger">
            <div className="border border-border bg-card p-6">
              <h2 className="mb-6 text-3xl font-bold tracking-[-0.04em] text-foreground">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/planner"
                  className="group block border border-border p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center text-lg text-accent">
                      <span className="font-bold">📅</span>
                    </div>
                    <div>
                      <h3 className="font-semibold uppercase tracking-[0.08em] text-foreground">4-Year Planner</h3>
                      <Markdown className="text-sm text-muted-foreground" content="Drag and drop courses" />
                    </div>
                  </div>
                </Link>
                <Link
                  href="/easyA"
                  className="group block border border-border p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center text-lg text-accent">
                      <span className="font-bold">⭐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold uppercase tracking-[0.08em] text-foreground">Easy A Finder</h3>
                      <Markdown className="text-sm text-muted-foreground" content="GPA-boosting courses" />
                    </div>
                  </div>
                </Link>
                <Link
                  href="/professors"
                  className="group block border border-border p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center text-lg text-accent">
                      <span className="font-bold">👨‍🏫</span>
                    </div>
                    <div>
                      <h3 className="font-semibold uppercase tracking-[0.08em] text-foreground">Professor Ratings</h3>
                      <Markdown className="text-sm text-muted-foreground" content="RateMyProfessors links" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <h2 className="mb-6 text-3xl font-bold tracking-[-0.04em] text-foreground">Progress Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm uppercase tracking-[0.08em] text-muted-foreground">
                    <span>Credits Completed</span>
                    <span>{creditsCompleted} / 120</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${Math.min(100, (creditsCompleted / 120) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm uppercase tracking-[0.08em] text-muted-foreground">
                    <span>Time Progress</span>
                    <span>{4 - yearsRemaining} / 4 years</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${((4 - yearsRemaining) / 4) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="border-t border-border pt-6">
                    <Markdown className="text-sm text-muted-foreground" content="**Next Step:** Add courses to your 4-year plan to track your progress." />
                    <Link
                      href="/planner"
                      className="mt-4 inline-flex items-center text-sm font-semibold uppercase tracking-[0.1em] text-accent after:ml-3 after:block after:h-0.5 after:w-10 after:bg-accent"
                    >
                      Start Planning
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
