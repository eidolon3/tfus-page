import { motion } from 'framer-motion'

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full"
      style={{ paddingTop: '7rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{ width: '4rem', height: 1, background: '#00FFFF', opacity: 0.5, marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: '0.75rem' }}>
            About
          </h1>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            Why I built this site and where I'm headed.
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <p style={{ fontSize: '0.875rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.6)' }}>
            I'm Samir Mohammad, an undergraduate Electrical Engineering student at the University
            of Illinois. For almost two years, I have been fascinated by transcranial focused
            ultrasound: a technology that exists at the intersection of my interests in
            neuroscience, hardware, and machine learning.
          </p>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.6)' }}>
            This website is a curated knowledge base I built to organize my own research into
            the tFUS landscape. The feature I'm most proud of is the inclusion of a database
            that contains 250+ tFUS studies, with key findings and ultrasonic parameters attached.
            The website also includes a catalog of every tFUS clinical trial in existence, a list
            of key organizations driving the field, and a timeline of the landmark studies that
            shaped our understanding.
          </p>
        </motion.div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

        {/* tFUS progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,255,255,0.6)', marginBottom: '0.625rem' }}>
            tFUS progress I'd like to be a part of
          </h2>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            {[
              'Next-gen hardware: phased arrays, transducer miniaturization, real-time beam steering',
              'Peripheral neuromodulation: targeting DRG, vestibular nerve, and beyond',
              'Wearable tFUS devices for consumer applications',
              'tFUS research for intractable psychiatric conditions',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="font-mono" style={{ color: '#BF40BF', fontSize: '10px', marginTop: 2, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,255,255,0.6)', marginBottom: '0.625rem' }}>
            Get in touch
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.625rem' }}>
            If you're working on tFUS and/or looking for a motivated collaborator, I'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href="mailto:smoha95@illinois.edu"
              className="font-mono"
              style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.5rem 1rem', border: '1px solid rgba(191,64,191,0.3)', color: 'rgba(191,64,191,0.7)', borderRadius: '0.25rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(191,64,191,0.6)'; e.currentTarget.style.color = '#BF40BF'; e.currentTarget.style.background = 'rgba(191,64,191,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(191,64,191,0.3)'; e.currentTarget.style.color = 'rgba(191,64,191,0.7)'; e.currentTarget.style.background = 'transparent' }}
            >
              Email
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: '0.25rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              Resume
            </a>
          </div>
        </motion.div>


      </div>
    </motion.div>
  )
}
