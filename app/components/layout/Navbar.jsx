'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/app/components/theme/ThemeToggle'

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 motion-fade-up">
        <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground">
          RutgersPlan
        </Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-[0.1em]">
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/debug" className="text-muted-foreground transition-colors hover:text-foreground">
            Debug
          </Link>
          <Link href="/settings" className="text-muted-foreground transition-colors hover:text-foreground">
            Settings
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
