import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Study } from '../../data/studies'

interface StudyDrawerProps {
  study: Study | null
  onClose: () => void
}

function fmt(val: number | null | undefined, unit = ''): string {
  if (val == null) return '—'
  return `${val}${unit}`
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-white/[0.04]">
      <span className="font-mono text-[10px] text-white/30 tracking-wide shrink-0 pt-0.5">{label}</span>
      <span className="text-xs text-white/70 text-right">{value ?? '—'}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#BF40BF]/70">{title}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div>{children}</div>
    </div>
  )
}

const studyTypeColor: Record<string, string> = {
  human: 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/20',
  animal: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'in vitro': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  review: 'text-white/40 bg-white/5 border-white/10',
  computational: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

export default function StudyDrawer({ study, onClose }: StudyDrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {study && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ background: '#0C0C12', borderLeft: '1px solid rgba(191,64,191,0.15)' }}
          >
            {/* Drawer header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.06] shrink-0">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">Study</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${studyTypeColor[study.studyType] || studyTypeColor.review}`}>
                    {study.studyType}
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-snug">
                  {study.firstAuthor} et al., {study.year}
                </p>
                {study.doi && (
                  <a
                    href={`https://doi.org/${study.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#BF40BF]/50 hover:text-[#BF40BF] transition-colors mt-1 inline-block"
                  >
                    {study.doi} ↗
                  </a>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/20 hover:text-white/60 transition-colors font-mono text-lg leading-none mt-1 shrink-0"
              >
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <Section title="Identity">
                <Row label="DOI" value={
                  <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noopener noreferrer"
                    className="text-[#BF40BF]/70 hover:text-[#BF40BF] transition-colors">
                    {study.doi || '—'}
                  </a>
                } />
                <Row label="Year" value={study.year} />
                <Row label="Study Type" value={study.studyType} />
                <Row label="First Author" value={study.firstAuthor} />
              </Section>

              <Section title="Subject">
                <Row label="Species" value={study.species} />
                <Row label="N" value={fmt(study.n)} />
                <Row label="Target Region" value={study.targetRegion} />
              </Section>

              <Section title="Acoustic Parameters">
                <Row label="Frequency" value={fmt(study.frequency_kHz, ' kHz')} />
                <Row label="PRF" value={fmt(study.prf_Hz, ' Hz')} />
                <Row label="ISPPA (free water)" value={fmt(study.isppa_freewater, ' W/cm²')} />
                <Row label="ISPTA (free water)" value={fmt(study.ispta_freewater, ' mW/cm²')} />
                <Row label="ISPPA (in situ)" value={fmt(study.isppa_insitu, ' W/cm²')} />
                <Row label="ISPTA (in situ)" value={fmt(study.ispta_insitu, ' mW/cm²')} />
                <Row label="MI" value={fmt(study.mi)} />
                <Row label="Pulse Duration" value={fmt(study.pulseDuration_ms, ' ms')} />
                <Row label="Duty Cycle" value={fmt(study.dutyCycle_pct, '%')} />
                {study.pulseTrainDuration_ms != null && (
                  <Row label="Pulse Train Duration" value={fmt(study.pulseTrainDuration_ms, ' ms')} />
                )}
                {study.ptrf_Hz != null && (
                  <Row label="PTRF" value={fmt(study.ptrf_Hz, ' Hz')} />
                )}
                <Row label="Sonication Duration" value={fmt(study.sonicationDuration_s, ' s')} />
                <Row label="ISI" value={fmt(study.isi_s, ' s')} />
              </Section>

              <Section title="Protocol">
                <Row label="Num Sessions" value={fmt(study.numSessions)} />
                <Row label="Online / Offline" value={study.onlineOffline ?? '—'} />
                <Row label="Excitatory / Inhibitory" value={study.excitatoryInhibitory || '—'} />
                <Row label="Read-Out" value={study.readOut} />
              </Section>

              <Section title="Outcomes">
                <div className="text-xs text-white/60 leading-relaxed pt-1 pb-3">
                  {study.keyFindings || '—'}
                </div>
                {study.secondaryFindings && (
                  <div className="text-[11px] text-white/40 leading-relaxed pt-2 border-t border-white/[0.04]">
                    <span className="font-mono text-[9px] text-white/20 tracking-wide uppercase block mb-1">Secondary findings</span>
                    {study.secondaryFindings}
                  </div>
                )}
              </Section>

              <Section title="Misc">
                <Row label="Transducer Type" value={study.transducerType} />
                <Row label="In Situ Method" value={study.inSituMethod} />
                {study.otherNotes && (
                  <div className="text-[11px] text-white/40 leading-relaxed pt-2">
                    {study.otherNotes}
                  </div>
                )}
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
