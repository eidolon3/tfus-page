import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import Organizations from './pages/Organizations'
import Studies from './pages/Studies'
import PapersPage from './pages/PapersPage'
import About from './pages/About'
import Trials from './pages/Trials'
import MockupTextStack from './pages/MockupTextStack'

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
