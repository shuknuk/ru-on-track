import Link from 'next/link'
import { ThemeToggle } from '@/app/components/theme/ThemeToggle'
import { BrandLogo } from '@/app/components/theme/BrandLogo'
import { ButtonLink } from '@/app/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3 font-display text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
            <BrandLogo size={32} priority />
            <span>RutgersPlan</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Error 404</p>
        <h1 className="mt-4 max-w-4xl font-sans text-5xl font-extrabold leading-[1] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
          This page does not exist.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          The link may be broken or the page may have moved. Use the actions below to continue planning.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="/" variant="primary" size="lg">
            Back Home
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="outline" size="md">
            Go To Dashboard
          </ButtonLink>
        </div>
      </main>
    </div>
  )
}
