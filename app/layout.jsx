import { Inter_Tight, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/app/AuthProvider'
import { ThemeProvider } from '@/app/components/theme/ThemeProvider'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'RutgersPlan - Smart 4-Year Course Planning',
  description: 'Plan your Rutgers graduation with smart course suggestions, professor ratings, and transfer recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${playfairDisplay.variable} ${jetBrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
