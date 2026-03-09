'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const THEMES = ['dark', 'light']

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('rp-theme') : null
    const initialTheme = THEMES.includes(stored) ? stored : 'dark'
    document.documentElement.setAttribute('data-theme', initialTheme)
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      window.localStorage.setItem('rp-theme', next)
      return next
    })
  }

  const setThemeValue = (nextTheme) => {
    if (!THEMES.includes(nextTheme)) return
    document.documentElement.setAttribute('data-theme', nextTheme)
    window.localStorage.setItem('rp-theme', nextTheme)
    setTheme(nextTheme)
  }

  const value = useMemo(() => ({ theme, toggleTheme, setTheme: setThemeValue }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
