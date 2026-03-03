'use client'

import type { FinancialExposure } from '@/lib/types'
import { DollarSign, ShieldCheck, BarChart3, Clock } from 'lucide-react'

interface FinancialExposurePanelProps {
  exposure: FinancialExposure
}

function formatCurrency(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toLocaleString()}`
}

export function FinancialExposurePanel({ exposure }: FinancialExposurePanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground mb-4">
        Financial Exposure
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-mono">Funds at Risk</span>
          </div>
          <span className="text-lg font-bold font-mono text-risk-high">
            {formatCurrency(exposure.fundsAtRisk)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-mono">Loss Prevented</span>
          </div>
          <span className="text-lg font-bold font-mono text-chart-5">
            {formatCurrency(exposure.estimatedLossPrevented)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-mono">Recovery Prob.</span>
          </div>
          <span className="text-lg font-bold font-mono text-neon-blue">
            {(exposure.recoveryProbability * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono">Response Time</span>
          </div>
          <span className="text-lg font-bold font-mono text-foreground">
            {exposure.containmentResponseTime}ms
          </span>
        </div>
      </div>
    </div>
  )
}
