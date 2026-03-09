'use client'

import Image from 'next/image'
import { useTheme } from '@/app/components/theme/ThemeProvider'

export function BrandLogo({ size = 28, priority = false }) {
  const { theme } = useTheme()
  const src = theme === 'light' ? '/logo-light.svg' : '/logo-dark.svg'

  return <Image src={src} alt="RutgersPlan logo" width={size} height={size} priority={priority} />
}
