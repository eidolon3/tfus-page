import { useRef, useEffect, useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────────────────
interface NeuronNode {
  x: number
  y: number
  label: string
  path: string
  somaRadius: number
  dendrites: Dendrite[]
  hovered: boolean
  pulsePhase: number
}

interface Dendrite {
  angle: number
  length: number
  branches: DendriteBranch[]
  thickness: number
  // Precomputed curve offsets so they don't jitter
  curveOffsetX: number
  curveOffsetY: number
}

interface DendriteBranch {
  angle: number
  length: number
  thickness: number
}

interface Axon {
  from: number
  to: number
  controlPoints: { x: number; y: number }[]
  pulse: AxonPulse
}

interface AxonPulse {
  progress: number // 0-1, head of the AP
  speed: number
  cooldown: number // time until next fire
  active: boolean
}

interface NeuronNetworkProps {
  width: number
  height: number
  onNodeClick: (path: string) => void
  onNodeHover: (index: number | null) => void
}

// ─── Neuron generation helpers ─────────────────────────────────────
function generateDendrites(count: number, baseAngle: number): Dendrite[] {
  const dendrites: Dendrite[] = []
  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * Math.PI * 1.5
    const length = 30 + Math.random() * 50
    const branches: DendriteBranch[] = []

    const branchCount = 1 + Math.floor(Math.random() * 3)
    for (let j = 0; j < branchCount; j++) {
      branches.push({
        angle: angle + (Math.random() - 0.5) * 1.2,
        length: 15 + Math.random() * 25,
        thickness: 0.5 + Math.random() * 0.8,
      })
    }

    dendrites.push({
      angle,
      length,
      branches,
      thickness: 1.2 + Math.random() * 1.2,
      // Precompute curve offset — fixed per dendrite, no jitter
      curveOffsetX: (Math.random() - 0.5) * 10,
      curveOffsetY: (Math.random() - 0.5) * 10,
    })
  }
  return dendrites
}

function generateAxonPath(
  from: NeuronNode,
  to: NeuronNode,
): { x: number; y: number }[] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const perpX = -dy / dist
  const perpY = dx / dist
  const offset = (Math.random() - 0.5) * dist * 0.4

  return [
    {
      x: midX + perpX * offset + (Math.random() - 0.5) * 40,
      y: midY + perpY * offset + (Math.random() - 0.5) * 40,
    },
    {
      x: midX - perpX * offset * 0.3 + (Math.random() - 0.5) * 30,
      y: midY - perpY * offset * 0.3 + (Math.random() - 0.5) * 30,
    },
  ]
}

// ─── Bezier helpers ─────────────────────────────────────────────────
function cubicBezier(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  }
}

// ─── AP waveform shape ──────────────────────────────────────────────
// Returns intensity (0-1) for a point relative to the AP head position.
// offset: how far behind the head (0 = at head, positive = trailing)
// Models: resting → sharp depolarization spike → repolarization dip → recovery
function apWaveform(offset: number): number {
  if (offset < 0) return 0 // ahead of the spike
  if (offset < 0.015) {
    // Sharp rising phase (depolarization)
    return offset / 0.015
  }
  if (offset < 0.03) {
    // Peak and start of falling phase
    return 1.0 - (offset - 0.015) / 0.015 * 0.4
  }
  if (offset < 0.08) {
    // Repolarization (falling below baseline = hyperpolarization)
    const t = (offset - 0.03) / 0.05
    return 0.6 * (1 - t) - 0.15 * Math.sin(t * Math.PI)
  }
  if (offset < 0.14) {
    // Recovery to baseline
    const t = (offset - 0.08) / 0.06
    return -0.15 * (1 - t) * Math.sin((1 - t) * Math.PI * 0.5)
  }
  return 0
}

