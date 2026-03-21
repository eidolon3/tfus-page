import { useState, useMemo } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import { trials, type Trial, type TrialCondition } from '../data/trials'

// ── Colours ────────────────────────────────────────────────────────────────────
const COND_COLOR: Record<TrialCondition, string> = {
  depression: '#BF40BF',
  anxiety:    '#a78bfa',
  pain:       '#fb923c',
  motor:      '#00FFFF',
  cognition:  '#34d399',
  other:      '#94a3b8',
}

const STATUS_CFG = {
  recruiting: { label: 'Recruiting', color: '#f97316', glow: '0 0 8px #f9731660' },
  active:     { label: 'Active',     color: '#22c55e', glow: '0 0 8px #22c55e60' },
  completed:  { label: 'Completed',  color: '#475569', glow: 'none' },
  not_yet:    { label: 'Not Yet',    color: '#334155', glow: 'none' },
} as const

const FILTERS: { key: TrialCondition | 'all'; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'depression', label: 'Depression' },
  { key: 'pain',       label: 'Pain' },
  { key: 'motor',      label: 'Motor' },
  { key: 'cognition',  label: 'Cognition' },
  { key: 'anxiety',    label: 'Anxiety' },
  { key: 'other',      label: 'Other' },
]

type SortKey = 'year' | 'condition' | 'status' | 'pi' | 'institution'
type SortDir = 'asc' | 'desc'

const STATUS_ORDER = { recruiting: 0, active: 1, not_yet: 2, completed: 3 }
const COND_ORDER: Record<TrialCondition, number> = {
  depression: 0, anxiety: 1, pain: 2, motor: 3, cognition: 4, other: 5,
}

