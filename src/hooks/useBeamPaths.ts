import { useMemo } from 'react'
import type { Point, BeamPath } from '../types/geometry'
import { computeAllBeamPaths, computeFocalDepth, computeFocalIntensity } from '../lib/beam'

export function useBeamPaths(mousePos: Point) {
  return useMemo(() => {
    const beamPaths = computeAllBeamPaths(mousePos)
    const focalDepth = computeFocalDepth(mousePos)
    const intensity = computeFocalIntensity(beamPaths)

    return {
      beamPaths,
      focalDepth,
      intensity,
    }
  }, [mousePos.x, mousePos.y])
}
