import { getState } from '@/lib/simulation'
import { NextResponse } from 'next/server'

export async function GET() {
  const state = getState()
  return NextResponse.json({
    riskScores: state.riskScores,
    alerts: state.alerts,
    containment: state.containment,
    financialExposure: state.financialExposure,
    cyberEvents: state.cyberEvents,
    transactionEvents: state.transactionEvents,
    geminiAnalysis: state.geminiAnalysis,
    network: state.network,
    events: state.events,
  })
}
