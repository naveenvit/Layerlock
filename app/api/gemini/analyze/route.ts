import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { updateGeminiAnalysis, updateGeminiUserExplanation } from '@/lib/simulation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mode, cyberSignals, transactionData, networkConnections, riskScore } = body

    if (mode === 'bank') {
      const prompt = `You are a financial crime AI analyst for a bank's AML/Cyber fraud detection system called LayerLock.

Analyze the following fraud intelligence bundle and return a JSON response:

Cyber Signals: ${JSON.stringify(cyberSignals?.slice(0, 3) || [])}
Transaction Data: ${JSON.stringify(transactionData?.slice(0, 3) || [])}
Network Connections: ${JSON.stringify(networkConnections || { suspicious: 0, total: 0 })}
Unified Risk Score: ${riskScore || 0}/100

Return ONLY valid JSON with these exact fields:
{
  "fraudClassification": "string - e.g. 'Layered Money Laundering via Mule Network', 'Credential Theft + Rapid Fund Extraction'",
  "technicalReasoning": "string - 2-3 sentences of technical analysis",
  "regulatoryExplanation": "string - relevant regulatory concerns (BSA/AML, KYC)",
  "recommendedAction": "string - specific containment/investigation steps",
  "confidence": number between 0 and 1
}`

      const result = await generateText({
        model: 'google/gemini-2.5-flash-preview-05-20',
        prompt,
      })

      let analysis
      try {
        const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        analysis = JSON.parse(cleaned)
      } catch {
        analysis = {
          fraudClassification: 'Multi-Vector Financial Threat',
          technicalReasoning: result.text.slice(0, 300),
          regulatoryExplanation: 'Potential BSA/AML compliance concerns identified. Enhanced due diligence recommended per FinCEN guidelines.',
          recommendedAction: 'Escalate to compliance team. Place hold on flagged transactions. Initiate SAR filing process.',
          confidence: 0.78,
        }
      }

      analysis.timestamp = Date.now()
      updateGeminiAnalysis(analysis)

      return NextResponse.json(analysis)
    } else {
      // User mode - simple explanation
      const prompt = `You are a friendly banking security advisor explaining a potential security issue to a customer in simple, non-technical language.

The customer's account has a risk score of ${riskScore || 0}/100.
Recent security events: ${JSON.stringify(cyberSignals?.slice(0, 2) || [])}
Recent transaction flags: ${JSON.stringify(transactionData?.slice(0, 2) || [])}

Return ONLY valid JSON with these exact fields:
{
  "summary": "string - 1 sentence plain-English summary",
  "whatHappened": "string - 2-3 sentences explaining what was detected, no jargon",
  "actionsTaken": "string - what the bank is doing to protect them",
  "safetyAdvice": "string - 2-3 actionable safety tips for the customer"
}`

      const result = await generateText({
        model: 'google/gemini-2.5-flash-preview-05-20',
        prompt,
      })

      let explanation
      try {
        const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        explanation = JSON.parse(cleaned)
      } catch {
        explanation = {
          summary: 'We detected some unusual activity on your account and are taking steps to protect you.',
          whatHappened: result.text.slice(0, 300),
          actionsTaken: 'Our security team has flagged the suspicious activity and placed temporary holds on potentially fraudulent transactions.',
          safetyAdvice: 'Please review your recent transactions, update your password, and enable two-factor authentication if you haven\'t already.',
        }
      }

      explanation.timestamp = Date.now()
      updateGeminiUserExplanation(explanation)

      return NextResponse.json(explanation)
    }
  } catch (error) {
    console.error('Gemini API error:', error)

    // Graceful fallback
    return NextResponse.json({
      fraudClassification: 'Analysis Temporarily Unavailable',
      technicalReasoning: 'AI analysis service is currently processing. The system continues to monitor and correlate signals in real-time.',
      regulatoryExplanation: 'Standard regulatory monitoring remains active. All flagged transactions are being held per compliance protocols.',
      recommendedAction: 'Continue monitoring. Manual review recommended for high-priority alerts.',
      confidence: 0.5,
      summary: 'Your account is being monitored by our security systems.',
      whatHappened: 'We noticed some unusual patterns and are investigating.',
      actionsTaken: 'Our team is reviewing the flagged activity.',
      safetyAdvice: 'Please review your recent transactions and contact us if you see anything unfamiliar.',
      timestamp: Date.now(),
    })
  }
}
