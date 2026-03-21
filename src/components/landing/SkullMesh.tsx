import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createSkullGeometry } from '../../lib/skullGeometry'

const skullVertexShader = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const skullFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;

  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    // Inner edge glow (uv.y = 0 is inner, 1 is outer)
    float innerGlow = smoothstep(0.6, 0.0, vUv.y) * 0.4;

    // Subtle scanning line animation
    float scanLine = smoothstep(0.02, 0.0, abs(fract(vUv.x * 20.0 - uTime * 0.1) - 0.5));
    scanLine *= 0.15;

    // Bone texture (noise-like pattern)
    float texture = sin(vUv.x * 50.0 + vUv.y * 30.0) * 0.02
                  + sin(vUv.x * 80.0 - vUv.y * 40.0) * 0.015;

    vec3 color = uColor;
    color += uGlowColor * innerGlow;
    color += vec3(0.4, 0.2, 0.6) * scanLine;
    color += vec3(texture);

    float alpha = 0.35 + innerGlow * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`

export default function SkullMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => createSkullGeometry(128), [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3A2A5C') },
    uGlowColor: { value: new THREE.Color('#5A3A8C') },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={skullVertexShader}
        fragmentShader={skullFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
