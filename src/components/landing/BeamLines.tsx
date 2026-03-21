import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BeamPath } from '../../types/geometry'

const beamVertexShader = `
  attribute float aProgress;
  varying float vProgress;
  varying vec2 vPosition;

  void main() {
    vProgress = aProgress;
    vPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const beamFragmentShader = `
  uniform float uTime;
  uniform vec3 uBeamColor;
  uniform float uIntensity;
  uniform float uPhase;

  varying float vProgress;
  varying vec2 vPosition;

  void main() {
    // Traveling wave effect
    float wave = sin((vProgress * 12.0 - uTime * 3.0 + uPhase) * 3.14159) * 0.5 + 0.5;

    // Beam gets brighter toward focal point
    float focusGlow = smoothstep(0.0, 1.0, vProgress) * 0.6;

    // Pulsing
    float pulse = sin(uTime * 2.0 + uPhase) * 0.15 + 0.85;

    float alpha = (0.15 + wave * 0.3 + focusGlow) * uIntensity * pulse;

    // Color shifts slightly toward white at high intensity
    vec3 color = mix(uBeamColor, vec3(1.0), focusGlow * 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`

interface BeamLinesProps {
  beamPaths: BeamPath[]
  intensity: number
  hoveredNode: number | null
}

function SingleBeam({ path, index, intensity, isHovered }: {
  path: BeamPath
  index: number
  intensity: number
  isHovered: boolean
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, progressAttr } = useMemo(() => {
    // Create a ribbon between source and target with wavefront segments
    const segments = 64
    const width = isHovered ? 0.06 : 0.035
    const positions: number[] = []
    const progress: number[] = []
    const indices: number[] = []

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      // Interpolate through skull entry/exit points
      let x: number, y: number
      if (t < 0.3) {
        // Source to skull entry
        const lt = t / 0.3
        x = path.source.x + (path.skullEntry.x - path.source.x) * lt
        y = path.source.y + (path.skullEntry.y - path.source.y) * lt
      } else if (t < 0.4) {
        // Through skull (with refraction bend)
        const lt = (t - 0.3) / 0.1
        const midX = (path.skullEntry.x + path.skullExit.x) / 2
        const midY = (path.skullEntry.y + path.skullExit.y) / 2
        // Add slight bend for refraction effect
        const bendAmount = Math.sin(path.refractedAngle) * 0.15
        const nx = -(path.skullExit.y - path.skullEntry.y)
        const ny = (path.skullExit.x - path.skullEntry.x)
        const nlen = Math.sqrt(nx * nx + ny * ny) || 1
        x = path.skullEntry.x + (path.skullExit.x - path.skullEntry.x) * lt + (nx / nlen) * bendAmount * Math.sin(lt * Math.PI)
        y = path.skullEntry.y + (path.skullExit.y - path.skullEntry.y) * lt + (ny / nlen) * bendAmount * Math.sin(lt * Math.PI)
      } else {
        // Skull exit to target
        const lt = (t - 0.4) / 0.6
        x = path.skullExit.x + (path.target.x - path.skullExit.x) * lt
        y = path.skullExit.y + (path.target.y - path.skullExit.y) * lt
      }

      // Compute perpendicular for ribbon width
      let dx: number, dy: number
      if (i < segments) {
        const nextT = (i + 1) / segments
        let nx: number, ny: number
        if (nextT < 0.3) {
          const lt = nextT / 0.3
          nx = path.source.x + (path.skullEntry.x - path.source.x) * lt
          ny = path.source.y + (path.skullEntry.y - path.source.y) * lt
        } else if (nextT < 0.4) {
          const lt = (nextT - 0.3) / 0.1
          nx = path.skullEntry.x + (path.skullExit.x - path.skullEntry.x) * lt
          ny = path.skullEntry.y + (path.skullExit.y - path.skullEntry.y) * lt
        } else {
          const lt = (nextT - 0.4) / 0.6
          nx = path.skullExit.x + (path.target.x - path.skullExit.x) * lt
          ny = path.skullExit.y + (path.target.y - path.skullExit.y) * lt
        }
        dx = nx - x
        dy = ny - y
      } else {
        dx = x - positions[positions.length - 6]
        dy = y - positions[positions.length - 5]
      }

      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const perpX = -dy / len
      const perpY = dx / len

      // Taper the beam
      const taper = 1.0 - Math.abs(t - 0.5) * 0.5

      positions.push(x + perpX * width * taper, y + perpY * width * taper, 0)
      positions.push(x - perpX * width * taper, y - perpY * width * taper, 0)
      progress.push(t, t)

      if (i < segments) {
        const base = i * 2
        indices.push(base, base + 1, base + 2)
        indices.push(base + 1, base + 3, base + 2)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('aProgress', new THREE.Float32BufferAttribute(progress, 1))
    geo.setIndex(indices)

    return { geometry: geo, progressAttr: progress }
  }, [path, isHovered])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBeamColor: { value: new THREE.Color('#BF40BF') },
    uIntensity: { value: intensity },
    uPhase: { value: index * 1.5 },
  }), [index])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      materialRef.current.uniforms.uIntensity.value = isHovered ? 1.5 : intensity
    }
  })

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={beamVertexShader}
        fragmentShader={beamFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function BeamLines({ beamPaths, intensity, hoveredNode }: BeamLinesProps) {
  return (
    <group>
      {beamPaths.map((path, i) => (
        <SingleBeam
          key={i}
          path={path}
          index={i}
          intensity={intensity}
          isHovered={hoveredNode === i}
        />
      ))}
    </group>
  )
}
