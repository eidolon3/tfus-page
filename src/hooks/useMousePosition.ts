import { useState, useEffect, useCallback, useRef } from 'react'
import type { Point } from '../types/geometry'

export function useMousePosition(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 })
  const [normalizedPosition, setNormalizedPosition] = useState<Point>({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setPosition({ x, y })

      // Normalize to -1 to 1 range (Three.js coordinates)
      const nx = ((x / rect.width) * 2 - 1) * 5
      const ny = -((y / rect.height) * 2 - 1) * 5
      setNormalizedPosition({ x: nx, y: ny })
    })
  }, [containerRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, handleMouseMove])

  return { position, normalizedPosition }
}
