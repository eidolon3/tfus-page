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
  recruiting: { label: 'Recruiting',         color: '#f97316', glow: '0 0 8px #f9731660' },
  active:     { label: 'Active',             color: '#22c55e', glow: '0 0 8px #22c55e60' },
  completed:  { label: 'Completed',          color: '#3b82f6', glow: '0 0 8px #3b82f660' },
  not_yet:    { label: 'Not Yet Recruiting', color: '#334155', glow: 'none' },
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

type SortKey = 'year' | 'condition' | 'status' | 'n' | 'institution'
type SortDir = 'asc' | 'desc'

const STATUS_ORDER = { recruiting: 0, active: 1, not_yet: 2, completed: 3 }
const COND_ORDER: Record<TrialCondition, number> = {
  depression: 0, anxiety: 1, pain: 2, motor: 3, cognition: 4, other: 5,
}

// ── Density hero ───────────────────────────────────────────────────────────────
// Interpolate purple (#BF40BF) → cyan (#00FFFF) across years
function barColor(t: number): string {
  const r = Math.round(191 * (1 - t))
  const g = Math.round(64  + 191 * t)
  const b = Math.round(191 +  64 * t)
  return `rgb(${r},${g},${b})`
}

function DensityHero({ filtered }: { filtered: Trial[] }) {
  const allYears = Array.from(new Set(trials.map(t => t.year))).sort()
  const maxCount = Math.max(...allYears.map(y => filtered.filter(t => t.year === y).length), 1)

  return (
    <div className="w-full mb-10">
      <div className="w-full" style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex items-end w-full" style={{ height: 120, gap: 3 }}>
        {allYears.map((y, i) => {
          const cnt = filtered.filter(t => t.year === y).length
          const barH = cnt > 0 ? Math.max((cnt / maxCount) * 108, 8) : 2
          const t = i / Math.max(allYears.length - 1, 1)
          const color = barColor(t)
          return (
            <div key={y} className="flex flex-col items-center justify-end" style={{ flex: 1, height: 120 }}>
              <div
                title={`${y}: ${cnt} trial${cnt !== 1 ? 's' : ''}`}
                style={{
                  width: '100%',
                  height: barH,
                  background: cnt > 0 ? `linear-gradient(to top, ${color}18, ${color}60)` : 'rgba(255,255,255,0.02)',
                  borderTop:   cnt > 0 ? `1px solid ${color}dd` : 'none',
                  borderLeft:  cnt > 0 ? `1px solid ${color}18` : 'none',
                  borderRight: cnt > 0 ? `1px solid ${color}18` : 'none',
                  borderRadius: '1px 1px 0 0',
                  boxShadow: cnt > 0 ? `0 0 20px ${color}22, 0 -4px 22px ${color}18` : 'none',
                  transition: 'height 0.3s ease',
                }}
              />
              <span className="font-mono mt-2" style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>
                {y}
              </span>
            </div>
          )
        })}
      </div>
      <div className="w-full" style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
    </div>
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
      className="group block border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="grid items-center gap-5 px-3 py-3.5"
        style={{ gridTemplateColumns: '3px 96px 1fr 160px 130px 52px 110px' }}
      >
        {/* accent bar */}
        <div style={{ width: 3, height: 40, background: cc, borderRadius: 2 }} />

        {/* year + condition */}
        <div>
          <div className="font-mono text-[15px] font-bold leading-none" style={{ color: '#f1f5f9' }}>
            {trial.year}
          </div>
          <div className="font-mono mt-1" style={{ fontSize: 10, color: cc, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {trial.conditionLabel}
          </div>
        </div>

        {/* title */}
        <div
          className="text-[12px] leading-snug line-clamp-2 group-hover:text-white/80 transition-colors"
          style={{ color: 'rgba(203,213,225,0.65)' }}
        >
          {trial.title}
        </div>

        {/* institution */}
        <div className="hidden lg:block text-[10px] leading-tight" style={{ color: '#4b5563' }}>
          {trial.institution}
        </div>

        {/* PI */}
        <div className="hidden lg:block text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {trial.pi ?? <span style={{ color: 'rgba(255,255,255,0.1)' }}>—</span>}
        </div>

        {/* N */}
        <div className="hidden lg:block text-center">
          <div className="font-mono text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {trial.n ?? '—'}
          </div>
          <div className="font-mono text-[7px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>n</div>
        </div>

        {/* status */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.color, boxShadow: sc.glow }} />
          <span className="font-mono" style={{ fontSize: 9, color: sc.color }}>{sc.label}</span>
        </div>
      </div>
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
        t.institution.toLowerCase().includes(q) ||
        t.nct.toLowerCase().includes(q) ||
        (t.pi?.toLowerCase().includes(q) ?? false)
      )
    })
    out = [...out].sort((a, b) => {
      let cmp = 0
      if      (sortKey === 'year')        cmp = a.year - b.year
      else if (sortKey === 'condition')   cmp = COND_ORDER[a.condition] - COND_ORDER[b.condition]
      else if (sortKey === 'status')      cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      else if (sortKey === 'n')           cmp = (a.n ?? 0) - (b.n ?? 0)
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
      <DensityHero filtered={filtered} />

      {/* ── Status counts ── */}
      <div className="flex flex-wrap gap-10 items-end mb-10">
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
          <div className="font-mono text-5xl font-black leading-none" style={{ color: '#3b82f6', textShadow: '0 0 40px #3b82f640' }}>
            {counts.completed}
          </div>
          <div className="font-mono text-[9px] tracking-widest uppercase mt-1" style={{ color: '#3b82f680' }}>Completed</div>
        </div>
        <div className="ml-auto">
          <div className="font-mono text-5xl font-black leading-none text-white/80">{counts.total}</div>
          <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mt-1">Total Trials</div>
        </div>
      </div>

      {/* ── Filter + sort + search ── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map(f => {
            const cnt = f.key === 'all' ? trials.length : trials.filter(t => t.condition === f.key).length
            const active = filter === f.key
            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="font-mono text-[9px] px-3 py-1 rounded border transition-all"
                style={{
                  borderColor: active ? '#BF40BF60' : 'rgba(255,255,255,0.08)',
                  color:       active ? '#BF40BF'   : 'rgba(255,255,255,0.35)',
                  background:  active ? '#BF40BF12' : 'transparent',
                }}>
                {f.label} <span style={{ opacity: 0.4 }}>{cnt}</span>
              </button>
            )
          })}
        </div>

        <div className="flex gap-1.5 ml-3">
          {([
            { key: 'year'      as SortKey, label: 'Year' },
            { key: 'status'    as SortKey, label: 'Status' },
            { key: 'condition' as SortKey, label: 'Condition' },
            { key: 'n'         as SortKey, label: 'N' },
          ]).map(({ key, label }) => {
            const active = sortKey === key
            return (
              <button key={key} onClick={() => handleSort(key)}
                className="font-mono text-[9px] px-2.5 py-1 rounded border transition-all flex items-center gap-0.5"
                style={{
                  borderColor: active ? '#BF40BF40' : 'rgba(255,255,255,0.06)',
                  color:       active ? '#BF40BF'   : 'rgba(255,255,255,0.18)',
                  background:  active ? '#BF40BF0c' : 'transparent',
                }}>
                {label}
                <span style={{ fontSize: 7 }}>{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
              </button>
            )
          })}
        </div>

        <div className="ml-auto relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trials..."
            className="font-mono text-[10px] bg-white/[0.03] border border-white/10 rounded px-3 py-1.5 text-white/70 placeholder-white/20 outline-none focus:border-[#BF40BF]/40 transition-colors w-52"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/20 hover:text-white/50">
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Column labels ── */}
      <div className="grid items-center gap-5 px-3 py-1.5 mb-0.5"
        style={{ gridTemplateColumns: '3px 96px 1fr 160px 130px 52px 110px' }}>
        <div />
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15">Year</span>
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15">Trial</span>
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15 hidden lg:block">Sponsor</span>
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15 hidden lg:block">PI</span>
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15 hidden lg:block text-center">N</span>
        <span className="font-mono text-[8px] tracking-widest uppercase text-white/15">Status</span>
      </div>

      {/* ── Rows ── */}
      <div className="border border-white/[0.06] rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center font-mono text-[11px] text-white/20">
            No trials match your search.
          </div>
        ) : (
          filtered.map(t => <TrialRow key={t.nct} trial={t} />)
        )}
      </div>

      <div className="mt-3 font-mono text-[9px] text-white/15">
        {filtered.length} of {trials.length} trials
      </div>

      <p className="mt-10 font-mono text-[9px] text-white/10 leading-relaxed">
        Data sourced from ClinicalTrials.gov (ctg-studies download). Statuses reflect the download date.
      </p>
    </PageWrapper>
  )
}
