import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_POSITIONS } from '../../lib/skullGeometry'

const CATEGORIES = [
  { label: 'Organizations', color: '#BF40BF', path: '/organizations' },
  { label: 'Studies', color: '#9B30FF', path: '/studies' },
  { label: 'Technology', color: '#7B68EE', path: '/technology' },
  { label: 'Open Questions', color: '#6A5ACD', path: '/misc' },
]

const nodeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nodeFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uHover;
  uniform float uPulse;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // Core glow
    float core = smoothstep(1.0, 0.0, dist);
    float ring = smoothstep(0.8, 0.6, dist) * smoothstep(0.4, 0.6, dist);

    // Animated pulse ring
    float pulseRing = sin(uTime * 3.0 + uPulse) * 0.5 + 0.5;
    float outerRing = smoothstep(1.0, 0.85, dist) * smoothstep(0.7, 0.85, dist) * pulseRing;

    // Hover expansion
    float hoverGlow = uHover * smoothstep(1.2, 0.0, dist) * 0.5;

    float alpha = core * 0.8 + ring * 0.4 + outerRing * 0.3 + hoverGlow;
    vec3 color = uColor * (core * 1.5 + ring * 0.8 + outerRing * 0.5);

    // Add cyan highlight on hover
    color += vec3(0.0, 1.0, 1.0) * hoverGlow * 0.6;

    gl_FragColor = vec4(color, alpha);
  }
`

interface TransducerNodesProps {
  onHover: (index: number | null) => void
  onClick: (path: string) => void
}

function TransducerNode({ position, category, index, onHover, onClick }: {
  position: { x: number; y: number }
  category: typeof CATEGORIES[number]
  index: number
  onHover: (index: number | null) => void
  onClick: (path: string) => void
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      // Smooth hover transition
      const target = hovered ? 1 : 0
      const current = materialRef.current.uniforms.uHover.value
      materialRef.current.uniforms.uHover.value += (target - current) * 0.1
    }
  })

  return (
    <group position={[position.x, position.y, 0.1]}>
      {/* Clickable area */}
      <mesh
        onPointerEnter={() => { setHovered(true); onHover(index) }}
        onPointerLeave={() => { setHovered(false); onHover(null) }}
        onClick={() => onClick(category.path)}
      >
        <planeGeometry args={[0.8, 0.8]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={nodeVertexShader}
          fragmentShader={nodeFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(category.color) },
            uHover: { value: 0 },
            uPulse: { value: index * 1.5 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label - positioned outside the skull */}
      {hovered && (
        <group position={[0, 0.6, 0]}>
          <mesh>
            <planeGeometry args={[2.0, 0.35]} />
            <meshBasicMaterial color="#0A0A0F" transparent opacity={0.85} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function TransducerNodes({ onHover, onClick }: TransducerNodesProps) {
  return (
    <group>
      {NODE_POSITIONS.map((pos, i) => (
        <TransducerNode
          key={i}
          position={pos}
          category={CATEGORIES[i]}
          index={i}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
    </group>
  )
}
