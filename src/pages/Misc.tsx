import PageWrapper from '../components/ui/PageWrapper'
import { openQuestions } from '../data/openQuestions'
import { motion } from 'framer-motion'

const statusColors: Record<string, string> = {
  'Open': 'text-red-400 border-red-400/30 bg-red-400/5',
  'Partially addressed': 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  'Emerging consensus': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
}

const categoryColors: Record<string, string> = {
  'Mechanism': '#BF40BF',
  'Dosimetry': '#7B68EE',
  'Technical': '#00FFFF',
  'Safety': '#FF6B6B',
  'Clinical': '#4ADE80',
}

export default function Misc() {
  return (
    <PageWrapper
      title="Open Questions"
      subtitle="Unresolved questions and active debates in tFUS research.
        Located outside the head — the frontier beyond current knowledge."
      accentColor="#6A5ACD"
    >
      <div className="space-y-4">
        {openQuestions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="border border-white/5 rounded-lg p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-sm text-white/85 group-hover:text-white transition-colors leading-relaxed">
                {q.question}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10"
                  style={{ color: categoryColors[q.category] || '#BF40BF' }}
                >
                  {q.category}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusColors[q.status] || ''}`}>
                  {q.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              {q.context}
            </p>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
