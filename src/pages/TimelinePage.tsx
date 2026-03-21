import PageWrapper from '../components/ui/PageWrapper'
import { timeline } from '../data/timeline'
import { motion } from 'framer-motion'

const significanceStyles: Record<string, { dot: string; line: string; text: string }> = {
  breakthrough: {
    dot: 'bg-[#00FFFF] shadow-[0_0_12px_rgba(0,255,255,0.4)]',
    line: 'bg-gradient-to-b from-[#00FFFF]/40 to-[#00FFFF]/5',
    text: 'text-[#00FFFF]',
  },
  major: {
    dot: 'bg-[#BF40BF] shadow-[0_0_8px_rgba(191,64,191,0.3)]',
    line: 'bg-gradient-to-b from-[#BF40BF]/30 to-[#BF40BF]/5',
    text: 'text-[#BF40BF]',
  },
  notable: {
    dot: 'bg-white/30',
    line: 'bg-gradient-to-b from-white/10 to-white/3',
    text: 'text-white/50',
  },
}

export default function TimelinePage() {
  return (
    <PageWrapper
      title="Timeline"
      subtitle="Key milestones in the history of transcranial focused ultrasound,
        from early acoustic experiments to modern clinical trials."
      accentColor="#00FFFF"
    >
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[60px] md:left-[80px] top-0 bottom-0 w-px bg-white/5" />

        <div className="space-y-0">
          {timeline.map((milestone, i) => {
            const style = significanceStyles[milestone.significance]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="relative flex gap-6 md:gap-8 group"
              >
                {/* Year */}
                <div className="w-[60px] md:w-[80px] shrink-0 pt-5 text-right">
                  <span className={`font-mono text-xs ${style.text}`}>
                    {milestone.year}
                  </span>
                </div>

                {/* Dot */}
                <div className="relative shrink-0 pt-5">
                  <div className={`w-2.5 h-2.5 rounded-full ${style.dot} -ml-[5px]`} />
                  {i < timeline.length - 1 && (
                    <div className={`absolute top-7 left-1/2 -translate-x-1/2 w-px h-full ${style.line}`} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 pt-3 flex-1 min-w-0">
                  <h3 className="text-sm text-white/85 group-hover:text-white transition-colors mb-1.5 leading-relaxed">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {milestone.description}
                  </p>
                  <span className={`inline-block mt-2 text-[8px] font-mono tracking-[0.2em] uppercase ${style.text} opacity-50`}>
                    {milestone.significance}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
