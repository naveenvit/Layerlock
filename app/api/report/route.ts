import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { getState } from '@/lib/simulation'

export async function GET() {
  try {
    const state = getState()

    const highestRisk = state.riskScores.reduce((max, rs) =>
      rs.unifiedScore > max.unifiedScore ? rs : max,
      state.riskScores[0]
    )

    const accountEvents = state.events.filter(e => e.accountId === highestRisk?.accountId).slice(0, 3)
    const accountAlerts = state.alerts.filter(a => a.accountId === highestRisk?.accountId).slice(0, 5)

    const prompt = `Generate a professional incident report narrative for a Suspicious Activity Report (SAR). 

Account: ${highestRisk?.accountId || 'ACC-1001'}
Risk Score: ${highestRisk?.unifiedScore || 0}/100
Classification: ${highestRisk?.classification || 'LOW'}
Number of correlated events: ${accountEvents.length}
Active alerts: ${accountAlerts.length}
Containment status: ${state.containment.active ? 'ACTIVE' : 'INACTIVE'}
Funds at risk: $${state.financialExposure.fundsAtRisk.toLocaleString()}
Estimated loss prevented: $${state.financialExposure.estimatedLossPrevented.toLocaleString()}

Return ONLY valid JSON:
{
  "title": "string - report title",
  "incidentSummary": "string - 3-4 sentence executive summary",
  "riskExplanation": "string - detailed risk breakdown",
  "actionsTaken": "string - containment and response actions",
  "networkSummary": "string - network/mule detection findings",
  "recommendations": "string - next steps and recommendations"
}`

    const result = await generateText({
      model: 'google/gemini-2.5-flash-preview-05-20',
      prompt,
    })

    let report
    try {
      const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      report = JSON.parse(cleaned)
    } catch {
      report = {
        title: `Incident Report - ${highestRisk?.accountId || 'ACC-1001'}`,
        incidentSummary: 'Automated fraud detection systems identified correlated cyber and transaction anomalies requiring investigation.',
        riskExplanation: `Unified risk score of ${highestRisk?.unifiedScore || 0}/100 based on cyber signal correlation, transaction pattern analysis, and network exposure assessment.`,
        actionsTaken: 'Suspicious transactions placed on hold. Enhanced monitoring activated. Compliance team notified.',
        networkSummary: 'Network analysis identified potential mule account connections. Risk propagation detected across linked accounts.',
        recommendations: 'File SAR within 30 days. Continue enhanced monitoring. Coordinate with law enforcement if score exceeds 85.',
      }
    }

    report.generatedAt = new Date().toISOString()
    report.accountId = highestRisk?.accountId || 'ACC-1001'
    report.riskScore = highestRisk?.unifiedScore || 0

    return NextResponse.json(report)
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({
      title: 'Incident Report',
      incidentSummary: 'Report generation is temporarily unavailable. Please try again.',
      riskExplanation: 'Risk data available in dashboard.',
      actionsTaken: 'Standard monitoring protocols active.',
      networkSummary: 'Network data available in dashboard.',
      recommendations: 'Review dashboard for current status.',
      generatedAt: new Date().toISOString(),
    })
  }
}
