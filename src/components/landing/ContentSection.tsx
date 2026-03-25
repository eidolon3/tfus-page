import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Cite = ({ children }: { children: string }) => (
  <span className="font-mono text-[10px] tracking-wide" style={{ color: 'rgba(0,255,255,0.45)' }}>
    [{children}]
  </span>
)

const FootnoteLink = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-mono text-[9px] align-super ml-0.5 transition-colors"
    style={{ color: 'rgba(0,255,255,0.40)', textDecoration: 'none' }}
    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,255,255,0.85)')}
    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,255,255,0.40)')}
  >
    ↗
  </a>
)

const findings = [
  { text: 'Significantly reducing levels of chronic pain for days after stimulation', cites: ['Kubanek 2024'] },
  { text: 'Producing sustained relief from depression in patients who had failed all prior treatments', cites: ['Attali 2025', 'Riis 2023'] },
  { text: 'Reducing Essential Tremor', cites: ['Riis 2024', 'Bancel 2024'] },
  { text: '"Waking up" patients in coma-like states', cites: ['Cain 2021', 'Monti 2016'] },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function ContentSection() {
  const navigate = useNavigate()

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div
        className="px-6 md:px-10 py-28 md:py-36"
        style={{ maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <FadeIn>
          <div className="h-px w-12 mb-14 opacity-50" style={{ background: '#BF40BF' }} />
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[22px] md:text-[26px] font-light leading-relaxed"
            style={{ color: 'rgba(241,245,249,0.88)', marginBottom: '0.375rem' }}>
            Transcranial Focused Ultrasound is an emerging brain stimulation technology that can non-invasively{' '}
            <span style={{ color: '#BF40BF' }}>"turn up" or "turn down"</span>{' '}
            the activity of virtually any selected brain region.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[14px] leading-[1.85]" style={{ color: 'rgba(203,213,225,0.52)', marginBottom: '0.375rem' }}>
            Previous brain stimulation technologies faced tradeoffs that limited efficacy.
            Conventional noninvasive methods (such as rTMS and tDCS) are limited to the brain's
            cortical surface and lack good spatial precision. Deep Brain Stimulation allows
            stimulation of deeper brain regions, but only through a risky, expensive procedure
            requiring electrodes implanted inside the skull.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[14px] leading-[1.85]" style={{ color: 'rgba(203,213,225,0.52)', marginBottom: '0.625rem' }}>
            tFUS is noninvasive, orders of magnitude more spatially precise than any other
            noninvasive method, and able to reach arbitrarily deep inside the brain. Since
            Legon et al (2014) first demonstrated modulation of brain activity in healthy
            human participants, there has been an explosion of research interest in the field.
          </p>
        </FadeIn>

        <FadeIn>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem' }} />
        </FadeIn>

        <FadeIn>
          <p className="font-mono text-[8px] tracking-[0.25em] uppercase"
            style={{ color: 'rgba(255,255,255,0.18)', marginBottom: '0.625rem' }}>
            Notable Results
          </p>
        </FadeIn>

        <ul style={{ marginBottom: '0.625rem' }} className="space-y-8">
          {findings.map((f, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <li className="flex gap-5 items-start">
                <span className="mt-1 flex-shrink-0 font-mono text-[10px]" style={{ color: '#BF40BF' }}>—</span>
                <span className="text-[14px] leading-[1.75]" style={{ color: 'rgba(203,213,225,0.65)' }}>
                  {f.text}{' '}
                  {f.cites.map((c, ci) => (
                    <span key={ci}><Cite>{c}</Cite>{ci < f.cites.length - 1 ? ' ' : ''}</span>
                  ))}
                </span>
              </li>
            </FadeIn>
          ))}
        </ul>

        <FadeIn>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem' }} />
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[14px] leading-[1.85]" style={{ color: 'rgba(203,213,225,0.52)', marginBottom: '0.375rem' }}>
            But beyond treating patients with currently intractable conditions, the ability
            to selectively modulate any part of the brain opens the door to products that
            have never existed before. Think of a headband that induces lucid dreams by pulsing
            ultrasound at the prefrontal cortex during REM sleep.
            <FootnoteLink href="https://www.prophetic.com/" />
            {' '}Or a device that triggers the sensation of smell by targeting the olfactory bulb.
            <FootnoteLink href="https://writetobrain.com/olfactory" />
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[14px] leading-[1.85]" style={{ color: 'rgba(203,213,225,0.52)', marginBottom: '0.625rem' }}>
            We are likely to see an array of tFUS products in the near future, for both
            clinical and consumer applications. Most notably, neurotech startup{' '}
            <span style={{ color: 'rgba(191,64,191,0.80)' }}>Nudge</span>
            <FootnoteLink href="https://nudge.com/" />{' '}
            has recently raised $100 million toward bringing a portable, noninvasive tFUS
            helmet to the masses.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="text-[17px] md:text-[20px] font-light leading-relaxed"
            style={{ color: 'rgba(241,245,249,0.38)', fontStyle: 'italic', borderLeft: '2px solid rgba(191,64,191,0.30)', paddingLeft: '1.5rem' }}>
            Everything we are and experience can be reduced down to the neural activity
            that goes on in the three-pound lump of tissue inside our skulls. With the
            ability to shape said activity to our whims, anything is possible.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="flex items-center gap-4" style={{ marginTop: '0.625rem' }}>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <button
              onClick={() => navigate('/about')}
              className="font-mono text-[9px] tracking-[0.2em] uppercase transition-colors"
              style={{ color: 'rgba(255,255,255,0.18)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#BF40BF')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
            >
              About
            </button>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
