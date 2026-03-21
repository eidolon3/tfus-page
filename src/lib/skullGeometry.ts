import * as THREE from 'three'
import type { Ellipse } from '../types/geometry'

export const SKULL_OUTER: Ellipse = {
  cx: 0,
  cy: 0,
  rx: 3.8,
  ry: 4.2,
}

export const SKULL_INNER: Ellipse = {
  cx: 0,
  cy: 0,
  rx: 3.5,
  ry: 3.9,
}

export const SKULL_THICKNESS = 0.3

// Generate skull arc as a band between two ellipses
// Only the upper portion (like a real skull in sagittal view)
export function createSkullGeometry(
  segments: number = 64,
  startAngle: number = -Math.PI * 0.85,
  endAngle: number = Math.PI * 0.85
): THREE.BufferGeometry {
  const vertices: number[] = []
  const indices: number[] = []
  const uvs: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = startAngle + t * (endAngle - startAngle)

    // Outer point
    const ox = SKULL_OUTER.cx + SKULL_OUTER.rx * Math.cos(angle)
    const oy = SKULL_OUTER.cy + SKULL_OUTER.ry * Math.sin(angle)

    // Inner point
    const ix = SKULL_INNER.cx + SKULL_INNER.rx * Math.cos(angle)
    const iy = SKULL_INNER.cy + SKULL_INNER.ry * Math.sin(angle)

    vertices.push(ox, oy, 0) // outer vertex
    vertices.push(ix, iy, 0) // inner vertex

    uvs.push(t, 1) // outer uv
    uvs.push(t, 0) // inner uv

    if (i < segments) {
      const base = i * 2
      indices.push(base, base + 1, base + 2)
      indices.push(base + 1, base + 3, base + 2)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

// Get a point on the outer skull at a given angle
export function getSkullPoint(angle: number): { x: number; y: number } {
  return {
    x: SKULL_OUTER.cx + SKULL_OUTER.rx * Math.cos(angle),
    y: SKULL_OUTER.cy + SKULL_OUTER.ry * Math.sin(angle),
  }
}

// Node positions along the skull arc (4 categories)
// Angles: positioned along the top/upper-left arc
export const NODE_ANGLES = [
  -Math.PI * 0.7,  // Organizations (upper left)
  -Math.PI * 0.5,  // Studies (top-left)
  -Math.PI * 0.3,  // Technology (top-right)
  -Math.PI * 0.1,  // Misc (upper right)
]

export const NODE_POSITIONS = NODE_ANGLES.map(angle => getSkullPoint(angle))
