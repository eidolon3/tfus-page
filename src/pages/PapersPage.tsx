import PageWrapper from '../components/ui/PageWrapper'
import { papers } from '../data/papers'
import { motion } from 'framer-motion'

export default function PapersPage() {
  return (
    <PageWrapper
      title="Foundational Papers"
      subtitle="The studies that shaped the field of transcranial focused ultrasound."
      accentColor="#00FFFF"
    >
      <div style={{ maxWidth: '38rem', margin: '0 auto' }}>
        {papers.map((paper, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.03 }}
          >
            {/* Divider line between entries */}
            {i > 0 && (
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '2.5rem 0' }} />
            )}

            {/* Year label */}
            <p
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: 'rgba(0,255,255,0.45)',
                marginBottom: '0.5rem',
              }}
            >
              {paper.year}
            </p>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.88)',
                marginBottom: '0.65rem',
                lineHeight: 1.4,
              }}
            >
              {paper.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              {paper.takeaway}
            </p>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
