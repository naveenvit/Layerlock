'use client'

import { cn } from '@/lib/utils'
import type { GeminiAnalysis } from '@/lib/types'
import { Brain, Loader2 } from 'lucide-react'

interface AIAnalysisPanelProps {
  analysis: GeminiAnalysis | null
  loading?: boolean
}

export function AIAnalysisPanel({ analysis, loading }: AIAnalysisPanelProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-neon-blue/20 bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-neon-blue" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
            AI Intelligence Panel
          </h3>
        </div>
        <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-neon-blue" />
          <span className="text-sm font-mono">Analyzing threat signals...</span>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
            AI Intelligence Panel
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">Awaiting sufficient data for analysis...</p>
      </div>
    )
  }

  const confidenceColor = analysis.confidence > 0.7 ? 'text-risk-high' : analysis.confidence > 0.5 ? 'text-risk-medium' : 'text-neon-blue'

  return (
    <div className="rounded-xl border border-neon-blue/20 bg-card p-5 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-neon-blue" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
            AI Intelligence Panel
          </h3>
        </div>
        <span className={cn('text-xs font-mono font-semibold', confidenceColor)}>
          {(analysis.confidence * 100).toFixed(0)}% CONF
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Classification</span>
          <p className="text-sm font-semibold text-risk-high mt-1">{analysis.fraudClassification}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Technical Reasoning</span>
          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{analysis.technicalReasoning}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Regulatory</span>
          <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{analysis.regulatoryExplanation}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Recommended Action</span>
          <p className="text-sm text-neon-blue mt-1 leading-relaxed">{analysis.recommendedAction}</p>
        </div>
      </div>
    </div>
  )
}