// ─── Component ──────────────────────────────────────────────────────
export default function NeuronNetwork({ width, height, onNodeClick, onNodeHover }: NeuronNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<NeuronNode[]>([])
  const axonsRef = useRef<Axon[]>([])
  const animFrameRef = useRef(0)
  const initializedRef = useRef(false)

  const initialize = useCallback(() => {
    if (width === 0 || height === 0) return

    const positions = [
      { x: width * 0.24, y: height * 0.33 },
      { x: width * 0.72, y: height * 0.26 },
      { x: width * 0.32, y: height * 0.67 },
      { x: width * 0.74, y: height * 0.64 },
    ]

    const categories = [
      { label: 'Foundations',    path: '/papers'        },
      { label: 'Studies',       path: '/studies'       },
      { label: 'Trials',        path: '/trials'        },
      { label: 'Industry',      path: '/industry'      },
    ]

    nodesRef.current = positions.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      label: categories[i].label,
      path: categories[i].path,
      somaRadius: 22 + Math.random() * 6,
      dendrites: generateDendrites(5 + Math.floor(Math.random() * 4), Math.random() * Math.PI * 2),
      hovered: false,
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    const connections: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [0, 2], [1, 3], [0, 3],
    ]

    axonsRef.current = connections.map(([from, to]) => ({
      from,
      to,
      controlPoints: generateAxonPath(nodesRef.current[from], nodesRef.current[to]),
      pulse: {
        progress: -1,
        speed: 0.8 + Math.random() * 0.4,
        cooldown: 2 + Math.random() * 5,
        active: false,
      },
    }))

    initializedRef.current = true
  }, [width, height])

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      let foundHover = false
      nodesRef.current.forEach((node, i) => {
        const dx = mx - node.x
        const dy = my - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const wasHovered = node.hovered
        node.hovered = dist < node.somaRadius + 15

        if (node.hovered) {
          foundHover = true
          canvas.style.cursor = 'pointer'
          if (!wasHovered) onNodeHover(i)
        }
      })

      if (!foundHover) {
        canvas.style.cursor = 'default'
        if (nodesRef.current.some(n => !n.hovered)) {
          onNodeHover(null)
        }
      }
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      nodesRef.current.forEach((node) => {
        const dx = mx - node.x
        const dy = my - node.y
        if (Math.sqrt(dx * dx + dy * dy) < node.somaRadius + 15) {
          onNodeClick(node.path)
        }
      })
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)

    let lastTime = performance.now()

    const animate = () => {
      if (!initializedRef.current) {
        animFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now
      const time = now / 1000

      ctx.clearRect(0, 0, width, height)

      // ─── Draw axon connections ──────────────────────
      axonsRef.current.forEach((axon) => {
        const fromNode = nodesRef.current[axon.from]
        const toNode = nodesRef.current[axon.to]
        const cp = axon.controlPoints

        const isActiveAxon = fromNode.hovered || toNode.hovered
        const baseAlpha = isActiveAxon ? 0.35 : 0.12

        // Axon line
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.bezierCurveTo(cp[0].x, cp[0].y, cp[1].x, cp[1].y, toNode.x, toNode.y)
        ctx.strokeStyle = `rgba(90, 50, 140, ${baseAlpha})`
        ctx.lineWidth = isActiveAxon ? 5 : 3.5
        ctx.stroke()

        // Myelin sheath (dashed overlay)
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.bezierCurveTo(cp[0].x, cp[0].y, cp[1].x, cp[1].y, toNode.x, toNode.y)
        ctx.setLineDash([8, 12])
        ctx.strokeStyle = `rgba(120, 70, 180, ${baseAlpha * 0.6})`
        ctx.lineWidth = isActiveAxon ? 7.5 : 5.5
        ctx.lineDashOffset = -time * 15
        ctx.stroke()
        ctx.setLineDash([])

        // Nodes of Ranvier
        for (let t = 0.15; t < 0.9; t += 0.2) {
          const pt = cubicBezier(t, fromNode, cp[0], cp[1], toNode)
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, isActiveAxon ? 3 : 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(90, 50, 140, ${baseAlpha * 1.5})`
          ctx.fill()
        }

        // ─── Action Potential propagation ──────────────
        const pulse = axon.pulse

        // Manage AP lifecycle
        if (!pulse.active) {
          pulse.cooldown -= dt
          if (pulse.cooldown <= 0) {
            pulse.active = true
            pulse.progress = 0
          }
        }

        if (pulse.active) {
          pulse.progress += pulse.speed * dt

          // Draw the AP waveform along the axon
          // Sample points along the curve and color them by waveform intensity
          const apHead = pulse.progress
          const sampleCount = 60
          const trailLength = 0.18 // how much of the curve the AP waveform spans

          for (let s = 0; s < sampleCount; s++) {
            const t = apHead - (s / sampleCount) * trailLength
            if (t < 0 || t > 1) continue

            const offset = (s / sampleCount) * trailLength
            const intensity = apWaveform(offset)
            if (Math.abs(intensity) < 0.01) continue

            const pt = cubicBezier(t, fromNode, cp[0], cp[1], toNode)

            // Positive = depolarization (cyan), negative = hyperpolarization (dim purple)
            if (intensity > 0) {
              const size = 3 + intensity * 6
              const alpha = intensity * (isActiveAxon ? 0.9 : 0.6)

              // Glow
              const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, size * 2.5)
              grd.addColorStop(0, `rgba(200, 120, 255, ${alpha * 0.5})`)
              grd.addColorStop(0.5, `rgba(150, 70, 210, ${alpha * 0.2})`)
              grd.addColorStop(1, 'rgba(120, 40, 180, 0)')
              ctx.fillStyle = grd
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, size * 2.5, 0, Math.PI * 2)
              ctx.fill()

              // Core dot
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, size * 0.4, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(230, 180, 255, ${alpha})`
              ctx.fill()
            } else {
              // Hyperpolarization — subtle dark dip
              const absI = Math.abs(intensity)
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(40, 10, 60, ${absI * 0.5})`
              ctx.fill()
            }
          }

          // AP is done when it's fully past the end
          if (pulse.progress > 1 + trailLength) {
            pulse.active = false
            pulse.progress = -1
            pulse.cooldown = 3 + Math.random() * 6
          }
        }
      })

      // ─── Draw neuron nodes ──────────────────────────
      nodesRef.current.forEach((node) => {
        const isHovered = node.hovered
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 0.85

        // ── Dendrites (precomputed curves — no jitter) ──
        node.dendrites.forEach((d) => {
          const endX = node.x + Math.cos(d.angle) * d.length
          const endY = node.y + Math.sin(d.angle) * d.length

          ctx.beginPath()
          ctx.moveTo(
            node.x + Math.cos(d.angle) * node.somaRadius * 0.8,
            node.y + Math.sin(d.angle) * node.somaRadius * 0.8
          )

          // Use precomputed offsets instead of Math.random()
          const cpX = (node.x + endX) / 2 + d.curveOffsetX
          const cpY = (node.y + endY) / 2 + d.curveOffsetY
          ctx.quadraticCurveTo(cpX, cpY, endX, endY)

          ctx.strokeStyle = isHovered
            ? `rgba(160, 80, 200, ${0.5 * pulse})`
            : `rgba(100, 50, 150, ${0.3 * pulse})`
          ctx.lineWidth = d.thickness
          ctx.stroke()

          // Branches
          d.branches.forEach((b) => {
            const bEndX = endX + Math.cos(b.angle) * b.length
            const bEndY = endY + Math.sin(b.angle) * b.length

            ctx.beginPath()
            ctx.moveTo(endX, endY)
            ctx.lineTo(bEndX, bEndY)
            ctx.strokeStyle = isHovered
              ? `rgba(140, 60, 180, ${0.35 * pulse})`
              : `rgba(80, 40, 120, ${0.2 * pulse})`
            ctx.lineWidth = b.thickness
            ctx.stroke()

            // Dendritic spine
            ctx.beginPath()
            ctx.arc(bEndX, bEndY, 1.2, 0, Math.PI * 2)
            ctx.fillStyle = isHovered
              ? `rgba(180, 100, 220, ${0.4 * pulse})`
              : `rgba(100, 50, 150, ${0.2 * pulse})`
            ctx.fill()
          })
        })

        // ── Soma ──
        const glowRadius = node.somaRadius * (isHovered ? 2.8 : 2.2) * pulse
        const glow = ctx.createRadialGradient(
          node.x, node.y, node.somaRadius * 0.5,
          node.x, node.y, glowRadius
        )
        glow.addColorStop(0, isHovered
          ? 'rgba(191, 64, 191, 0.20)'
          : 'rgba(160, 50, 180, 0.14)')
        glow.addColorStop(1, 'rgba(100, 40, 140, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Soma body — slightly irregular
        ctx.beginPath()
        const segments = 24
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2
          const wobble = 1 + Math.sin(angle * 3 + node.pulsePhase) * 0.04 + Math.sin(angle * 5) * 0.03
          const r = node.somaRadius * wobble
          const px = node.x + Math.cos(angle) * r
          const py = node.y + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        const somaGrad = ctx.createRadialGradient(
          node.x - node.somaRadius * 0.2,
          node.y - node.somaRadius * 0.2,
          0,
          node.x, node.y, node.somaRadius
        )
        if (isHovered) {
          somaGrad.addColorStop(0, 'rgba(200, 120, 240, 0.95)')
          somaGrad.addColorStop(0.6, 'rgba(140, 50, 180, 0.85)')
          somaGrad.addColorStop(1, 'rgba(80, 20, 120, 0.75)')
        } else {
          somaGrad.addColorStop(0, 'rgba(170, 80, 210, 0.85)')
          somaGrad.addColorStop(0.6, 'rgba(120, 45, 165, 0.75)')
          somaGrad.addColorStop(1, 'rgba(70, 20, 110, 0.65)')
        }
        ctx.fillStyle = somaGrad
        ctx.fill()

        ctx.strokeStyle = isHovered
          ? `rgba(200, 100, 255, ${0.6 * pulse})`
          : `rgba(120, 60, 180, ${0.3 * pulse})`
        ctx.lineWidth = isHovered ? 2 : 1
        ctx.stroke()

        // Nucleus
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.somaRadius * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = isHovered
          ? 'rgba(220, 150, 255, 0.5)'
          : 'rgba(140, 80, 200, 0.35)'
        ctx.fill()

        // Nucleolus
        ctx.beginPath()
        ctx.arc(node.x + 1, node.y + 1, node.somaRadius * 0.12, 0, Math.PI * 2)
        ctx.fillStyle = isHovered
          ? 'rgba(255, 200, 255, 0.6)'
          : 'rgba(180, 100, 220, 0.4)'
        ctx.fill()

        if (isHovered) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.somaRadius + 8, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * pulse})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      // ─── Labels ──────────────────────────────────────
      nodesRef.current.forEach((node) => {
        const isHovered = node.hovered

        ctx.font = `${isHovered ? '500' : '400'} 11px 'JetBrains Mono', monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        const labelY = node.y + node.somaRadius + 18
        const metrics = ctx.measureText(node.label)
        const padding = 8

        ctx.fillStyle = isHovered
          ? 'rgba(10, 10, 15, 0.85)'
          : 'rgba(10, 10, 15, 0.6)'
        ctx.beginPath()
        ctx.roundRect(
          node.x - metrics.width / 2 - padding,
          labelY - 3,
          metrics.width + padding * 2,
          18,
          4
        )
        ctx.fill()

        if (isHovered) {
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.fillStyle = isHovered
          ? 'rgba(0, 255, 255, 0.9)'
          : 'rgba(255, 255, 255, 0.4)'
        ctx.fillText(node.label, node.x, labelY)
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
    }
  }, [width, height, onNodeClick, onNodeHover])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20"
      style={{ width, height }}
    />
  )
}
