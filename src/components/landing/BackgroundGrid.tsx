import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const gridVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const gridFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;

  varying vec2 vUv;

  float grid(vec2 uv, float spacing, float thickness) {
    vec2 g = abs(fract(uv / spacing - 0.5) - 0.5);
    float lines = min(g.x, g.y);
    return smoothstep(thickness, 0.0, lines);
  }

  void main() {
    vec2 uv = vUv * 20.0 - 10.0;

    // Two grid layers
    float grid1 = grid(uv, 1.0, 0.015) * 0.08;
    float grid2 = grid(uv, 0.25, 0.008) * 0.03;

    // Mouse proximity brightening
    vec2 mouseUV = (uMouse + 5.0) / 10.0;
    float mouseDist = length(vUv - mouseUV);
    float mouseGlow = smoothstep(0.3, 0.0, mouseDist) * 0.06;

    // Subtle radial vignette
    float vignette = 1.0 - length(vUv - 0.5) * 0.8;

    float alpha = (grid1 + grid2 + mouseGlow) * vignette;

    vec3 color = vec3(0.15, 0.08, 0.25);
    color += vec3(0.0, 0.6, 0.6) * mouseGlow;

    gl_FragColor = vec4(color, alpha);
  }
`

interface BackgroundGridProps {
  mousePos: { x: number; y: number }
}

export default function BackgroundGrid({ mousePos }: BackgroundGridProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.set(mousePos.x, mousePos.y)
    }
  })

  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
