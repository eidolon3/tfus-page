import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const focalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const focalFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // Intense central point
    float core = exp(-dist * dist * 8.0) * uIntensity;

    // Pulsing rings
    float ring1 = smoothstep(0.02, 0.0, abs(dist - 0.3 - sin(uTime * 4.0) * 0.05));
    float ring2 = smoothstep(0.02, 0.0, abs(dist - 0.6 - sin(uTime * 3.0 + 1.0) * 0.05));
    float ring3 = smoothstep(0.02, 0.0, abs(dist - 0.9 - sin(uTime * 2.5 + 2.0) * 0.05));

    float rings = (ring1 * 0.5 + ring2 * 0.3 + ring3 * 0.15) * uIntensity;

    // Outer glow
    float glow = exp(-dist * 2.0) * 0.3 * uIntensity;

    float alpha = core + rings + glow;

    // Hot white center, purple mid, cyan outer
    vec3 coreColor = vec3(1.0, 0.95, 1.0);
    vec3 midColor = vec3(0.75, 0.25, 0.75);
    vec3 outerColor = vec3(0.0, 1.0, 1.0);

    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.4, dist));
    color = mix(color, outerColor, smoothstep(0.4, 1.0, dist));

    gl_FragColor = vec4(color, alpha);
  }
`

interface FocalPointProps {
  mousePos: { x: number; y: number }
  intensity: number
}

export default function FocalPoint({ mousePos, intensity }: FocalPointProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: intensity },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      materialRef.current.uniforms.uIntensity.value += (intensity - materialRef.current.uniforms.uIntensity.value) * 0.08
    }
  })

  return (
    <mesh position={[mousePos.x, mousePos.y, 0.2]}>
      <planeGeometry args={[2.5, 2.5]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={focalVertexShader}
        fragmentShader={focalFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
