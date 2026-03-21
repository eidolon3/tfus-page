import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UltrasoundCanvas from '../components/landing/UltrasoundCanvas'
import NeuronNetwork from '../components/landing/NeuronNetwork'

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleNodeClick = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  const CATEGORIES = ['Organizations', 'Studies', 'Timeline', 'Trials']

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#0A0A0F]">
      {/* Ultrasound ripple layer (bottom — behind neurons) */}
      {dimensions.width > 0 && (
        <UltrasoundCanvas width={dimensions.width} height={dimensions.height} />
      )}

      {/* Neuron network layer (on top — interactive) */}
      {dimensions.width > 0 && (
        <NeuronNetwork
          width={dimensions.width}
          height={dimensions.height}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoveredNode}
        />
      )}

      {/* Title text */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none z-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="font-mono text-[11px] tracking-[0.4em] uppercase text-white/30 mb-3">
            Transcranial Focused Ultrasound
          </h1>
          <p className="font-mono text-[10px] tracking-[0.15em] text-white/15">
            Click a neuron to explore &middot; Move cursor for ultrasound
          </p>
        </motion.div>
      </div>

      {/* Hovered node indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredNode !== null ? 1 : 0 }}
        className="absolute top-24 right-6 z-40 pointer-events-none"
      >
        {hoveredNode !== null && (
          <div className="font-mono text-[10px] space-y-1.5">
            <div className="text-white/20 tracking-[0.2em] uppercase text-[8px]">Module</div>
            <div className="text-[#00FFFF]">{CATEGORIES[hoveredNode]}</div>
          </div>
        )}
      </motion.div>

      {/* Bottom nav link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <button
          onClick={() => navigate('/about')}
          className="font-mono text-[9px] tracking-[0.2em] text-white/25 hover:text-[#BF40BF] transition-colors uppercase"
        >
          About Me
        </button>
      </motion.div>

      {/* Subtle scan line overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  )
}
