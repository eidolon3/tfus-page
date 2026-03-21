import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Organizations from './pages/Organizations'
import Studies from './pages/Studies'
import Technology from './pages/Technology'
import Misc from './pages/Misc'
import TimelinePage from './pages/TimelinePage'
import About from './pages/About'
import Trials from './pages/Trials'

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="studies" element={<Studies />} />
            <Route path="technology" element={<Technology />} />
            <Route path="misc" element={<Misc />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="trials" element={<Trials />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
