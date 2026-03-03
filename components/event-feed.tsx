'use client'

import { cn } from '@/lib/utils'
import type { CyberEvent, TransactionEvent } from '@/lib/types'
import { Wifi, CreditCard, Globe, Fingerprint, AlertTriangle } from 'lucide-react'

interface EventFeedProps {
  cyberEvents: CyberEvent[]
  transactionEvents: TransactionEvent[]
  maxItems?: number
}

const cyberIcons: Record<string, typeof Wifi> = {
  login_anomaly: Fingerprint,
  high_risk_ip: Globe,
  device_mismatch: AlertTriangle,
  brute_force: AlertTriangle,
  session_hijack: Wifi,
}

const severityColors: Record<string, string> = {
  low: 'text-chart-5',
  medium: 'text-risk-medium',
  high: 'text-risk-high',
  critical: 'text-risk-high',
}

export function EventFeed({ cyberEvents, transactionEvents, maxItems = 15 }: EventFeedProps) {
  // Interleave events by timestamp
  const allEvents = [
    ...cyberEvents.map(e => ({ ...e, eventKind: 'cyber' as const })),
    ...transactionEvents.map(e => ({ ...e, eventKind: 'transaction' as const })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxItems)

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[400px] pr-1">
      {allEvents.map((event) => {
        const isCyber = event.eventKind === 'cyber'
        const time = new Date(event.timestamp).toLocaleTimeString()

        if (isCyber) {
          const cyber = event as CyberEvent & { eventKind: 'cyber' }
          const Icon = cyberIcons[cyber.type] || Wifi
          return (
            <div key={cyber.id} className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', severityColors[cyber.severity])} />
              <div className="flex flex-col min-w-0">
                <p className="text-xs text-foreground leading-snug truncate">{cyber.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neon-blue">CYBER</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{cyber.accountId}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{time}</span>
                </div>
              </div>
            </div>
          )
        } else {
          const tx = event as TransactionEvent & { eventKind: 'transaction' }
          return (
            <div key={tx.id} className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-risk-medium" />
              <div className="flex flex-col min-w-0">
                <p className="text-xs text-foreground leading-snug truncate">{tx.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-risk-medium">TXN</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{tx.accountId}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{time}</span>
                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}
