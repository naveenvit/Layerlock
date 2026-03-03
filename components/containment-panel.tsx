'use client'

import { cn } from '@/lib/utils'
import type { ContainmentStatus } from '@/lib/types'
import { ShieldCheck, ShieldOff, Lock } from 'lucide-react'

interface ContainmentPanelProps {
  containment: ContainmentStatus
}

export function ContainmentPanel({ containment }: ContainmentPanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-500',
        containment.active
          ? 'border-risk-high/40 bg-risk-high/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {containment.active ? (
          <ShieldCheck className="w-5 h-5 text-risk-high" />
        ) : (
          <ShieldOff className="w-5 h-5 text-muted-foreground" />
        )}
        <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
          Containment Status
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span
            className={cn(
              'text-sm font-mono font-semibold',
              containment.active ? 'text-risk-high' : 'text-chart-5'
            )}
          >
            {containment.active ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Transactions Held</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {containment.transactionsHeld}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Accounts Frozen</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {containment.accountsFrozen.length}
          </span>
        </div>

        {containment.accountsFrozen.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {containment.accountsFrozen.map((acc) => (
              <span
                key={acc}
                className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-risk-high/10 text-risk-high border border-risk-high/20 rounded"
              >
                <Lock className="w-3 h-3" />
                {acc}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
