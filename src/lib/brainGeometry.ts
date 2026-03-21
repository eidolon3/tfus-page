import * as THREE from 'three'

// Sagittal brain cross-section geometry
// All coordinates in normalized space (-1 to 1), will be scaled by the scene

interface BrainRegion {
  name: string
  points: [number, number][]
  color: string
  glowColor: string
  opacity: number
}

// Simplified sagittal brain regions as bezier-approximated outlines
export const brainRegions: BrainRegion[] = [
  {
    name: 'cerebrum',
    points: [
      [0, -0.85], [0.25, -0.88], [0.5, -0.82], [0.7, -0.68],
      [0.82, -0.48], [0.85, -0.25], [0.82, 0], [0.78, 0.2],
      [0.7, 0.38], [0.55, 0.5], [0.35, 0.55], [0.15, 0.52],
      [0, 0.48], [-0.15, 0.52], [-0.35, 0.55], [-0.55, 0.5],
      [-0.7, 0.38], [-0.78, 0.2], [-0.82, 0], [-0.85, -0.25],
      [-0.82, -0.48], [-0.7, -0.68], [-0.5, -0.82], [-0.25, -0.88],
    ],
    color: '#1A0A2E',
    glowColor: '#2D1B4E',
    opacity: 0.9,
  },
  {
    name: 'whitematter',
    points: [
      [0, -0.65], [0.2, -0.68], [0.38, -0.62], [0.52, -0.5],
      [0.6, -0.32], [0.62, -0.12], [0.58, 0.08], [0.5, 0.22],
      [0.38, 0.32], [0.2, 0.38], [0, 0.35], [-0.2, 0.38],
      [-0.38, 0.32], [-0.5, 0.22], [-0.58, 0.08], [-0.62, -0.12],
      [-0.6, -0.32], [-0.52, -0.5], [-0.38, -0.62], [-0.2, -0.68],
    ],
    color: '#251545',
    glowColor: '#3D2565',
    opacity: 0.85,
  },
  {
    name: 'corpusCallosum',
    points: [
      [-0.3, -0.15], [-0.15, -0.22], [0, -0.24], [0.15, -0.22],
      [0.3, -0.15], [0.25, -0.08], [0.1, -0.12], [0, -0.13],
      [-0.1, -0.12], [-0.25, -0.08],
    ],
    color: '#3A1F6E',
    glowColor: '#5A3FA0',
    opacity: 0.95,
  },
  {
    name: 'thalamus',
    points: [
      [-0.12, -0.05], [-0.05, -0.12], [0.05, -0.12], [0.12, -0.05],
      [0.12, 0.05], [0.05, 0.12], [-0.05, 0.12], [-0.12, 0.05],
    ],
    color: '#4A2080',
    glowColor: '#7040C0',
    opacity: 1,
  },
  {
    name: 'ventricles',
    points: [
      [-0.08, -0.02], [-0.03, -0.08], [0.03, -0.08], [0.08, -0.02],
      [0.05, 0.04], [0, 0.06], [-0.05, 0.04],
    ],
    color: '#0D0520',
    glowColor: '#1A0A40',
    opacity: 0.7,
  },
  {
    name: 'cerebellum',
    points: [
      [-0.35, 0.45], [-0.2, 0.42], [-0.05, 0.48], [0.05, 0.48],
      [0.2, 0.42], [0.35, 0.45], [0.3, 0.62], [0.15, 0.72],
      [0, 0.75], [-0.15, 0.72], [-0.3, 0.62],
    ],
    color: '#1E0E3A',
    glowColor: '#2E1E5A',
    opacity: 0.9,
  },
  {
    name: 'brainstem',
    points: [
      [-0.06, 0.45], [0.06, 0.45], [0.08, 0.58], [0.07, 0.72],
      [0.05, 0.85], [-0.05, 0.85], [-0.07, 0.72], [-0.08, 0.58],
    ],
    color: '#180830',
    glowColor: '#281848',
    opacity: 0.9,
  },
]

export function createBrainShape(points: [number, number][], scale: number): THREE.Shape {
  const shape = new THREE.Shape()
  const scaledPoints = points.map(([x, y]) => [x * scale, y * scale] as [number, number])

  shape.moveTo(scaledPoints[0][0], scaledPoints[0][1])

  for (let i = 1; i < scaledPoints.length; i++) {
    const prev = scaledPoints[i - 1]
    const curr = scaledPoints[i]
    const next = scaledPoints[(i + 1) % scaledPoints.length]

    // Use quadratic curves for smooth shapes
    const cpx = (prev[0] + curr[0] + next[0]) / 3
    const cpy = (prev[1] + curr[1] + next[1]) / 3
    shape.quadraticCurveTo(cpx, cpy, curr[0], curr[1])
  }

  shape.closePath()
  return shape
}

export function createBrainGeometry(region: BrainRegion, scale: number): THREE.ShapeGeometry {
  const shape = createBrainShape(region.points, scale)
  return new THREE.ShapeGeometry(shape, 32)
}
