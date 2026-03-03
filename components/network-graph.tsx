'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { NetworkGraph as NetworkGraphType } from '@/lib/types'

interface NetworkGraphProps {
  network: NetworkGraphType
  compact?: boolean
}

interface NodePosition {
  x: number
  y: number
  vx: number
  vy: number
  id: string
  label: string
  risk: number
  type: string
}

function getNodeColor(risk: number) {
  if (risk >= 70) return '#EF4444'
  if (risk >= 40) return '#F59E0B'
  return '#3B82F6'
}

function getNodeGlow(risk: number) {
  if (risk >= 70) return 'rgba(239, 68, 68, 0.4)'
  if (risk >= 40) return 'rgba(245, 158, 11, 0.3)'
  return 'rgba(59, 130, 246, 0.2)'
}

export function NetworkGraph({ network, compact = false }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const positionsRef = useRef<NodePosition[]>([])
  const animRef = useRef<number>(0)

  const initPositions = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2
    const radius = Math.min(w, h) * 0.35

    positionsRef.current = network.nodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / network.nodes.length - Math.PI / 2
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        id: node.id,
        label: node.label,
        risk: node.risk,
        type: node.type,
      }
    })
  }, [network.nodes])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const positions = positionsRef.current
    const nodeMap = new Map(positions.map(p => [p.id, p]))

    // Draw links
    for (const link of network.links) {
      const source = nodeMap.get(link.source)
      const target = nodeMap.get(link.target)
      if (!source || !target) continue

      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)
      ctx.strokeStyle = link.suspicious ? 'rgba(239, 68, 68, 0.5)' : 'rgba(30, 48, 80, 0.6)'
      ctx.lineWidth = link.suspicious ? 2 : 1
      if (link.suspicious) {
        ctx.setLineDash([6, 4])
      } else {
        ctx.setLineDash([])
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Amount label
      if (!compact) {
        const mx = (source.x + target.x) / 2
        const my = (source.y + target.y) / 2
        ctx.font = '10px monospace'
        ctx.fillStyle = 'rgba(100, 116, 139, 0.7)'
        ctx.textAlign = 'center'
        ctx.fillText(`$${(link.amount / 1000).toFixed(0)}K`, mx, my - 5)
      }
    }

    // Draw nodes
    const nodeRadius = compact ? 16 : 22
    for (const pos of positions) {
      const color = getNodeColor(pos.risk)
      const glow = getNodeGlow(pos.risk)

      // Glow
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius + 8, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Node
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#0F1A2E'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Risk number
      ctx.font = `bold ${compact ? 10 : 12}px monospace`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(pos.risk), pos.x, pos.y)

      // Label
      ctx.font = `${compact ? 9 : 11}px monospace`
      ctx.fillStyle = '#94A3B8'
      ctx.fillText(pos.label, pos.x, pos.y + nodeRadius + 14)
    }

    // Force simulation step (subtle drift)
    for (let i = 0; i < positions.length; i++) {
      positions[i].x += (Math.random() - 0.5) * 0.3
      positions[i].y += (Math.random() - 0.5) * 0.3
    }

    animRef.current = requestAnimationFrame(draw)
  }, [network.links, compact])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = parent.clientWidth * dpr
      canvas.height = (compact ? 300 : 500) * dpr
      canvas.style.width = `${parent.clientWidth}px`
      canvas.style.height = `${compact ? 300 : 500}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
      // Reset canvas dimensions for drawing (logical pixels)
      canvas.width = parent.clientWidth
      canvas.height = compact ? 300 : 500
      initPositions()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animRef.current)
    }
  }, [draw, initPositions, compact])

  // Update positions when network data changes
  useEffect(() => {
    for (const node of network.nodes) {
      const pos = positionsRef.current.find(p => p.id === node.id)
      if (pos) {
        pos.risk = node.risk
        pos.type = node.type
      }
    }
  }, [network.nodes])

  return (
    <div className="w-full rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-foreground">
          Network Intelligence
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-high" />
            <span className="text-xs text-muted-foreground font-mono">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-medium" />
            <span className="text-xs text-muted-foreground font-mono">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
            <span className="text-xs text-muted-foreground font-mono">Low</span>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full" />
    </div>
  )
}
