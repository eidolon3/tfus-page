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
      className="min-h-screen pb-16 px-6 md:px-10 w-full"
      style={{ paddingTop: '7rem', maxWidth: '90rem', marginLeft: 'auto', marginRight: 'auto' }}
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-14"
      >
        <div
          className="h-px w-16 mb-8 opacity-50"
          style={{ background: accentColor }}
        />
        <h1 className="text-2xl md:text-3xl font-light text-white/90 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-xs text-white/30 tracking-wide max-w-2xl mt-1">
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
