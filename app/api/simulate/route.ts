import { simulateTick } from '@/lib/simulation'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const state = simulateTick()
    return NextResponse.json(state)
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
