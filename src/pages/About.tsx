import PageWrapper from '../components/ui/PageWrapper'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <PageWrapper
      title="About"
      subtitle="Why I built this site and where I'm headed."
      accentColor="#00FFFF"
    >
      <div className="max-w-2xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-sm text-white/60 leading-relaxed">
            I'm an undergraduate fascinated by the intersection of acoustics, neuroscience,
            and engineering. Transcranial focused ultrasound represents one of the most
            promising frontiers in non-invasive neuromodulation — a technology that could
            fundamentally change how we treat neurological and psychiatric disorders.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            This website is a curated knowledge base I built to organize my own research
            into the tFUS landscape: the key labs driving the field, the landmark studies
            that shaped our understanding, the technology that makes it possible, and the
            open questions that remain.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            The interactive landing page simulates beam steering through a stylized brain
            cross-section — because I believe the best way to understand focused ultrasound
            is to see it in action.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* What I'm looking for */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-[#00FFFF]/60 mb-4">
            What I'm looking for
          </h2>
          <div className="space-y-3">
            {[
              'Research lab positions in focused ultrasound or neuromodulation',
              'Computational modeling of acoustic wave propagation',
              'Hardware/software for real-time beam steering systems',
              'Intersection of FUS with neuroimaging and closed-loop systems',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#BF40BF] font-mono text-[10px] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-white/50">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-[#00FFFF]/60 mb-4">
            Get in touch
          </h2>
          <p className="text-sm text-white/40">
            If you're working on tFUS and looking for a motivated collaborator, I'd love to hear from you.
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="mailto:your-email@university.edu"
              className="font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2
                border border-[#BF40BF]/30 text-[#BF40BF]/70 rounded
                hover:border-[#BF40BF]/60 hover:text-[#BF40BF] hover:bg-[#BF40BF]/5
                transition-all"
            >
              Email
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2
                border border-white/10 text-white/40 rounded
                hover:border-white/20 hover:text-white/60
                transition-all"
            >
              GitHub
            </a>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-4"
        >
          <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-white/20 mb-3">
            Built with
          </h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'Three.js', 'R3F', 'Framer Motion', 'Tailwind CSS', 'TypeScript'].map(tech => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-wider uppercase px-2 py-1
                  border border-white/5 text-white/20 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
