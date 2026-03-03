'use client'

import { cn } from '@/lib/utils'

interface RiskMeterProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showClassification?: boolean
}

function getClassification(score: number) {
  if (score >= 75) return { label: 'CRITICAL', color: 'text-risk-high' }
  if (score >= 50) return { label: 'HIGH', color: 'text-risk-medium' }
  if (score >= 25) return { label: 'MEDIUM', color: 'text-neon-blue' }
  return { label: 'LOW', color: 'text-chart-5' }
}

function getStrokeColor(score: number) {
  if (score >= 75) return '#EF4444'
  if (score >= 50) return '#F59E0B'
  if (score >= 25) return '#00D4FF'
  return '#10B981'
}

export function RiskMeter({ score, size = 'md', label, showClassification = true }: RiskMeterProps) {
  const classification = getClassification(score)
  const strokeColor = getStrokeColor(score)

  const sizes = {
    sm: { svgSize: 100, stroke: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { svgSize: 160, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { svgSize: 200, stroke: 12, fontSize: 'text-4xl', labelSize: 'text-base' },
  }

  const { svgSize, stroke, fontSize, labelSize } = sizes[size]
  const radius = (svgSize - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const dashOffset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className={cn('text-muted-foreground font-mono uppercase tracking-wider', labelSize)}>{label}</span>}
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: score >= 75 ? `drop-shadow(0 0 8px ${strokeColor})` : undefined,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold font-mono tabular-nums', fontSize)} style={{ color: strokeColor }}>
            {score}
          </span>
        </div>
      </div>
      {showClassification && (
        <span className={cn('font-mono text-xs font-semibold tracking-widest', classification.color)}>
          {classification.label}
        </span>
      )}
    </div>
  )
}
