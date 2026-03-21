import { useState } from 'react'
import { trials } from '../data/trials'
import type { Trial, TrialCondition } from '../data/trials'

// ─── shared helpers ───────────────────────────────────────────────────────────
const COND_COLOR: Record<TrialCondition, string> = {
  depression: '#a78bfa',
  pain:       '#f97316',
  motor:      '#22d3ee',
  cognition:  '#34d399',
  anxiety:    '#fb923c',
  other:      '#94a3b8',
}
const STATUS_COLOR = { recruiting: '#22d3ee', active: '#a78bfa', completed: '#4b5563', not_yet: '#374151' }
const STATUS_LABEL = { recruiting: 'Recruiting', active: 'Active', completed: 'Completed', not_yet: 'Not Yet' }

const conditions: TrialCondition[] = ['depression', 'pain', 'motor', 'cognition', 'anxiety', 'other']
const years = Array.from(new Set(trials.map(t => t.year))).sort()

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN A — "PULSE LINE"
// Hero: full-width glowing horizontal timeline. Status bar. 3-col card grid.
// ═══════════════════════════════════════════════════════════════════════════════
function DesignA() {
  const [filter, setFilter] = useState<TrialCondition | 'all'>('all')
  const [hovered, setHovered] = useState<string | null>(null)
  const filtered = filter === 'all' ? trials : trials.filter(t => t.condition === filter)

  const minY = Math.min(...years)
  const maxY = Math.max(...years)
  const pct = (y: number) => ((y - minY) / (maxY - minY)) * 100

  const counts = {
    recruiting: trials.filter(t => t.status === 'recruiting').length,
    active:     trials.filter(t => t.status === 'active').length,
    completed:  trials.filter(t => t.status === 'completed').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'monospace', padding: '2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: 2, color: '#f1f5f9', marginBottom: '0.25rem' }}>ACTIVE TRIALS</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: 1 }}>tFUS / LIFU clinical neuromodulation trials · manually curated</p>
        </div>

        {/* HERO: horizontal timeline */}
        <div style={{ position: 'relative', height: 120, marginBottom: '2rem', padding: '0 1rem' }}>
          {/* baseline */}
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #1e293b 10%, #1e293b 90%, transparent)' }} />
          {/* glow line */}
          <div style={{ position: 'absolute', top: 59, left: '5%', right: '5%', height: 3, background: 'linear-gradient(90deg, transparent, #22d3ee30, #22d3ee60, #a78bfa60, #22d3ee30, transparent)', filter: 'blur(2px)' }} />

          {/* year labels */}
          {years.map(y => (
            <div key={y} style={{ position: 'absolute', left: `${pct(y)}%`, top: 70, transform: 'translateX(-50%)', fontSize: '0.6rem', color: '#475569', letterSpacing: 1 }}>{y}</div>
          ))}

          {/* trial dots */}
          {trials.map((t, i) => {
            const x = pct(t.year)
            const offset = (i % 3) * 14 - 14
            const isHov = hovered === t.nct
            return (
              <div key={t.nct}
                onMouseEnter={() => setHovered(t.nct)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: 60 + offset - 6,
                  width: isHov ? 14 : 10,
                  height: isHov ? 14 : 10,
                  borderRadius: '50%',
                  background: COND_COLOR[t.condition],
                  boxShadow: isHov ? `0 0 12px ${COND_COLOR[t.condition]}` : `0 0 4px ${COND_COLOR[t.condition]}80`,
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  zIndex: isHov ? 10 : 1,
                }}
              >
                {isHov && (
                  <div style={{
                    position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
                    background: '#1e293b', border: `1px solid ${COND_COLOR[t.condition]}60`,
                    padding: '0.4rem 0.6rem', borderRadius: 4, fontSize: '0.65rem', whiteSpace: 'nowrap',
                    color: '#e2e8f0', zIndex: 20,
                  }}>
                    <div style={{ color: COND_COLOR[t.condition], fontWeight: 700 }}>{t.conditionLabel}</div>
                    <div>{t.pi} · {t.institution}</div>
                    <div style={{ color: '#64748b' }}>{t.target} · {t.year}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* status bar */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', padding: '1rem 1.5rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
          {Object.entries(counts).map(([s, n]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s as keyof typeof STATUS_COLOR] }} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{s}</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{n}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            {(['all', ...conditions] as const).map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{ padding: '0.25rem 0.75rem', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                  background: filter === c ? (c === 'all' ? '#22d3ee' : COND_COLOR[c as TrialCondition]) : '#1e293b',
                  color: filter === c ? '#0a0a0f' : '#64748b', transition: 'all 0.15s' }}>
                {c === 'all' ? 'ALL' : c}
              </button>
            ))}
          </div>
        </div>

        {/* card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {filtered.map(t => (
            <a key={t.nct} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0f172a', border: `1px solid ${COND_COLOR[t.condition]}30`, borderRadius: 8, padding: '1rem',
                transition: 'all 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COND_COLOR[t.condition] + '80'; (e.currentTarget as HTMLElement).style.background = '#1e293b' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = COND_COLOR[t.condition] + '30'; (e.currentTarget as HTMLElement).style.background = '#0f172a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: 3, background: COND_COLOR[t.condition] + '20', color: COND_COLOR[t.condition], letterSpacing: 1, textTransform: 'uppercase' }}>{t.conditionLabel}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[t.status] }} />
                    <span style={{ fontSize: '0.6rem', color: '#64748b' }}>{STATUS_LABEL[t.status]}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.75rem', lineHeight: 1.4 }}>{t.title}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.5rem', fontSize: '0.65rem' }}>
                  <span style={{ color: '#475569' }}>Target</span><span style={{ color: '#94a3b8' }}>{t.target}</span>
                  <span style={{ color: '#475569' }}>Phase</span><span style={{ color: '#94a3b8' }}>{t.phase}</span>
                  <span style={{ color: '#475569' }}>PI</span><span style={{ color: '#94a3b8' }}>{t.pi}</span>
                  <span style={{ color: '#475569' }}>Institution</span><span style={{ color: '#94a3b8', fontSize: '0.6rem' }}>{t.institution}</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.6rem', color: '#334155', borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>{t.nct}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN B — "SPLIT SCREEN"
// Left: vertical scrolling timeline. Right: 2-col card grid.
// ═══════════════════════════════════════════════════════════════════════════════
function DesignB() {
  const [filter, setFilter] = useState<TrialCondition | 'all'>('all')
  const filtered = filter === 'all' ? trials : trials.filter(t => t.condition === filter)
  const byYear = years.map(y => ({ year: y, items: trials.filter(t => t.year === y) })).filter(g => g.items.length)

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#e2e8f0', fontFamily: 'monospace' }}>

      {/* top bar */}
      <div style={{ borderBottom: '1px solid #111827', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', color: '#4ade80', letterSpacing: 2, textTransform: 'uppercase' }}>● Live</span>
          <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, letterSpacing: 2 }}>CLINICAL TRIALS</h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', ...conditions] as const).map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: '0.3rem 0.8rem', borderRadius: 20, border: `1px solid ${c === 'all' ? '#374151' : COND_COLOR[c as TrialCondition] + '40'}`, cursor: 'pointer',
                fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1,
                background: filter === c ? (c === 'all' ? '#374151' : COND_COLOR[c as TrialCondition] + '25') : 'transparent',
                color: filter === c ? '#f1f5f9' : '#4b5563', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 80px)' }}>

        {/* LEFT: vertical timeline */}
        <div style={{ borderRight: '1px solid #111827', padding: '1.5rem 1rem', overflowY: 'auto' }}>
          {byYear.map(({ year, items }) => (
            <div key={year} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#4b5563', letterSpacing: 2, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: 1, background: '#1f2937' }} />
                {year}
                <div style={{ flex: 1, height: 1, background: '#1f2937' }} />
              </div>
              {items.map(t => (
                <div key={t.nct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: 4, marginBottom: '0.25rem',
                  background: '#0a0f1a', border: `1px solid ${COND_COLOR[t.condition]}20` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COND_COLOR[t.condition], flexShrink: 0, boxShadow: `0 0 6px ${COND_COLOR[t.condition]}` }} />
                  <div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.3 }}>{t.conditionLabel}</div>
                    <div style={{ fontSize: '0.55rem', color: '#374151' }}>{t.target}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT: card grid */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {filtered.map(t => (
              <a key={t.nct} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0a0f1a', border: '1px solid #1f2937', borderRadius: 12, padding: '1.25rem', position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = COND_COLOR[t.condition] + '60'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1f2937'}>
                  {/* accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${COND_COLOR[t.condition]}, transparent)` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', color: COND_COLOR[t.condition], textTransform: 'uppercase', letterSpacing: 1 }}>{t.conditionLabel}</span>
                    <span style={{ fontSize: '0.6rem', color: STATUS_COLOR[t.status] }}>● {STATUS_LABEL[t.status]}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '1rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.65rem', color: '#4b5563', borderTop: '1px solid #1f2937', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}>
                    <span><span style={{ color: '#374151' }}>Target </span><span style={{ color: '#94a3b8' }}>{t.target}</span></span>
                    <span><span style={{ color: '#374151' }}>Phase </span><span style={{ color: '#94a3b8' }}>{t.phase}</span></span>
                    <span><span style={{ color: '#374151' }}>PI </span><span style={{ color: '#94a3b8' }}>{t.pi}</span></span>
                    <span><span style={{ color: '#374151' }}>Year </span><span style={{ color: '#94a3b8' }}>{t.year}</span></span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN C — "STATUS BOARD"
// Big bold counts hero. Year-band density strip. Horizontal row cards.
// ═══════════════════════════════════════════════════════════════════════════════
function DesignC() {
  const [filter, setFilter] = useState<TrialCondition | 'all'>('all')
  const filtered = filter === 'all' ? trials : trials.filter(t => t.condition === filter)

  const counts = {
    recruiting: trials.filter(t => t.status === 'recruiting').length,
    active:     trials.filter(t => t.status === 'active').length,
    completed:  trials.filter(t => t.status === 'completed').length,
  }

  // density per year for sparkline
  const maxCount = Math.max(...years.map(y => trials.filter(t => t.year === y).length))

  return (
    <div style={{ minHeight: '100vh', background: '#05070d', color: '#e2e8f0', fontFamily: 'monospace' }}>

      {/* BIG HERO counts */}
      <div style={{ padding: '3rem 2.5rem 2rem', borderBottom: '1px solid #0f172a' }}>
        <p style={{ fontSize: '0.65rem', color: '#334155', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1.5rem' }}>tFUS Neuromodulation · Clinical Trials</p>
        <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          {([
            { label: 'Recruiting', key: 'recruiting', color: '#22d3ee' },
            { label: 'Active / Ongoing', key: 'active', color: '#a78bfa' },
            { label: 'Completed', key: 'completed', color: '#374151' },
          ] as const).map(({ label, key, color }) => (
            <div key={key}>
              <div style={{ fontSize: '4rem', fontWeight: 900, color, lineHeight: 1, textShadow: `0 0 40px ${color}60` }}>{counts[key]}</div>
              <div style={{ fontSize: '0.65rem', color: '#334155', letterSpacing: 2, textTransform: 'uppercase', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>{trials.length}</div>
            <div style={{ fontSize: '0.65rem', color: '#334155', letterSpacing: 2, textTransform: 'uppercase', marginTop: '0.25rem' }}>Total Trials</div>
          </div>
        </div>

        {/* year density strip */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
          {years.map(y => {
            const cnt = trials.filter(t => t.year === y).length
            const h = (cnt / maxCount) * 36
            // color by dominant condition
            const conds = trials.filter(t => t.year === y).map(t => t.condition)
            const dom = conds.sort((a,b) => conds.filter(x=>x===b).length - conds.filter(x=>x===a).length)[0]
            return (
              <div key={y} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 28, height: h, background: COND_COLOR[dom] + '60', borderTop: `2px solid ${COND_COLOR[dom]}`, borderRadius: '2px 2px 0 0' }} />
                <div style={{ fontSize: '0.5rem', color: '#1e293b' }}>{y}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* filter row */}
      <div style={{ padding: '1rem 2.5rem', borderBottom: '1px solid #0f172a', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.6rem', color: '#334155', letterSpacing: 1, marginRight: '0.5rem' }}>FILTER</span>
        {(['all', ...conditions] as const).map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '0.2rem 0.6rem', borderRadius: 2, border: 'none', cursor: 'pointer', fontSize: '0.6rem', letterSpacing: 1, textTransform: 'uppercase',
              background: filter === c ? (c === 'all' ? '#1e293b' : COND_COLOR[c as TrialCondition] + '30') : 'transparent',
              color: filter === c ? (c === 'all' ? '#f1f5f9' : COND_COLOR[c as TrialCondition]) : '#334155',
              borderLeft: c !== 'all' && filter === c ? `2px solid ${COND_COLOR[c as TrialCondition]}` : '2px solid transparent',
              transition: 'all 0.15s' }}>
            {c}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#1e293b' }}>{filtered.length} trials</span>
      </div>

      {/* row cards */}
      <div style={{ padding: '1rem 2.5rem' }}>
        {filtered.map(t => (
          <a key={t.nct} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '3px 100px 1fr 120px 120px 80px', gap: '1.5rem', alignItems: 'center',
              padding: '0.9rem 1rem', borderBottom: '1px solid #0f172a', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0a0f1a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              {/* condition accent */}
              <div style={{ width: 3, height: 36, background: COND_COLOR[t.condition], borderRadius: 2 }} />
              {/* year + condition */}
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{t.year}</div>
                <div style={{ fontSize: '0.6rem', color: COND_COLOR[t.condition], textTransform: 'uppercase', letterSpacing: 1 }}>{t.conditionLabel}</div>
              </div>
              {/* title */}
              <div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>{t.title}</div>
                <div style={{ fontSize: '0.6rem', color: '#334155', marginTop: '0.2rem' }}>{t.target}</div>
              </div>
              {/* institution */}
              <div style={{ fontSize: '0.65rem', color: '#475569' }}>{t.institution}</div>
              {/* pi */}
              <div style={{ fontSize: '0.65rem', color: '#475569' }}>{t.pi}</div>
              {/* status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[t.status] }} />
                <span style={{ fontSize: '0.6rem', color: STATUS_COLOR[t.status], textTransform: 'uppercase', letterSpacing: 1 }}>{STATUS_LABEL[t.status]}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — toggle between designs
// ═══════════════════════════════════════════════════════════════════════════════
export default function TrialsDesigns() {
  const [design, setDesign] = useState<'A' | 'B' | 'C'>('A')

  return (
    <div>
      {/* sticky switcher */}
      <div style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 6, padding: '0.3rem',
        display: 'flex', gap: '0.25rem', fontFamily: 'monospace' }}>
        {(['A', 'B', 'C'] as const).map(d => (
          <button key={d} onClick={() => setDesign(d)}
            style={{ padding: '0.3rem 1.2rem', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: 1,
              background: design === d ? '#22d3ee' : 'transparent', color: design === d ? '#0a0a0f' : '#475569', transition: 'all 0.15s' }}>
            {d === 'A' ? 'A · Pulse Line' : d === 'B' ? 'B · Split Screen' : 'C · Status Board'}
          </button>
        ))}
      </div>
      {design === 'A' && <DesignA />}
      {design === 'B' && <DesignB />}
      {design === 'C' && <DesignC />}
    </div>
  )
}
