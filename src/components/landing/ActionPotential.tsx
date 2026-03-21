import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_POSITIONS } from '../../lib/skullGeometry'
import type { BeamPath } from '../../types/geometry'

const apVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const apFragmentShader = `
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // Bright cyan core
    float core = exp(-dist * dist * 12.0);

    // Electric trail
    float trail = exp(-dist * 3.0) * 0.4;

    float alpha = core + trail;

    vec3 color = vec3(0.0, 1.0, 1.0) * core + vec3(0.5, 0.8, 1.0) * trail;

    gl_FragColor = vec4(color, alpha);
  }
`

// Ripple effect at impact
const rippleVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const rippleFragmentShader = `
  uniform float uProgress;
  uniform float uAlpha;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    float ringRadius = uProgress;
    float ring = smoothstep(0.06, 0.0, abs(dist - ringRadius));
    float innerGlow = smoothstep(ringRadius, 0.0, dist) * (1.0 - uProgress) * 0.2;

    float alpha = (ring * 0.8 + innerGlow) * uAlpha;
    vec3 color = vec3(0.0, 1.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`

interface ActionPotentialProps {
  hoveredNode: number | null
  beamPaths: BeamPath[]
  mousePos: { x: number; y: number }
}

export default function ActionPotential({ hoveredNode, beamPaths, mousePos }: ActionPotentialProps) {
  const apRef = useRef<THREE.Mesh>(null)
  const apMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const rippleRef = useRef<THREE.Mesh>(null)
  const rippleMaterialRef = useRef<THREE.ShaderMaterial>(null)

  const [apProgress, setApProgress] = useState(-1)
  const [rippleProgress, setRippleProgress] = useState(-1)
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const prevHoveredRef = useRef<number | null>(null)

  // Trigger AP when a new node is hovered
  useEffect(() => {
    if (hoveredNode !== null && hoveredNode !== prevHoveredRef.current) {
      setActiveNode(hoveredNode)
      setApProgress(0)
      setRippleProgress(-1)
    }
    prevHoveredRef.current = hoveredNode
  }, [hoveredNode])

  useFrame((_, delta) => {
    // Animate AP
    if (apProgress >= 0 && apProgress < 1 && activeNode !== null) {
      const newProgress = apProgress + delta * 2.5 // Speed
      setApProgress(Math.min(newProgress, 1))

      if (newProgress >= 1) {
        // Trigger ripple on impact
        setRippleProgress(0)
      }

      // Interpolate position along beam path
      const beam = beamPaths[activeNode]
      if (beam && apRef.current) {
        const t = apProgress
        let x: number, y: number
        if (t < 0.3) {
          const lt = t / 0.3
          x = beam.source.x + (beam.skullEntry.x - beam.source.x) * lt
          y = beam.source.y + (beam.skullEntry.y - beam.source.y) * lt
        } else if (t < 0.4) {
          const lt = (t - 0.3) / 0.1
          x = beam.skullEntry.x + (beam.skullExit.x - beam.skullEntry.x) * lt
          y = beam.skullEntry.y + (beam.skullExit.y - beam.skullEntry.y) * lt
        } else {
          const lt = (t - 0.4) / 0.6
          x = beam.skullExit.x + (beam.target.x - beam.skullExit.x) * lt
          y = beam.skullExit.y + (beam.target.y - beam.skullExit.y) * lt
        }
        apRef.current.position.set(x, y, 0.3)
      }
    }

    // Animate ripple
    if (rippleProgress >= 0 && rippleProgress < 1) {
      const newProgress = rippleProgress + delta * 1.5
      setRippleProgress(Math.min(newProgress, 1))

      if (rippleMaterialRef.current) {
        rippleMaterialRef.current.uniforms.uProgress.value = newProgress
        rippleMaterialRef.current.uniforms.uAlpha.value = 1.0 - newProgress
      }
    }
  })

  const apUniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  const rippleUniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uAlpha: { value: 1 },
  }), [])

  return (
    <group>
      {/* Action Potential particle */}
      {apProgress >= 0 && apProgress < 1 && (
        <mesh ref={apRef} position={[0, 0, 0.3]}>
          <planeGeometry args={[0.5, 0.5]} />
          <shaderMaterial
            ref={apMaterialRef}
            vertexShader={apVertexShader}
            fragmentShader={apFragmentShader}
            uniforms={apUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Impact ripple */}
      {rippleProgress >= 0 && rippleProgress < 1 && (
        <mesh ref={rippleRef} position={[mousePos.x, mousePos.y, 0.15]}>
          <planeGeometry args={[4, 4]} />
          <shaderMaterial
            ref={rippleMaterialRef}
            vertexShader={rippleVertexShader}
            fragmentShader={rippleFragmentShader}
            uniforms={rippleUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
