'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SimulationState, AppMode } from '@/lib/types'

export function useSimulation(mode: AppMode) {
  const [data, setData] = useState<SimulationState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (mode === 'landing') return

    try {
      // Trigger simulation tick
      const simRes = await fetch('/api/simulate')
      if (!simRes.ok) throw new Error('Simulation failed')

      // Fetch the appropriate dashboard
      const endpoint = mode === 'bank' ? '/api/bank/dashboard' : '/api/user/dashboard'
      const dashRes = await fetch(endpoint)
      if (!dashRes.ok) throw new Error('Dashboard fetch failed')

      const dashData = await dashRes.json()
      setData(dashData)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    if (mode === 'landing') return

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [mode, fetchData])

  return { data, loading, error }
}
