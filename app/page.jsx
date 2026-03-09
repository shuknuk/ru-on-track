import Link from 'next/link'
import { ButtonLink } from '@/app/components/ui/Button'
import { ThemeToggle } from '@/app/components/theme/ThemeToggle'
import { BrandLogo } from '@/app/components/theme/BrandLogo'
import { FadeIn, StaggerGroup, FadeItem } from '@/app/components/motion/MotionPrimitives'

export default function Landing() {
  const features = [
    {
      icon: '📅',
      title: '4-Year Planner',
      description: 'Map fall, spring, and summer terms with a full graduation timeline view.'
    },
    {
      icon: '⭐',
      title: 'Easy A Finder',
      description: 'Discover lower-risk course options to protect your GPA target each semester.'
    },
    {
      icon: '👨‍🏫',
      title: 'Professor Ratings',
      description: 'Evaluate instructor options quickly with curated rating links and context.'
    },
    {
      icon: '🔄',
      title: 'CC Transfer Suggester',
      description: 'See community college alternatives that may transfer back to Rutgers.'
    },
    {
      icon: '✅',
      title: 'Requirement Tracker',
      description: 'Track core, major, and elective completion so nothing falls through the cracks.'
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3 font-display text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
            <BrandLogo size={32} priority />
            <span>RutgersPlan</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonLink href="/auth" variant="ghost" size="sm">
              Sign In
            </ButtonLink>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <FadeIn className="border-t border-border pt-8" amount={0.1}>
            <p className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Rutgers University Planning Assistant
            </p>
            <h1 className="max-w-5xl font-sans text-5xl font-extrabold leading-[1] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
              Build your perfect 4-year course plan at Rutgers University
            </h1>
            <p className="mt-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Organize graduation requirements, compare courses, and make smarter semester decisions with one clean planner.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/auth" variant="primary" size="lg">
                Get Started
              </ButtonLink>
              <ButtonLink href="/auth" variant="outline" size="md">
                Sign In
              </ButtonLink>
            </div>
          </FadeIn>
        </section>

        <section className="mx-auto w-full max-w-6xl border-t border-border px-6 py-20">
          <h2 className="mb-10 font-sans text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">Everything you need to plan with confidence</h2>
          <StaggerGroup className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3" amount={0.1}>
            {features.map((feature) => (
              <FadeItem key={feature.title}>
                <div className="border border-border bg-card p-6 transition-colors duration-150 hover:bg-muted">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center text-2xl text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                </div>
              </FadeItem>
            ))}
          </StaggerGroup>
        </section>
      </main>
    </div>
  )
}
