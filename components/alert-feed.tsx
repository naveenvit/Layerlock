'use client'

import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/types'
import { AlertTriangle, ShieldAlert, Network, Wifi } from 'lucide-react'

interface AlertFeedProps {
  alerts: Alert[]
  maxItems?: number
}

const iconMap = {
  containment: ShieldAlert,
  risk_escalation: AlertTriangle,
  network_detection: Network,
  cyber_threat: Wifi,
}

const severityStyles = {
  critical: 'border-risk-high/30 bg-risk-high/5',
  warning: 'border-risk-medium/30 bg-risk-medium/5',
  info: 'border-neon-blue/30 bg-neon-blue/5',
}

const severityDot = {
  critical: 'bg-risk-high',
  warning: 'bg-risk-medium',
  info: 'bg-neon-blue',
}

export function AlertFeed({ alerts, maxItems = 10 }: AlertFeedProps) {
  const displayed = alerts.slice(0, maxItems)

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <ShieldAlert className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-sm font-mono">No active alerts</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
      {displayed.map((alert) => {
        const Icon = iconMap[alert.type] || AlertTriangle
        const timeStr = new Date(alert.timestamp).toLocaleTimeString()

        return (
          <div
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border transition-all duration-300',
              severityStyles[alert.severity]
            )}
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('w-2 h-2 rounded-full animate-pulse', severityDot[alert.severity])} />
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{alert.message}</p>
              <span className="text-xs text-muted-foreground font-mono">{timeStr}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
