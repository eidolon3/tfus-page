import { motion } from 'framer-motion'

const CATEGORIES = [
  { label: 'Organizations', shortLabel: 'ORG', path: '/organizations' },
  { label: 'Studies', shortLabel: 'STD', path: '/studies' },
  { label: 'Technology', shortLabel: 'TECH', path: '/technology' },
  { label: 'Open Questions', shortLabel: 'MISC', path: '/misc' },
]

// CSS positions matching the 3D node positions (approximated)
const LABEL_POSITIONS = [
  { top: '18%', left: '12%' },
  { top: '6%', left: '32%' },
  { top: '6%', right: '32%' },
  { top: '18%', right: '12%' },
]

interface NodeLabelsProps {
  hoveredNode: number | null
  onClick: (path: string) => void
}

export default function NodeLabels({ hoveredNode, onClick }: NodeLabelsProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {CATEGORIES.map((cat, i) => {
        const pos = LABEL_POSITIONS[i]
        const isHovered = hoveredNode === i

        return (
          <motion.button
            key={cat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.8, delay: 2 + i * 0.15 }}
            onClick={() => onClick(cat.path)}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              ...pos,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`
              font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5
              border rounded transition-all duration-300
              ${isHovered
                ? 'border-[#00FFFF]/40 text-[#00FFFF] bg-[#00FFFF]/5 shadow-[0_0_20px_rgba(0,255,255,0.1)]'
                : 'border-white/10 text-white/40 bg-white/[0.02] hover:border-[#BF40BF]/30 hover:text-white/60'
              }
            `}>
              <span className="text-[8px] text-white/20 mr-1.5">{String(i + 1).padStart(2, '0')}</span>
              {cat.label}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
