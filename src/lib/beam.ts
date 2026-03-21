import type { Point, BeamPath, Ellipse } from '../types/geometry'
import { SKULL_OUTER, SKULL_INNER, NODE_POSITIONS } from './skullGeometry'
import { lineEllipseIntersection, normalize, distance } from './geometry'

const SPEED_RATIO = 0.65 // brain tissue vs skull bone (simplified)

function findSkullIntersection(source: Point, target: Point, ellipse: Ellipse): Point {
  const intersection = lineEllipseIntersection(source, target, ellipse)
  if (intersection) return intersection
  // Fallback: project to nearest point on ellipse
  const angle = Math.atan2(target.y - ellipse.cy, target.x - ellipse.cx)
  return {
    x: ellipse.cx + ellipse.rx * Math.cos(angle),
    y: ellipse.cy + ellipse.ry * Math.sin(angle),
  }
}

export function computeBeamPath(sourceIndex: number, target: Point): BeamPath {
  const source = NODE_POSITIONS[sourceIndex]

  // Find where beam enters and exits the skull
  const skullEntry = findSkullIntersection(source, target, SKULL_OUTER)
  const skullExit = findSkullIntersection(source, target, SKULL_INNER)

  // Compute refraction angle (visual approximation of Snell's law)
  const dx = target.x - source.x
  const dy = target.y - source.y
  const beamDir = normalize({ x: dx, y: dy })

  // Normal at skull entry point
  const entryAngle = Math.atan2(skullEntry.y - SKULL_OUTER.cy, skullEntry.x - SKULL_OUTER.cx)
  const normalX = Math.cos(entryAngle) / SKULL_OUTER.rx
  const normalY = Math.sin(entryAngle) / SKULL_OUTER.ry
  const normalLen = Math.sqrt(normalX * normalX + normalY * normalY)

  // Incident angle (angle between beam and normal)
  const dotProduct = (beamDir.x * normalX + beamDir.y * normalY) / normalLen
  const incidentAngle = Math.acos(Math.abs(dotProduct))

  // Simplified Snell's law
  const sinRefracted = Math.sin(incidentAngle) * SPEED_RATIO
  const refractedAngle = Math.abs(sinRefracted) <= 1
    ? Math.asin(sinRefracted)
    : incidentAngle

  return {
    source,
    skullEntry,
    skullExit,
    target,
    incidentAngle,
    refractedAngle,
  }
}

export function computeAllBeamPaths(target: Point): BeamPath[] {
  return NODE_POSITIONS.map((_, i) => computeBeamPath(i, target))
}

// Calculate focal depth (distance from skull inner surface to cursor)
export function computeFocalDepth(target: Point): number {
  // Find nearest point on inner skull
  const angle = Math.atan2(target.y - SKULL_INNER.cy, target.x - SKULL_INNER.cx)
  const skullPoint = {
    x: SKULL_INNER.cx + SKULL_INNER.rx * Math.cos(angle),
    y: SKULL_INNER.cy + SKULL_INNER.ry * Math.sin(angle),
  }

  const dist = distance(target, skullPoint)
  // Convert to mm (assume brain cross-section is ~170mm)
  const scaleFactor = 170 / (SKULL_INNER.rx * 2)
  return dist * scaleFactor
}

// Compute intensity at focal point (brighter when beams converge)
export function computeFocalIntensity(beamPaths: BeamPath[]): number {
  if (beamPaths.length === 0) return 0

  // Average distance between beam endpoints (should be ~0 when converging)
  let totalDist = 0
  for (let i = 0; i < beamPaths.length; i++) {
    for (let j = i + 1; j < beamPaths.length; j++) {
      totalDist += distance(beamPaths[i].target, beamPaths[j].target)
    }
  }
  const avgDist = totalDist / (beamPaths.length * (beamPaths.length - 1) / 2)

  // Inverse relationship: closer beams = higher intensity
  return Math.max(0, 1 - avgDist * 0.5)
}
