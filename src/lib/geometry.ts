import type { Point, Vector, Ellipse } from '../types/geometry'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

export function distance(a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function normalize(v: Vector): Vector {
  const len = Math.sqrt(v.x * v.x + v.y * v.y)
  if (len === 0) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}

export function angle(a: Point, b: Point): number {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

export function pointOnEllipse(ellipse: Ellipse, angle: number): Point {
  return {
    x: ellipse.cx + ellipse.rx * Math.cos(angle),
    y: ellipse.cy + ellipse.ry * Math.sin(angle),
  }
}

export function ellipseNormalAt(ellipse: Ellipse, angle: number): Vector {
  const nx = Math.cos(angle) / ellipse.rx
  const ny = Math.sin(angle) / ellipse.ry
  return normalize({ x: nx, y: ny })
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

// Find intersection of line from p1 to p2 with ellipse
export function lineEllipseIntersection(
  p1: Point,
  p2: Point,
  ellipse: Ellipse
): Point | null {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const ox = p1.x - ellipse.cx
  const oy = p1.y - ellipse.cy

  const a = (dx * dx) / (ellipse.rx * ellipse.rx) + (dy * dy) / (ellipse.ry * ellipse.ry)
  const b = 2 * ((ox * dx) / (ellipse.rx * ellipse.rx) + (oy * dy) / (ellipse.ry * ellipse.ry))
  const c = (ox * ox) / (ellipse.rx * ellipse.rx) + (oy * oy) / (ellipse.ry * ellipse.ry) - 1

  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) return null

  const sqrtD = Math.sqrt(discriminant)
  const t1 = (-b - sqrtD) / (2 * a)
  const t2 = (-b + sqrtD) / (2 * a)

  // Pick the intersection that's between p1 and p2
  const t = t1 >= 0 && t1 <= 1 ? t1 : t2 >= 0 && t2 <= 1 ? t2 : t1 >= 0 ? t1 : t2

  if (t < 0) return null

  return {
    x: p1.x + t * dx,
    y: p1.y + t * dy,
  }
}