// ── Year density strip ─────────────────────────────────────────────────────────
function DensityStrip({ filtered }: { filtered: Trial[] }) {
  const years = Array.from({ length: 13 }, (_, i) => 2014 + i)
  const maxCount = Math.max(...years.map(y => filtered.filter(t => t.year === y).length), 1)

  return (
    <div className="flex items-end gap-1 h-10 mb-1">
      {years.map(y => {
        const cnt = filtered.filter(t => t.year === y).length
        const h = cnt > 0 ? Math.max((cnt / maxCount) * 36, 4) : 0
        // dominant condition
        const ts = filtered.filter(t => t.year === y)
        const dom = ts.length
          ? (Object.entries(
              ts.reduce((acc, t) => { acc[t.condition] = (acc[t.condition] || 0) + 1; return acc }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1])[0][0] as TrialCondition)
          : 'other'
        return (
          <div key={y} className="flex flex-col items-center gap-0.5">
            {cnt > 0 && (
              <div
                style={{
                  width: 22,
                  height: h,
                  background: COND_COLOR[dom] + '50',
                  borderTop: `2px solid ${COND_COLOR[dom]}`,
                  borderRadius: '2px 2px 0 0',
                }}
              />
            )}
            <span className="font-mono text-[8px] text-white/15">{y}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Sort header button ─────────────────────────────────────────────────────────
function SortBtn({
  label, col, sortKey, sortDir, onSort,
}: { label: string; col: SortKey; sortKey: SortKey; sortDir: SortDir; onSort: (c: SortKey) => void }) {
  const active = sortKey === col
  return (
    <button
      onClick={() => onSort(col)}
      className={`font-mono text-[9px] tracking-widest uppercase flex items-center gap-1 transition-colors ${
        active ? 'text-[#BF40BF]' : 'text-white/25 hover:text-white/50'
      }`}
    >
      {label}
      <span className="text-[8px]">{active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  )
}

// ── Trial row ──────────────────────────────────────────────────────────────────
function TrialRow({ trial }: { trial: Trial }) {
  const sc = STATUS_CFG[trial.status]
  const cc = COND_COLOR[trial.condition]

  return (
    <a
      href={trial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors cursor-pointer"
    >
      {/* Left accent */}
      <div className="w-[3px] self-stretch rounded-full flex-shrink-0 mt-0.5" style={{ background: cc }} />

      {/* Year + status */}
      <div className="w-14 flex-shrink-0">
        <div className="font-mono text-sm font-bold text-white/80">{trial.year}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: sc.color, boxShadow: sc.glow }}
          />
          <span className="font-mono text-[8px]" style={{ color: sc.color }}>{sc.label}</span>
        </div>
      </div>

      {/* Condition — most prominent */}
      <div className="w-36 flex-shrink-0">
        <div
          className="font-mono text-[11px] font-semibold"
          style={{ color: cc }}
        >
          {trial.conditionLabel}
        </div>
        {trial.frequency_kHz && (
          <div className="font-mono text-[8px] text-white/20 mt-0.5">{trial.frequency_kHz} kHz</div>
        )}
      </div>

      {/* Title + target */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-white/60 leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">
          {trial.title}
        </div>
        <div className="font-mono text-[9px] text-white/30 mt-1">{trial.target}</div>
      </div>

      {/* PI + institution */}
      <div className="w-44 flex-shrink-0 hidden lg:block">
        <div className="text-[10px] text-[#BF40BF]/60">{trial.pi !== 'Unknown' ? trial.pi : ''}</div>
        <div className="text-[10px] text-white/25 mt-0.5 leading-tight">{trial.institution}</div>
      </div>

      {/* Phase */}
      <div className="w-16 flex-shrink-0 hidden xl:block">
        <span className="font-mono text-[8px] text-white/20">{trial.phase || '—'}</span>
      </div>

      {/* Arrow */}
      <div className="font-mono text-[9px] text-white/10 group-hover:text-[#00FFFF]/40 transition-colors flex-shrink-0 self-center">↗</div>
    </a>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Trials() {
  const [filter, setFilter]   = useState<TrialCondition | 'all'>('all')
  const [search, setSearch]   = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('year')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const counts = {
    recruiting: trials.filter(t => t.status === 'recruiting').length,
    active:     trials.filter(t => t.status === 'active').length,
    completed:  trials.filter(t => t.status === 'completed').length,
    total:      trials.length,
  }

  const handleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let out = trials.filter(t => {
      if (filter !== 'all' && t.condition !== filter) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.conditionLabel.toLowerCase().includes(q) ||
        t.target.toLowerCase().includes(q) ||
        t.pi.toLowerCase().includes(q) ||
        t.institution.toLowerCase().includes(q) ||
        t.nct.toLowerCase().includes(q)
      )
    })
    out = [...out].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'year')        cmp = a.year - b.year
      else if (sortKey === 'condition') cmp = COND_ORDER[a.condition] - COND_ORDER[b.condition]
      else if (sortKey === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      else if (sortKey === 'pi')     cmp = a.pi.localeCompare(b.pi)
      else if (sortKey === 'institution') cmp = a.institution.localeCompare(b.institution)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return out
  }, [filter, search, sortKey, sortDir])

  return (
    <PageWrapper
      title="Trials"
      subtitle="Registered clinical trials investigating tFUS / LIFU neuromodulation."
      accentColor="#BF40BF"
    >
      {/* ── Hero counts ── */}
      <div className="flex flex-wrap gap-10 items-end mb-8">
        <div>
          <div className="font-mono text-5xl font-black leading-none" style={{ color: '#f97316', textShadow: '0 0 40px #f9731640' }}>
            {counts.recruiting}
          </div>
          <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mt-1">Recruiting</div>
        </div>
        <div>
          <div className="font-mono text-5xl font-black leading-none" style={{ color: '#22c55e', textShadow: '0 0 40px #22c55e40' }}>
            {counts.active}
          </div>
          <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mt-1">Active</div>
        </div>
        <div>
          <div className="font-mono text-5xl font-black leading-none text-white/20">
            {counts.completed}
          </div>
          <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mt-1">Completed</div>
        </div>
        <div className="ml-auto">
          <div className="font-mono text-5xl font-black leading-none text-white/80">
            {counts.total}
          </div>
          <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mt-1">Total Trials</div>
        </div>
      </div>

      {/* ── Density strip ── */}
      <DensityStrip filtered={filtered} />

      {/* ── Filter + search row ── */}
      <div className="flex flex-wrap items-center gap-2 mt-6 mb-0">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map(f => {
            const cnt = f.key === 'all' ? trials.length : trials.filter(t => t.condition === f.key).length
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="font-mono text-[9px] px-3 py-1 rounded border transition-all"
                style={{
                  borderColor: active ? '#BF40BF60' : 'rgba(255,255,255,0.08)',
                  color: active ? '#BF40BF' : 'rgba(255,255,255,0.35)',
                  background: active ? '#BF40BF12' : 'transparent',
                }}
              >
                {f.label} <span style={{ opacity: 0.4 }}>{cnt}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="ml-auto relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trials..."
            className="font-mono text-[10px] bg-white/[0.03] border border-white/10 rounded px-3 py-1.5 text-white/70 placeholder-white/20 outline-none focus:border-[#BF40BF]/40 transition-colors w-52"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/20 hover:text-white/50"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="mt-4 border border-white/[0.06] rounded-lg overflow-hidden">
        {/* Column headers */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="w-[3px] flex-shrink-0" />
          <div className="w-14 flex-shrink-0">
            <SortBtn label="Year" col="year" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </div>
          <div className="w-36 flex-shrink-0">
            <SortBtn label="Condition" col="condition" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </div>
          <div className="flex-1">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/25">Trial / Target</span>
          </div>
          <div className="w-44 flex-shrink-0 hidden lg:block">
            <SortBtn label="PI / Institution" col="pi" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </div>
          <div className="w-16 flex-shrink-0 hidden xl:block">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/25">Phase</span>
          </div>
          <div className="w-4 flex-shrink-0" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center font-mono text-[11px] text-white/20">
            No trials match your search.
          </div>
        ) : (
          filtered.map(t => <TrialRow key={t.nct} trial={t} />)
        )}
      </div>

      {/* Result count */}
      <div className="mt-3 font-mono text-[9px] text-white/15">
        {filtered.length} of {trials.length} trials
      </div>

      {/* Disclaimer */}
      <p className="mt-10 font-mono text-[9px] text-white/10 leading-relaxed">
        Data sourced from ClinicalTrials.gov. NCT numbers and statuses should be verified directly.
        Last updated March 2026.
      </p>
    </PageWrapper>
  )
}
