import { useRef, useEffect, useCallback } from 'react'

interface Ripple {
  x: number
  y: number
  maxRadius: number
  startTime: number
  strength: number
}

interface UltrasoundCanvasProps {
  width: number
  height: number
}

export default function UltrasoundCanvas({ width, height }: UltrasoundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const lastDragRippleRef = useRef(0)
  const animFrameRef = useRef(0)

  const addRipple = useCallback((x: number, y: number, strength: number) => {
    ripplesRef.current.push({
      x,
      y,
      maxRadius: strength > 0.5 ? 450 : 250,
      startTime: performance.now(),
      strength,
    })
    if (ripplesRef.current.length > 50) {
      ripplesRef.current = ripplesRef.current.slice(-50)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastDragRippleRef.current > 50) {
        addRipple(e.clientX, e.clientY, 0.3)
        lastDragRippleRef.current = now
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      addRipple(x, y, 1.0)
      setTimeout(() => addRipple(x, y, 0.75), 70)
      setTimeout(() => addRipple(x, y, 0.5), 160)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)

    const animate = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, width, height)

      const ripples = ripplesRef.current

      // Precompute active ripple state
      const active = ripples.map(r => {
        const elapsed = (now - r.startTime) / 1000
        const speed = 100 + r.strength * 60
        const currentRadius = elapsed * speed
        return { ...r, elapsed, currentRadius, progress: currentRadius / r.maxRadius }
      }).filter(r => r.progress <= 1)

      // Clean up expired
      for (let i = ripples.length - 1; i >= 0; i--) {
        const elapsed = (now - ripples[i].startTime) / 1000
        const speed = 100 + ripples[i].strength * 60
        if (elapsed * speed > ripples[i].maxRadius) {
          ripples.splice(i, 1)
        }
      }

      // ─── Draw each ripple as clean circular rings ───
      for (const r of active) {
        const progress = r.progress
        const fadeCurve = progress < 0.25
          ? 1.0
          : 1.0 - Math.pow((progress - 0.25) / 0.75, 1.3)
        const alpha = fadeCurve * r.strength * 0.7

        const numRings = r.strength > 0.5 ? 6 : 3
        const ringSpacing = 8 + r.strength * 5

        for (let ring = 0; ring < numRings; ring++) {
          const ringRadius = r.currentRadius - ring * ringSpacing
          if (ringRadius <= 2) continue

          const ringFade = 1 - ring / numRings
          const ringAlpha = alpha * ringFade * 0.75
          if (ringAlpha <= 0.003) continue

          const lw = (2 + r.strength * 2) * ringFade * (ring === 0 ? 1.3 : 0.8)

          const color = ring === 0
            ? `rgba(191, 64, 191, ${ringAlpha})`
            : ring % 2 === 0
              ? `rgba(160, 60, 180, ${ringAlpha * 0.7})`
              : `rgba(130, 50, 160, ${ringAlpha * 0.5})`

          // Clean circular arc
          ctx.beginPath()
          ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = color
          ctx.lineWidth = lw

          if (ring > 1) {
            const dashLen = 4 + ringRadius * 0.03
            ctx.setLineDash([dashLen, dashLen * 0.7])
          } else {
            ctx.setLineDash([])
          }
          ctx.stroke()
          ctx.setLineDash([])

          // Bloom glow on leading ring
          if (ring === 0 && ringAlpha > 0.08) {
            ctx.beginPath()
            ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(191, 64, 191, ${ringAlpha * 0.15})`
            ctx.lineWidth = 8 + r.strength * 6
            ctx.stroke()
          }
        }

        // Center flash on click
        if (r.strength > 0.5 && r.elapsed < 0.2) {
          const flashAlpha = (1 - r.elapsed / 0.2) * r.strength * 0.45
          const flashRadius = 35 + r.strength * 15
          const gradient = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, flashRadius)
          gradient.addColorStop(0, `rgba(255, 230, 255, ${flashAlpha})`)
          gradient.addColorStop(0.25, `rgba(200, 120, 240, ${flashAlpha * 0.5})`)
          gradient.addColorStop(0.6, `rgba(191, 64, 191, ${flashAlpha * 0.2})`)
          gradient.addColorStop(1, 'rgba(191, 64, 191, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(r.x, r.y, flashRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Pressure field band
        if (r.strength > 0.3 && progress > 0.05 && progress < 0.6) {
          const pressureAlpha = (1 - progress / 0.6) * r.strength * 0.1
          const innerR = r.currentRadius * 0.7
          const outerR = r.currentRadius * 1.08
          const gradient = ctx.createRadialGradient(r.x, r.y, innerR, r.x, r.y, outerR)
          gradient.addColorStop(0, 'rgba(191, 64, 191, 0)')
          gradient.addColorStop(0.5, `rgba(140, 40, 180, ${pressureAlpha})`)
          gradient.addColorStop(1, 'rgba(191, 64, 191, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(r.x, r.y, outerR, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ─── Interference bright spots where wavefronts cross ───
      if (active.length > 1) {
        for (let i = 0; i < active.length; i++) {
          for (let j = i + 1; j < active.length; j++) {
            const a = active[i]
            const b = active[j]

            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 10) continue

            const overlap = Math.abs(a.currentRadius + b.currentRadius - dist)
            if (overlap > 30) continue

            const interAlpha = Math.max(0, (1 - overlap / 30)) * a.strength * b.strength * 0.25
            if (interAlpha <= 0.02) continue

            const t = (dist * dist + a.currentRadius * a.currentRadius - b.currentRadius * b.currentRadius) / (2 * dist)
            const hSq = a.currentRadius * a.currentRadius - t * t
            if (hSq < 0) continue
            const h = Math.sqrt(hSq)

            const mx = a.x + (dx / dist) * t
            const my = a.y + (dy / dist) * t
            const perpX = -dy / dist
            const perpY = dx / dist

            const points = [
              { x: mx + perpX * h, y: my + perpY * h },
              { x: mx - perpX * h, y: my - perpY * h },
            ]

            for (const pt of points) {
              const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 14)
              grd.addColorStop(0, `rgba(220, 160, 255, ${interAlpha})`)
              grd.addColorStop(1, 'rgba(191, 64, 191, 0)')
              ctx.fillStyle = grd
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [width, height, addRipple])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30 pointer-events-none"
      style={{ width, height }}
    />
  )
}
