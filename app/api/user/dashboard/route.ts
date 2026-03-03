import { getState } from '@/lib/simulation'
import { NextResponse } from 'next/server'

export async function GET() {
  const state = getState()

  // Find highest risk account for user mode
  const highestRisk = state.riskScores.reduce((max, rs) =>
    rs.unifiedScore > max.unifiedScore ? rs : max,
    state.riskScores[0] || { accountId: 'ACC-1001', unifiedScore: 0, classification: 'LOW', cyberRisk: 0, transactionRisk: 0, networkRisk: 0, timestamp: Date.now() }
  )

  // Simplified network - only connected to user
  const userNode = state.network.nodes.find(n => n.id === highestRisk.accountId)
  const connectedLinks = state.network.links.filter(l => l.source === highestRisk.accountId || l.target === highestRisk.accountId)
  const connectedIds = connectedLinks.map(l => l.source === highestRisk.accountId ? l.target : l.source)
  const connectedNodes = state.network.nodes.filter(n => connectedIds.includes(n.id))

  return NextResponse.json({
    accountId: highestRisk.accountId,
    riskScore: highestRisk,
    alerts: state.alerts.filter(a => a.accountId === highestRisk.accountId).slice(0, 10),
    containment: state.containment,
    financialExposure: state.financialExposure,
    geminiUserExplanation: state.geminiUserExplanation,
    network: {
      nodes: [userNode, ...connectedNodes].filter(Boolean),
      links: connectedLinks,
    },
    recentEvents: state.events.filter(e => e.accountId === highestRisk.accountId).slice(0, 5),
  })
}
