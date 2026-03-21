import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  accentColor?: string
}

export default function PageWrapper({
  children,
  title,
  subtitle,
  accentColor = '#BF40BF',
}: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-16 px-6 md:px-12 max-w-7xl mx-auto"
      style={{ paddingTop: '7rem' }}
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <div
          className="h-px w-16 mb-6 opacity-50"
          style={{ background: accentColor }}
        />
        <h1 className="text-2xl md:text-3xl font-light text-white/90 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-xs text-white/30 tracking-wide max-w-2xl">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
