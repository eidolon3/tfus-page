import PageWrapper from '../components/ui/PageWrapper'
import { companies } from '../data/organizations'

const stageColor: Record<string, string> = {
  clinical:       'text-[#00FFFF] border-[#00FFFF]/30 bg-[#00FFFF]/5',
  'pre-clinical': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  consumer:       'text-orange-400 border-orange-400/30 bg-orange-400/5',
  research:       'text-purple-400 border-purple-400/30 bg-purple-400/5',
}

export default function Organizations() {
  return (
    <PageWrapper
      title="Industry"
      subtitle="Companies building focused ultrasound products."
      accentColor="#BF40BF"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((c) => (
          <a
            key={c.name}
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-white/[0.06] rounded-lg p-5 hover:border-white/15 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                {c.name}
              </h3>
              <span className={`font-mono text-[9px] border rounded px-1.5 py-px shrink-0 ml-3 ${stageColor[c.stage] || 'text-white/30 border-white/10'}`}>
                {c.stage}
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-3">
              {c.focus}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/25">
              <span>{c.founderCeo}</span>
              <span className="text-white/10">|</span>
              <span className="text-[#00FFFF]/40">{c.raised}</span>
            </div>
          </a>
        ))}
      </div>
    </PageWrapper>
  )
}
