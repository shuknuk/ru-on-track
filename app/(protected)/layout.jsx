'use client'

import { RequireAuth } from '@/app/components/auth/RequireAuth'

export default function ProtectedLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>
}
