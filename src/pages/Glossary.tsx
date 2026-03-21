import { useState, useMemo } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import { glossary } from '../data/glossary'
import { motion } from 'framer-motion'

const categoryColors: Record<string, string> = {
  physics: '#BF40BF',
  neuroscience: '#00FFFF',
  engineering: '#7B68EE',
  clinical: '#4ADE80',
  general: '#9CA3AF',
}

const categoryLabels: Record<string, string> = {
  physics: 'Physics',
  neuroscience: 'Neuroscience',
  engineering: 'Engineering',
  clinical: 'Clinical',
  general: 'General',
}

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set(glossary.map(g => g.category))
    return Array.from(cats).sort()
  }, [])

  const filtered = useMemo(() => {
    return glossary.filter(entry => {
      const matchesSearch = search === '' ||
        entry.term.toLowerCase().includes(search.toLowerCase()) ||
        (entry.abbreviation && entry.abbreviation.toLowerCase().includes(search.toLowerCase())) ||
        entry.definition.toLowerCase().includes(search.toLowerCase())

      const matchesCategory = activeCategory === null || entry.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <PageWrapper
      title="Glossary"
      subtitle="Key terminology in transcranial focused ultrasound research."
      accentColor="#7B68EE"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#7B68EE]/50 w-full sm:w-64"
        />
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors ${
              activeCategory === null
                ? 'border-white/30 text-white/80 bg-white/5'
                : 'border-white/5 text-white/30 hover:border-white/15'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors ${
                activeCategory === cat
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/5 text-white/30 hover:border-white/15'
              }`}
              style={activeCategory === cat ? { color: categoryColors[cat] } : undefined}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="font-mono text-[10px] text-white/20 mb-6 tracking-wider">
        TERMS[{filtered.length}]
      </div>

      {/* Glossary entries */}
      <div className="space-y-3">
        {filtered.map((entry, i) => (
          <motion.div
            key={entry.term}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className="border border-white/5 rounded-lg p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm text-white/85 group-hover:text-white transition-colors">
                  {entry.term}
                </h3>
                {entry.abbreviation && (
                  <span className="font-mono text-[10px] text-[#00FFFF]/60">
                    ({entry.abbreviation})
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10 shrink-0"
                style={{ color: categoryColors[entry.category] }}
              >
                {categoryLabels[entry.category]}
              </span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              {entry.definition}
            </p>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
