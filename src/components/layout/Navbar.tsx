import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/papers', label: 'Foundations' },
  { path: '/studies', label: 'Studies' },
  { path: '/trials', label: 'Trials' },
  { path: '/industry', label: 'Industry' },
  { path: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLanding
          ? 'bg-transparent'
          : 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5'
      }`}
    >
      <div className="w-full px-6 h-16 flex items-center justify-between"
        style={{ maxWidth: '90rem', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link
          to="/"
          className="font-mono text-xl tracking-widest text-[#BF40BF] hover:text-[#00FFFF] transition-colors"
        >
          tFUS
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ path, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-1.5 text-xs font-mono tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#00FFFF]'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-white/5 rounded border border-[#00FFFF]/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/50 hover:text-white font-mono text-xs">
          [MENU]
        </button>
      </div>
    </motion.nav>
  )
}
