'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/app/components/theme/ThemeToggle'
import { FadeIn, StaggerGroup, FadeItem } from '@/app/components/motion/MotionPrimitives'

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <FadeIn className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4" amount={0.05}>
        <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground">
          RutgersPlan
        </Link>
        <StaggerGroup className="flex items-center gap-6 text-sm uppercase tracking-[0.1em]" amount={0.05}>
          <FadeItem>
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </FadeItem>
          <FadeItem>
            <Link href="/debug" className="text-muted-foreground transition-colors hover:text-foreground">
              Debug
            </Link>
          </FadeItem>
          <FadeItem>
            <Link href="/settings" className="text-muted-foreground transition-colors hover:text-foreground">
              Settings
            </Link>
          </FadeItem>
          <FadeItem>
            <ThemeToggle />
          </FadeItem>
        </StaggerGroup>
      </FadeIn>
    </nav>
  )
}
