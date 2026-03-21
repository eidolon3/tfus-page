import { useState } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/ui/PageWrapper'
import { trials, type Trial, type TrialCondition } from '../data/trials'

// ── Colour mappings ────────────────────────────────────────────────────────────
const conditionColor: Record<TrialCondition, string> = {
  depression: 'text-[#BF40BF] border-[#BF40BF]/30 bg-[#BF40BF]/5',
  anxiety:    'text-purple-400 border-purple-400/30 bg-purple-400/5',
  pain:       'text-amber-400 border-amber-400/30 bg-amber-400/5',
  motor:      'text-[#00FFFF] border-[#00FFFF]/30 bg-[#00FFFF]/5',
  cognition:  'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  other:      'text-white/40 border-white/20 bg-white/5',
}

const conditionDot: Record<TrialCondition, string> = {
  depression: 'bg-[#BF40BF]',
  anxiety:    'bg-purple-400',
  pain:       'bg-amber-400',
  motor:      'bg-[#00FFFF]',
  cognition:  'bg-emerald-400',
  other:      'bg-white/40',
}

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  recruiting:  { label: 'Recruiting',       dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]', text: 'text-emerald-400' },
  active:      { label: 'Active',           dot: 'bg-amber-400',                            text: 'text-amber-400' },
  completed:   { label: 'Completed',        dot: 'bg-white/30',                             text: 'text-white/40' },
  not_yet:     { label: 'Not Yet Open',     dot: 'bg-blue-400/60',                          text: 'text-blue-400/60' },
}

const FILTERS: { key: TrialCondition | 'all'; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'depression', label: 'Depression' },
  { key: 'pain',       label: 'Pain' },
  { key: 'motor',      label: 'Motor' },
  { key: 'cognition',  label: 'Cognition' },
  { key: 'anxiety',    label: 'Anxiety' },
  { key: 'other',      label: 'Other' },
]

