import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/AuthProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RutgersPlan - Smart 4-Year Course Planning',
  description: 'Plan your Rutgers graduation with smart course suggestions, professor ratings, and transfer recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
