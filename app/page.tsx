'use client'

import { useState } from 'react'
import type { AppMode } from '@/lib/types'
import { LandingScreen } from '@/components/landing-screen'
import { BankDashboard } from '@/components/bank-dashboard'
import { UserDashboard } from '@/components/user-dashboard'

export default function Home() {
  const [mode, setMode] = useState<AppMode>('landing')

  if (mode === 'bank') {
    return <BankDashboard onBack={() => setMode('landing')} />
  }

  if (mode === 'user') {
    return <UserDashboard onBack={() => setMode('landing')} />
  }

  return <LandingScreen onSelectMode={setMode} />
}