// ── Timeline ───────────────────────────────────────────────────────────────────
function TrialsTimeline({ filtered }: { filtered: Trial[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const MIN_YEAR = 2013
  const MAX_YEAR = 2025
  const SPAN = MAX_YEAR - MIN_YEAR

  // Group by year
  const byYear: Record<number, Trial[]> = {}
  for (const t of filtered) {
    if (!byYear[t.year]) byYear[t.year] = []
    byYear[t.year].push(t)
  }

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">Timeline</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {FILTERS.filter(f => f.key !== 'all').map(f => (
          <div key={f.key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${conditionDot[f.key as TrialCondition]}`} />
            <span className="font-mono text-[9px] text-white/30">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline track */}
      <div className="relative px-4 pb-8">
        {/* Axis line */}
        <div className="absolute left-4 right-4 top-6 h-px bg-white/10" />

        {/* Year labels */}
        <div className="relative h-4 mb-4">
          {Array.from({ length: SPAN + 1 }, (_, i) => MIN_YEAR + i).filter(y => y % 2 === 1 || y === MIN_YEAR || y === MAX_YEAR).map(year => (
            <div
              key={year}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${((year - MIN_YEAR) / SPAN) * 100}%` }}
            >
              <span className="font-mono text-[8px] text-white/20">{year}</span>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="relative h-24">
          {filtered.map((trial) => {
            const x = ((trial.year - MIN_YEAR) / SPAN) * 100
            const sc = statusConfig[trial.status]
            const isHov = hovered === trial.nct

            return (
              <div
                key={trial.nct}
                className="absolute transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${x}%`, top: '0%' }}
                onMouseEnter={() => setHovered(trial.nct)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${conditionDot[trial.condition]} ${isHov ? 'scale-150 ring-2 ring-white/20' : 'opacity-70 hover:opacity-100'}`} />

                {/* Hover card */}
                {isHov && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 z-20 pointer-events-none"
                  >
                    <div className="bg-[#0E0E16] border border-white/10 rounded-lg p-3 shadow-2xl">
                      <div className="font-mono text-[8px] text-white/30 mb-1">{trial.nct}</div>
                      <div className={`font-mono text-[9px] border rounded px-1.5 py-px inline-block mb-2 ${conditionColor[trial.condition]}`}>
                        {trial.conditionLabel}
                      </div>
                      <div className="text-[10px] text-white/70 leading-snug mb-2">{trial.target}</div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`font-mono text-[8px] ${sc.text}`}>{sc.label}</span>
                      </div>
                      <div className="font-mono text-[8px] text-white/20 mt-1">{trial.institution}</div>
                    </div>
                    <div className="w-px h-2 bg-white/10 mx-auto" />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Density bars */}
        <div className="relative h-8 mt-2">
          {Object.entries(byYear).map(([year, ts]) => (
            <div
              key={year}
              className="absolute bottom-0 transform -translate-x-1/2 flex flex-col-reverse gap-px"
              style={{ left: `${((Number(year) - MIN_YEAR) / SPAN) * 100}%` }}
            >
              {ts.map((t, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-sm opacity-40 ${conditionDot[t.condition]}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Trial Card ─────────────────────────────────────────────────────────────────
function TrialCard({ trial }: { trial: Trial }) {
  const sc = statusConfig[trial.status]
  const cc = conditionColor[trial.condition]

  return (
    <motion.a
      href={trial.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="block bg-[#0E0E16] border border-white/[0.06] rounded-xl p-5 hover:border-white/15 hover:bg-[#111119] transition-all duration-200 group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[9px] text-white/25 tracking-wider">{trial.nct}</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
          <span className={`font-mono text-[8px] ${sc.text}`}>{sc.label}</span>
        </div>
      </div>

      {/* Condition badge */}
      <div className={`font-mono text-[9px] border rounded px-1.5 py-px inline-block mb-3 ${cc}`}>
        {trial.conditionLabel}
      </div>

      {/* Target */}
      <div className="text-[13px] text-white/80 font-medium mb-1 leading-snug group-hover:text-white transition-colors">
        {trial.target}
      </div>
      <div className="text-[11px] text-white/35 leading-snug mb-4 line-clamp-2">{trial.title}</div>

      {/* Params row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {trial.frequency_kHz && (
          <span className="font-mono text-[9px] text-white/30 bg-white/5 rounded px-1.5 py-px">
            {trial.frequency_kHz} kHz
          </span>
        )}
        <span className="font-mono text-[9px] text-white/30 bg-white/5 rounded px-1.5 py-px">
          {trial.phase}
        </span>
        <span className="font-mono text-[9px] text-white/30 bg-white/5 rounded px-1.5 py-px">
          {trial.year}
        </span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.05]">
        <div className="text-[10px] text-white/40">{trial.institution}</div>
        <div className="text-[10px] text-[#BF40BF]/50 mt-0.5">{trial.pi}</div>
      </div>

      <div className="mt-3 font-mono text-[9px] text-[#00FFFF]/30 group-hover:text-[#00FFFF]/60 transition-colors">
        [clinicaltrials.gov ↗]
      </div>
    </motion.a>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Trials() {
  const [filter, setFilter] = useState<TrialCondition | 'all'>('all')

  const filtered = filter === 'all' ? trials : trials.filter(t => t.condition === filter)

  const counts = {
    recruiting: trials.filter(t => t.status === 'recruiting').length,
    active:     trials.filter(t => t.status === 'active').length,
    completed:  trials.filter(t => t.status === 'completed').length,
  }

  return (
    <PageWrapper
      title="Active Trials"
      subtitle="Registered clinical trials investigating transcranial focused ultrasound neuromodulation."
      accentColor="#00FFFF"
    >
      {/* Status summary row */}
      <div className="flex gap-6 mb-12">
        {[
          { label: 'Recruiting',  count: counts.recruiting, dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]', text: 'text-emerald-400' },
          { label: 'Active',      count: counts.active,     dot: 'bg-amber-400',   text: 'text-amber-400' },
          { label: 'Completed',   count: counts.completed,  dot: 'bg-white/30',    text: 'text-white/30' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className={`font-mono text-[10px] ${s.text}`}>{s.count} {s.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <TrialsTimeline filtered={filtered} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-8">
        {FILTERS.map(f => {
          const count = f.key === 'all' ? trials.length : trials.filter(t => t.condition === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`font-mono text-[10px] px-3 py-1.5 rounded border transition-all ${
                filter === f.key
                  ? 'border-[#00FFFF]/40 text-[#00FFFF] bg-[#00FFFF]/5'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
            >
              {f.label} <span className="opacity-40 ml-1">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((trial, i) => (
          <motion.div
            key={trial.nct}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <TrialCard trial={trial} />
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-12 font-mono text-[9px] text-white/15 leading-relaxed">
        Trial data is manually curated from ClinicalTrials.gov. NCT numbers and status should be verified directly.
        Last updated March 2026.
      </p>
    </PageWrapper>
  )
}
