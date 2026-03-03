'use client'

import type { GeminiUserExplanation } from '@/lib/types'
import { ShieldCheck, Loader2 } from 'lucide-react'

interface AISafetySummaryProps {
  explanation: GeminiUserExplanation | null
  loading?: boolean
}

export function AISafetySummary({ explanation, loading }: AISafetySummaryProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-neon-blue/20 bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-neon-blue" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
            AI Safety Summary
          </h3>
        </div>
        <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-neon-blue" />
          <span className="text-sm">Preparing your safety summary...</span>
        </div>
      </div>
    )
  }

  if (!explanation) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
            AI Safety Summary
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">Your safety summary will appear here once we have enough data to analyze.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neon-blue/20 bg-card p-5 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck className="w-5 h-5 text-neon-blue" />
        <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
          AI Safety Summary
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        <div className="p-4 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
          <p className="text-sm text-foreground leading-relaxed">{explanation.summary}</p>
        </div>

        <div>
          <h4 className="text-xs font-mono font-semibold text-neon-blue mb-2 uppercase tracking-wider">What Happened</h4>
          <p className="text-sm text-foreground/85 leading-relaxed">{explanation.whatHappened}</p>
        </div>

        <div>
          <h4 className="text-xs font-mono font-semibold text-chart-5 mb-2 uppercase tracking-wider">Actions Taken</h4>
          <p className="text-sm text-foreground/85 leading-relaxed">{explanation.actionsTaken}</p>
        </div>

        <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/10">
          <h4 className="text-xs font-mono font-semibold text-chart-5 mb-2 uppercase tracking-wider">Safety Tips</h4>
          <p className="text-sm text-foreground/85 leading-relaxed">{explanation.safetyAdvice}</p>
        </div>
      </div>
    </div>
  )
}
