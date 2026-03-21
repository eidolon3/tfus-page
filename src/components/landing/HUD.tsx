import { motion, AnimatePresence } from 'framer-motion'

interface HUDProps {
  focalDepth: number
  frequency: number
  hoveredNode: number | null
  intensity: number
}

const CATEGORIES = ['Organizations', 'Studies', 'Technology', 'Open Questions']

export default function HUD({ focalDepth, frequency, hoveredNode, intensity }: HUDProps) {
  const isLocked = hoveredNode !== null

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="absolute top-24 right-6 z-20 pointer-events-none"
    >
      <div className="font-mono text-[10px] space-y-3 select-none">
        {/* Focal Depth */}
        <div className="flex items-center gap-2">
          <span className="text-white/30 tracking-widest uppercase">Depth</span>
          <span className="text-[#BF40BF] tabular-nums">
            {focalDepth.toFixed(1)}
            <span className="text-white/20 ml-0.5">mm</span>
          </span>
        </div>

        {/* Frequency */}
        <div className="flex items-center gap-2">
          <span className="text-white/30 tracking-widest uppercase">Freq</span>
          <span className="text-[#BF40BF] tabular-nums">
            {frequency.toFixed(0)}
            <span className="text-white/20 ml-0.5">kHz</span>
          </span>
        </div>

        {/* Intensity */}
        <div className="flex items-center gap-2">
          <span className="text-white/30 tracking-widest uppercase">I<sub>sppa</sub></span>
          <span className="text-[#BF40BF] tabular-nums">
            {(intensity * 720).toFixed(0)}
            <span className="text-white/20 ml-0.5">mW/cm²</span>
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Target Status */}
        <div className="flex items-center gap-2">
          <span className="text-white/30 tracking-widest uppercase">Target</span>
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.span
                key="locked"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-[#00FFFF] flex items-center gap-1"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-pulse" />
                LOCKED
              </motion.span>
            ) : (
              <motion.span
                key="steering"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-[#BF40BF]/60"
              >
                Steering
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Active Category */}
        <AnimatePresence>
          {hoveredNode !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-[#00FFFF]/10">
                <span className="text-white/30 tracking-widest uppercase text-[9px]">Module</span>
                <div className="text-[#00FFFF] text-[11px] mt-0.5">
                  {CATEGORIES[hoveredNode]}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
