'use client'

import type { AppMode } from '@/lib/types'
import { Shield, Building2, User, Lock, Layers } from 'lucide-react'

interface LandingScreenProps {
  onSelectMode: (mode: AppMode) => void
}

export function LandingScreen({ onSelectMode }: LandingScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-blue/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-14 h-14 text-neon-blue" />
              <Lock className="w-6 h-6 text-neon-blue absolute bottom-0 right-0" />
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-8 h-8 text-neon-blue opacity-60" />
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-foreground text-balance text-center">
            Layer<span className="text-neon-blue">Lock</span>
          </h1>
          <p className="text-lg text-muted-foreground font-mono tracking-wide text-center">
            Stopping Money Laundering Before It Layers
          </p>
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => onSelectMode('bank')}
            className="group relative flex items-center gap-4 px-10 py-6 rounded-xl border border-border bg-card hover:bg-secondary transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] cursor-pointer"
          >
            <Building2 className="w-8 h-8 text-neon-blue group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold text-foreground">Enter Bank Mode</span>
              <span className="text-sm text-muted-foreground">Full analytics dashboard</span>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('user')}
            className="group relative flex items-center gap-4 px-10 py-6 rounded-xl border border-border bg-card hover:bg-secondary transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] cursor-pointer"
          >
            <User className="w-8 h-8 text-neon-blue group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold text-foreground">Enter User Mode</span>
              <span className="text-sm text-muted-foreground">Personal account view</span>
            </div>
          </button>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap justify-center gap-3 max-w-lg">
          {['Real-Time Correlation', 'Unified Risk Scoring', 'AI-Powered Analysis', 'Network Detection', 'Early Containment'].map(
            (feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-xs font-mono text-neon-blue/80 border border-neon-blue/20 rounded-full bg-neon-blue/5"
              >
                {feature}
              </span>
            )
          )}
        </div>
      </div>
    </main>
  )
}
