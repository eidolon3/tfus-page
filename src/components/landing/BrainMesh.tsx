import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { brainRegions, createBrainShape } from '../../lib/brainGeometry'

const SCALE = 3.2

// Custom shader for brain regions with animated gradient
const brainVertexShader = `
  varying vec2 vUv;
  varying vec2 vPosition;
  void main() {
    vUv = uv;
    vPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const brainFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying vec2 vPosition;

  void main() {
    // Distance from center for radial gradient
    float dist = length(vPosition) / 4.0;

    // Animated pulse
    float pulse = sin(uTime * 0.5 + dist * 3.0) * 0.05 + 0.95;

    // Mix between dark core and glowing edge
    vec3 color = mix(uColor, uGlowColor, dist * 0.6);

    // Mouse proximity glow
    float mouseDist = length(vPosition - uMouse);
    float mouseGlow = smoothstep(2.5, 0.0, mouseDist) * 0.15;
    color += uGlowColor * mouseGlow;

    // Apply pulse
    color *= pulse;

    gl_FragColor = vec4(color, uOpacity);
  }
`

interface BrainRegionMeshProps {
  region: typeof brainRegions[number]
  mousePos: { x: number; y: number }
}

function BrainRegionMesh({ region, mousePos }: BrainRegionMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const shape = createBrainShape(region.points, SCALE)
    return new THREE.ShapeGeometry(shape, 32)
  }, [region.points])

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(region.color) },
    uGlowColor: { value: new THREE.Color(region.glowColor) },
    uOpacity: { value: region.opacity },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [region.color, region.glowColor, region.opacity])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.set(mousePos.x, mousePos.y)
    }
  })

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={brainVertexShader}
        fragmentShader={brainFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

interface BrainMeshProps {
  mousePos: { x: number; y: number }
}

export default function BrainMesh({ mousePos }: BrainMeshProps) {
  return (
    <group>
      {brainRegions.map((region) => (
        <BrainRegionMesh
          key={region.name}
          region={region}
          mousePos={mousePos}
        />
      ))}
    </group>
  )
}
