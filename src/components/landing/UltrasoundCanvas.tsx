import { useRef, useEffect } from 'react'

interface UltrasoundCanvasProps {
  width: number
  height: number
}

export default function UltrasoundCanvas({ width, height }: UltrasoundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    canvas.width  = width
    canvas.height = height

    // Two sources — symmetric about center
    const sources = [
      { x: width * 0.32, y: height * 0.50 },
      { x: width * 0.68, y: height * 0.50 },
    ]

    const k     = (2 * Math.PI) / 115   // wavelength
    const SPEED = 0.30                   // rad/s
    const STEP  = 4

    const imgData = ctx.createImageData(width, height)
    const buf     = imgData.data

    const animate = () => {
      const t = performance.now() / 1000

      for (let y = 0; y < height; y += STEP) {
        for (let x = 0; x < width; x += STEP) {
          let sum = 0
          for (const s of sources) {
            const dist = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2)
            sum += Math.sin(k * dist - SPEED * t)
          }

          // Squared → always positive; constructive = bright, destructive = dark
          const norm  = sum / sources.length   // [-1, 1]
          const bright = norm * norm            // [0, 1]
          const alpha = Math.round(bright * 20)

          for (let dy = 0; dy < STEP && y + dy < height; dy++) {
            for (let dx = 0; dx < STEP && x + dx < width; dx++) {
              const i    = ((y + dy) * width + (x + dx)) * 4
              buf[i]     = 140
              buf[i + 1] = 200
              buf[i + 2] = 255
              buf[i + 3] = alpha
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width, height }}
    />
  )
}
