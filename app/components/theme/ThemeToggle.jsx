'use client'

import { useTheme } from '@/app/components/theme/ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex border border-border" role="group" aria-label="Theme selector">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${theme === 'light' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`border-l border-border px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${theme === 'dark' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Dark
      </button>
    </div>
  )
}
