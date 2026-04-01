import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/ui/PageWrapper'
import StudyDrawer from '../components/ui/StudyDrawer'
import { studies } from '../data/studies'
import type { Study } from '../data/studies'

const speciesColor = (species: string) => {
  const s = species?.toLowerCase()
  if (s === 'human') return 'text-[#00FFFF]'
  if (s === 'mouse' || s === 'rat' || s === 'sheep' || s === 'swine' || s === 'pig' || s === 'monkey' || s === 'primate') return 'text-emerald-400'
  return 'text-blue-400'
}

const effectColor = (effect: string) => {
  const e = effect?.toLowerCase()
  if (e === 'excitatory') return 'text-amber-400'
  if (e === 'inhibitory') return 'text-blue-400'
  if (e === 'mixed') return 'text-purple-400'
  return 'text-white/30'
}

function USParamsCell({ study }: { study: Study }) {
  const rows: [string, string][] = [
    ['freq', study.frequency_kHz != null ? `${study.frequency_kHz} kHz` : '—'],
    ['prf',  study.prf_Hz != null ? `${study.prf_Hz} Hz` : '—'],
    ['isppa', study.isppa_freewater != null ? `${study.isppa_freewater} W/cm²` : '—'],
    ['dc',   study.dutyCycle_pct != null ? `${study.dutyCycle_pct}%` : '—'],
    ['pd',   study.pulseDuration_ms != null ? `${study.pulseDuration_ms} ms` : '—'],
    ['dur',  study.sonicationDuration_s != null ? `${study.sonicationDuration_s} s` : '—'],
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

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const Sup = ({ n, href }: { n: number; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#BF40BF]/70 hover:text-[#BF40BF] transition-colors align-super text-[8px] ml-0.5"
  >
    [{n}]
  </a>
)

export default function Studies() {
  const [selected, setSelected] = useState<Study | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('significance')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [effectFilter, setEffectFilter] = useState<string>('all')
  const [methOpen, setMethOpen] = useState(false)
  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  const search = useDebounce(searchInput, 150)

  const filtered = useMemo(() => {
    let result = [...studies]

    if (typeFilter !== 'all') {
      result = result.filter(s => s.studyType === typeFilter)
    }

    if (effectFilter !== 'all') {
      result = result.filter(s => s.excitatoryInhibitory?.toLowerCase() === effectFilter)
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
  }, [search, sortKey, sortDir, typeFilter, effectFilter])

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

  const studyTypes = ['all', 'human', 'animal', 'in vitro', 'computational']

  return (
    <PageWrapper
      title="Studies"
      subtitle="Compiled database of tFUS / LIFU neuromodulation studies. Click any row for full parameters."
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
                  I sourced studies from three systematic review articles — Kim et al. (2021)
                  <Sup n={1} href="https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.620863/full" />,
                  {' '}Pellow et al. (2024)
                  <Sup n={2} href="https://www.brainstimjrnl.com/action/showPdf?pii=S1935-861X%2824%2900103-7" />,
                  {' '}and Caffaratti et al. (2025)
                  <Sup n={3} href="https://elifesciences.org/reviewed-preprints/100827v3" /> —
                  {' '}as well as an article by Sarah Constantin
                  <Sup n={4} href="https://sarahconstantin.substack.com/p/all-the-latest-human-tfus-studies" />.
                  {' '}To cover the latest papers, I then manually scraped all studies on PubMed between 2024–2026 using the search term{' '}
                  <span className="text-white/55">"transcranial focused ultrasound"[Title] OR "low intensity focused ultrasound"[Title] OR tFUS[Title] OR LIFU[Title]</span>.
                  {' '}After removing non-neuromodulation studies, duplicates, etc., the total count came to 232 individual trials. 16 additional trials from major groups (Kubanek, Sanguinetti, etc.) that slipped through the cracks were also added.
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">02 — DOI Matching & PDF Acquisition.</span>{' '}
                  I used Crossref's simple text query to match each study with a DOI. I then used Zotero along with my institutional access (UIUC) to download PDFs of each study. For the many studies Zotero could not automatically find, I manually hunted them down.
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">03 — Parameter Extraction.</span>{' '}
                  I wrote a script that loops through each study, extracts the text from the PDF of that study, and makes an API call to Gemini 2.5 Flash with a detailed prompt to extract listed parameters in JSON format. Included in the prompt were instructions to leave parameters blank if they weren't included in the study, to convert certain parameters to standardized units if needed, and a guide on how to calculate certain parameters. Extracted parameters were appended to the CSV file that the table uses.
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white/60">04 — QA.</span>{' '}
                  For QA, I randomly selected 8 random papers, with two manually chosen major papers (Legon 2014 and Legon 2018), and manually checked the correctness of the extracted parameters for those studies. I found 5 errors amongst ~200 field checks, giving an estimated <span className="text-white/60">~2.5% error rate</span>.
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

          {/* Effect filter pills */}
          <div className="flex gap-1">
            {['all', 'excitatory', 'inhibitory'].map(t => (
              <button
                key={t}
                onClick={() => setEffectFilter(t)}
                className={`font-mono text-[9px] px-2 py-1 rounded border transition-colors ${
                  effectFilter === t
                    ? t === 'excitatory' ? 'border-amber-400/50 text-amber-400 bg-amber-400/10'
                    : t === 'inhibitory' ? 'border-blue-400/50 text-blue-400 bg-blue-400/10'
                    : 'border-[#BF40BF]/50 text-[#BF40BF] bg-[#BF40BF]/10'
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
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
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
              <SortTh label="Effect" colKey="excitatoryInhibitory" />
              <th className="px-3 py-3 font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">
                Key Findings
              </th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {filtered.map((study, i) => (
              <tr
                key={study.doi || i}
                onClick={() => setSelected(study)}
                className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="px-3 py-3 font-mono text-xs text-white/60 group-hover:text-white/80 transition-colors w-14">
                  {study.year}
                </td>
                <td className="px-3 py-3 text-xs text-white/70 group-hover:text-white/90 whitespace-nowrap">
                  {study.firstAuthor}
                </td>
                <td className={`px-3 py-3 text-xs whitespace-nowrap ${speciesColor(study.species)}`}>
                  {study.species}
                </td>
                <td className="px-3 py-3 text-xs text-white/60 group-hover:text-white/80 max-w-[140px]">
                  <span className="line-clamp-2">{study.targetRegion}</span>
                </td>
                <td className="px-3 py-3">
                  <USParamsCell study={study} />
                </td>
                <td className="px-3 py-3 text-xs text-white/50 group-hover:text-white/70 max-w-[120px]">
                  <span className="line-clamp-2">{study.readOut}</span>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-white/40 group-hover:text-white/60 w-12">
                  {study.n ?? '—'}
                </td>
                <td className={`px-3 py-3 text-xs whitespace-nowrap ${effectColor(study.excitatoryInhibitory)}`}>
                  {study.excitatoryInhibitory || '—'}
                </td>
                <td className="px-3 py-3 text-[11px] text-white/40 group-hover:text-white/60 max-w-[260px]">
                  <span className="line-clamp-3">{study.keyFindings}</span>
                </td>
              </tr>
            ))}
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
