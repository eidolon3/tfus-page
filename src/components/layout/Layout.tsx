import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-6 md:px-10">
        <Outlet />
      </main>
    </div>
  )
}
