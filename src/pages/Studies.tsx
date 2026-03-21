import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/ui/PageWrapper'
import StudyDrawer from '../components/ui/StudyDrawer'
import { studies } from '../data/studies'
import type { Study } from '../data/studies'

const studyTypeColor: Record<string, string> = {
  human: 'text-[#00FFFF] border-[#00FFFF]/30',
  animal: 'text-emerald-400 border-emerald-400/30',
  'in vitro': 'text-orange-400 border-orange-400/30',
  review: 'text-white/30 border-white/10',
  computational: 'text-purple-400 border-purple-400/30',
}

function USParamsCell({ study }: { study: Study }) {
  const rows: [string, string][] = [
    ['freq', study.frequency_kHz != null ? `${study.frequency_kHz} kHz` : '—'],
    ['prf', study.prf_Hz != null ? `${study.prf_Hz} Hz` : '—'],
    ['isppa', study.isppa_freewater != null ? `${study.isppa_freewater} W/cm²` : '—'],
    ['dc', study.dutyCycle_pct != null ? `${study.dutyCycle_pct}%` : '—'],
    ['pd', study.pulseDuration_ms != null ? `${study.pulseDuration_ms} ms` : '—'],
    ['dur', study.sonicationDuration_s != null ? `${study.sonicationDuration_s} s` : '—'],
  ]
  return (
    <div className="space-y-0.5">
      {rows.map(([label, val]) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <span className="font-mono text-[8px] text-white/20 w-7 shrink-0">{label}</span>
          <span className="font-mono text-[10px] text-white/60">{val}</span>
        </div>
      ))}
    </div>
  )
}

type SortKey = keyof Study
type SortDir = 'asc' | 'desc'

export default function Studies() {
  const [selected, setSelected] = useState<Study | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('year')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [methOpen, setMethOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...studies]

    if (typeFilter !== 'all') {
      result = result.filter(s => s.studyType === typeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        [s.firstAuthor, s.targetRegion, s.keyFindings, s.species, s.readOut]
          .some(v => v?.toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [search, sortKey, sortDir, typeFilter])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortTh = ({ label, colKey, className = '' }: { label: string; colKey: SortKey; className?: string }) => (
    <th
      onClick={() => handleSort(colKey)}
      className={`px-3 py-3 font-mono text-[9px] tracking-[0.15em] uppercase text-white/30
        cursor-pointer hover:text-white/50 select-none transition-colors whitespace-nowrap ${className}`}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === colKey && (
          <span className="text-[#BF40BF]">{sortDir === 'asc' ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  )

  const studyTypes = ['all', 'human', 'animal']

  return (
    <PageWrapper
      title="Studies"
      subtitle="Compiled database of all tFUS / LIFU trials. Click any row for full parameters."
      accentColor="#9B30FF"
    >
      {/* Methodology */}
      <div className="mb-8">
        <button
          onClick={() => setMethOpen(o => !o)}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-white/50 transition-colors"
        >
          <span className={`transition-transform duration-200 ${methOpen ? 'rotate-90' : ''}`}>▶</span>
          Methodology
        </button>
        <AnimatePresence>
          {methOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 pl-4 border-l border-[#BF40BF]/20 space-y-3 max-w-2xl">
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">01 — Study Collection.</span>{' '}
                  I initially attempted to manually find every LIFU trial on PubMed, but a truly exhaustive search would have taken far too long. Instead, I sourced studies from three systematic reviews — Kim et al. (2021), Pellow et al. (2024), and Caffaratti et al. (2025) — as well as a curated list by Sarah Constantin. To capture the newest papers, I manually scraped PubMed (2024–2026) using the search terms <span className="text-white/55">"transcranial focused ultrasound"[Title] OR "low intensity focused ultrasound"[Title] OR tFUS[Title] OR LIFU[Title]</span>.
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">02 — DOI Matching.</span>{' '}
                  Each study was matched to a DOI using Crossref's simple text query API, enabling systematic import and deduplication.
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">03 — PDF Acquisition.</span>{' '}
                  PDFs were retrieved via Zotero using institutional access (UIUC).
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">04 — Parameter Extraction.</span>{' '}
                  Ultrasound parameters were extracted from each PDF using the Claude API. Each study was parsed for ~29 variables spanning acoustic, protocol, and outcome fields.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm tracking-widest uppercase text-white/50">
            Publications
            <span className="ml-2 text-[#BF40BF] text-xs">[{filtered.length}]</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Type filter pills */}
          <div className="flex gap-1">
            {studyTypes.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`font-mono text-[9px] px-2 py-1 rounded border transition-colors ${
                  typeFilter === t
                    ? 'border-[#BF40BF]/50 text-[#BF40BF] bg-[#BF40BF]/10'
                    : 'border-white/10 text-white/30 hover:text-white/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-white/[0.03] border border-white/10 rounded px-3 py-1.5
                text-xs font-mono text-white/70 placeholder:text-white/20
                focus:outline-none focus:border-[#BF40BF]/30 w-44 transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/15 text-[10px] font-mono">/</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <SortTh label="Year" colKey="year" className="w-14" />
              <SortTh label="First Author" colKey="firstAuthor" />
              <SortTh label="Species" colKey="species" />
              <SortTh label="Target Region" colKey="targetRegion" />
              <th className="px-3 py-3 font-mono text-[9px] tracking-[0.15em] uppercase text-white/30 whitespace-nowrap">
                US Parameters
              </th>
              <SortTh label="Read-Out" colKey="readOut" />
              <SortTh label="N" colKey="n" className="w-12" />
              <th className="px-3 py-3 font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">
                Key Findings
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((study, i) => (
                <motion.tr
                  key={study.doi || i}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.015 }}
                  onClick={() => setSelected(study)}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Year */}
                  <td className="px-3 py-3 font-mono text-xs text-white/60 group-hover:text-white/80 transition-colors w-14">
                    {study.year}
                  </td>

                  {/* First Author */}
                  <td className="px-3 py-3 text-xs text-white/70 group-hover:text-white/90 whitespace-nowrap">
                    {study.firstAuthor}
                  </td>

                  {/* Species */}
                  <td className={`px-3 py-3 text-xs whitespace-nowrap ${study.species?.toLowerCase() === 'human' ? 'text-[#00FFFF]' : 'text-blue-400'}`}>
                    {study.species}
                  </td>

                  {/* Target Region */}
                  <td className="px-3 py-3 text-xs text-white/60 group-hover:text-white/80 max-w-[140px]">
                    <span className="line-clamp-2">{study.targetRegion}</span>
                  </td>

                  {/* US Parameters — stacked */}
                  <td className="px-3 py-3">
                    <USParamsCell study={study} />
                  </td>

                  {/* Read-Out */}
                  <td className="px-3 py-3 text-xs text-white/50 group-hover:text-white/70 max-w-[120px]">
                    <span className="line-clamp-2">{study.readOut}</span>
                  </td>

                  {/* N */}
                  <td className="px-3 py-3 font-mono text-xs text-white/40 group-hover:text-white/60 w-12">
                    {study.n ?? '—'}
                  </td>

                  {/* Key Findings */}
                  <td className="px-3 py-3 text-[11px] text-white/40 group-hover:text-white/60 max-w-[260px]">
                    <span className="line-clamp-3">{study.keyFindings}</span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center font-mono text-xs text-white/20">
            No results found
          </div>
        )}
      </div>

      <StudyDrawer study={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  )
}
