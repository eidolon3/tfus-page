export interface Point {
  x: number
  y: number
}

export interface Vector {
  x: number
  y: number
}

export interface Ellipse {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface BeamPath {
  source: Point
  skullEntry: Point
  skullExit: Point
  target: Point
  incidentAngle: number
  refractedAngle: number
}

export interface SceneState {
  mouse: Point
  beamPaths: BeamPath[]
  hoveredNode: number | null
  activeAP: ActionPotentialState | null
  ripples: RippleState[]
  time: number
  canvasWidth: number
  canvasHeight: number
}

export interface ActionPotentialState {
  nodeIndex: number
  progress: number // 0-1
  trail: Point[]
  active: boolean
}

export interface RippleState {
  center: Point
  radius: number
  maxRadius: number
  alpha: number
  startTime: number
}
