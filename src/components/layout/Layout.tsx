import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
