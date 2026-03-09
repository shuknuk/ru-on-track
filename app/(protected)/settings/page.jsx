'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { useAuth } from '@/app/AuthProvider'
import Markdown from '@/app/components/common/Markdown'
import { supabase } from '@/app/supabase'
import { Button } from '@/app/components/ui/Button'
import { FadeIn } from '@/app/components/motion/MotionPrimitives'

export default function Settings() {
  const router = useRouter()
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    const { error } = await signOut()

    if (error) {
      console.error('Sign out failed:', error)
    }

    router.push('/auth')

    setTimeout(async () => {
      if (!supabase) {
        window.location.href = '/'
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.href = '/'
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 md:p-12">
          <FadeIn>
            <h1 className="mb-8 font-sans text-5xl font-bold tracking-[-0.05em] text-foreground">Settings</h1>
          </FadeIn>
          <FadeIn className="max-w-3xl border border-border bg-card p-8" delay={0.08}>
            <div className="mb-8 border-b border-border pb-8">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</h2>
              <Markdown className="text-foreground" content={`Email: ${profile?.email || 'Not available'}`} />
              <Markdown className="text-foreground" content={`Major: ${profile?.major_primary || 'Not set'}`} />
            </div>
            <div className="mb-8 border-b border-border pb-8">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Subscription</h2>
              <Markdown className="text-foreground" content={`Current plan: ${profile?.is_premium ? 'Premium' : 'Free Tier'}`} />
              {!profile?.is_premium && (
                <Button variant="outline" className="mt-5">
                  Upgrade to Premium
                </Button>
              )}
            </div>
            <div className="mb-6">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Actions</h2>
              <Button
                onClick={handleSignOut}
                variant="primary"
              >
                Sign Out
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
