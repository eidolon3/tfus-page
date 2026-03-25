import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UltrasoundCanvas from '../components/landing/UltrasoundCanvas'
import ContentSection from '../components/landing/ContentSection'

const NAV = [
  { label: 'Foundations',    path: '/papers' },
  { label: 'Studies',       path: '/studies' },
  { label: 'Trials',        path: '/trials' },
  { label: 'Industry',      path: '/industry' },
]

export default function MockupTextStack() {
  const navigate = useNavigate()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="w-full bg-[#0A0A0F]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative w-full h-screen overflow-hidden">

        {/* Interference pattern background */}
        {dimensions.width > 0 && (
          <UltrasoundCanvas width={dimensions.width} height={dimensions.height} />
        )}

        {/* Fade-in text stack — centered */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-6">
            {NAV.map((n, i) => (
              <motion.button
                key={n.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(n.path)}
                className="font-mono text-[19px] tracking-[0.35em] uppercase transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#BF40BF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {n.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* About Me — top right */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          onClick={() => navigate('/about')}
          className="absolute top-8 right-8 z-40 font-mono text-[11px] tracking-[0.2em] text-white/25 hover:text-[#BF40BF] transition-colors uppercase"
        >
          About Me
        </motion.button>

        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 pointer-events-none z-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-center"
          >
            <h1 className="font-mono text-[14px] tracking-[0.4em] uppercase text-white/30 mb-3">
              Transcranial Focused Ultrasound
            </h1>
            <p className="font-mono text-[12px] tracking-[0.15em] text-white/15">
              Click to explore
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-8 right-8 z-40 pointer-events-none flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-1">
            <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12))' }} />
            <div style={{ width: 4, height: 4, borderRight: '1px solid rgba(255,255,255,0.18)', borderBottom: '1px solid rgba(255,255,255,0.18)', transform: 'rotate(45deg)' }} />
          </motion.div>
          <span className="font-mono text-[7px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.12)' }}>scroll</span>
        </motion.div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <ContentSection />
    </div>
  )
}
