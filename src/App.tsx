import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/layout/Layout'
import MockupTextStack from './pages/MockupTextStack'

const Organizations = lazy(() => import('./pages/Organizations'))
const Studies = lazy(() => import('./pages/Studies'))
const PapersPage = lazy(() => import('./pages/PapersPage'))
const About = lazy(() => import('./pages/About'))
const Trials = lazy(() => import('./pages/Trials'))

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}>
          <Routes>
            <Route path="/" element={<MockupTextStack />} />
            <Route element={<Layout />}>
              <Route path="industry" element={<Organizations />} />
              <Route path="studies" element={<Studies />} />
              <Route path="papers" element={<PapersPage />} />
              <Route path="trials" element={<Trials />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
