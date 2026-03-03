'use client'

import { useState, useEffect, useCallback } from 'react'
import { RiskMeter } from '@/components/risk-meter'
import { AlertFeed } from '@/components/alert-feed'
import { ContainmentPanel } from '@/components/containment-panel'
import { FinancialExposurePanel } from '@/components/financial-exposure-panel'
import { AIAnalysisPanel } from '@/components/ai-analysis-panel'
import { NetworkGraph } from '@/components/network-graph'
import { EventFeed } from '@/components/event-feed'
import { ArrowLeft, Activity, RefreshCw } from 'lucide-react'
import type { RiskScore, Alert, ContainmentStatus, FinancialExposure, GeminiAnalysis, NetworkGraph as NetworkGraphType, CyberEvent, TransactionEvent, UnifiedEvent } from '@/lib/types'

interface BankDashboardData {
  riskScores: RiskScore[]
  alerts: Alert[]
  containment: ContainmentStatus
  financialExposure: FinancialExposure
  geminiAnalysis: GeminiAnalysis | null
  network: NetworkGraphType
  cyberEvents: CyberEvent[]
  transactionEvents: TransactionEvent[]
  events: UnifiedEvent[]
}

interface BankDashboardProps {
  onBack: () => void
}

export function BankDashboard({ onBack }: BankDashboardProps) {
  const [data, setData] = useState<BankDashboardData | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [tickCount, setTickCount] = useState(0)

  const fetchDashboard = useCallback(async () => {
    try {
      await fetch('/api/simulate')
      const res = await fetch('/api/bank/dashboard')
      if (res.ok) {
        const dashData = await res.json()
        setData(dashData)
        setTickCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }, [])

  const triggerAI = useCallback(async () => {
    if (!data) return
    setAiLoading(true)
    try {
      const highestRisk = data.riskScores.reduce((max, rs) =>
        rs.unifiedScore > max.unifiedScore ? rs : max,
        data.riskScores[0]
      )
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'bank',
          cyberSignals: data.cyberEvents.slice(0, 5),
          transactionData: data.transactionEvents.slice(0, 5),
          networkConnections: {
            suspicious: data.network.links.filter(l => l.suspicious).length,
            total: data.network.links.length,
          },
          riskScore: highestRisk?.unifiedScore || 0,
        }),
      })
      if (res.ok) {
        const analysis = await res.json()
        setData(prev => prev ? { ...prev, geminiAnalysis: analysis } : null)
      }
    } catch (err) {
      console.error('AI analysis error:', err)
    } finally {
      setAiLoading(false)
    }
  }, [data])

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 5000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  // Trigger AI every 3 ticks (15 seconds)
  useEffect(() => {
    if (tickCount > 0 && tickCount % 3 === 0) {
      triggerAI()
    }
  }, [tickCount, triggerAI])

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-neon-blue">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-mono text-lg">Initializing Bank Intelligence...</span>
        </div>
      </div>
    )
  }

  const highestRisk = data.riskScores.reduce((max, rs) =>
    rs.unifiedScore > max.unifiedScore ? rs : max,
    data.riskScores[0]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-mono">Exit</span>
            </button>
            <div className="h-5 w-px bg-border" />
            <h1 className="text-lg font-bold text-foreground">
              Layer<span className="text-neon-blue">Lock</span>
              <span className="text-sm font-normal text-muted-foreground ml-3">Bank Mode</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-chart-5 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">LIVE</span>
            </div>
            <button
              onClick={triggerAI}
              disabled={aiLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-lg hover:bg-neon-blue/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {aiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
              Run AI Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Risk & Containment */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-4">
              <RiskMeter score={highestRisk?.unifiedScore || 0} size="lg" label="Unified Risk" />
              <div className="w-full grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">Cyber</span>
                  <span className="text-sm font-bold font-mono text-neon-blue">{highestRisk?.cyberRisk || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">TXN</span>
                  <span className="text-sm font-bold font-mono text-risk-medium">{highestRisk?.transactionRisk || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">Network</span>
                  <span className="text-sm font-bold font-mono text-risk-high">{highestRisk?.networkRisk || 0}</span>
                </div>
              </div>
            </div>

            <ContainmentPanel containment={data.containment} />
            <FinancialExposurePanel exposure={data.financialExposure} />

            {/* All account risk scores */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground mb-3">
                Account Risk Overview
              </h3>
              <div className="flex flex-col gap-2">
                {data.riskScores
                  .sort((a, b) => b.unifiedScore - a.unifiedScore)
                  .map(rs => (
                    <div key={rs.accountId} className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">{rs.accountId}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${rs.unifiedScore}%`,
                              backgroundColor: rs.unifiedScore >= 75 ? '#EF4444' : rs.unifiedScore >= 50 ? '#F59E0B' : rs.unifiedScore >= 25 ? '#00D4FF' : '#10B981',
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold w-6 text-right text-foreground">{rs.unifiedScore}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Center Column - Network + Events */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <NetworkGraph network={data.network} />

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground mb-3">
                Live Event Feed
              </h3>
              <EventFeed cyberEvents={data.cyberEvents} transactionEvents={data.transactionEvents} />
            </div>
          </div>

          {/* Right Column - Alerts + AI */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <AIAnalysisPanel analysis={data.geminiAnalysis} loading={aiLoading} />

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground mb-3">
                Alert Feed
              </h3>
              <AlertFeed alerts={data.alerts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
