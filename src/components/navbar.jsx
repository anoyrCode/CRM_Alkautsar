import { Menu, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_LABELS = {
  '/': 'Dashboard',
  '/Dashboard': 'Dashboard',
  '/Kategori': 'Kategori',
  '/Data Komplain': 'Data Komplain',
  '/Buat Laporan': 'Buat Laporan',
  '/Laporan Saya': 'Laporan Saya',
  '/Users': 'Data User',
  '/Role': 'Role',
}

const username = 'User'

function Navbar({ onMenuClick }) {
  const location = useLocation()
  const path = decodeURIComponent(location.pathname)
  const pageLabel = PAGE_LABELS[path] ?? path.slice(1)

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center xl:fixed xl:left-64 xl:right-0 xl:top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="xl:hidden text-slate-500 hover:text-slate-700 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-slate-800">{pageLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
          {username[0].toUpperCase()}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
