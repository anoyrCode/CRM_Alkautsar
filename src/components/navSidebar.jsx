import { motion, AnimatePresence } from 'framer-motion'
import {
  X, LayoutDashboard, ClipboardPlus, Database, MessageSquare,
  ChartColumnStacked, User, UserCog, LogOut, ScrollText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import PagesNav from './PagesNav'
import { useAuth } from '../context/AuthContext'

function NavSidebar({ isOpen, onClose }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    onClose()
    await signOut()
    navigate('/login')
  }

  const has = perm => profile?.roles?.permissions?.includes(perm) ?? false

  const mainMenu = [
    has('buat_laporan')                                 && { to: '/Buat Laporan', icon: ClipboardPlus,      label: 'Buat Laporan' },
    (has('komplain_semua') || has('komplain_diterima')) && { to: '/Data Komplain', icon: Database,           label: 'Data Komplain' },
    has('laporan_saya')                                 && { to: '/Laporan Saya',  icon: MessageSquare,     label: 'Laporan Saya' },
    has('kelola_kategori')                              && { to: '/Kategori',      icon: ChartColumnStacked, label: 'Kategori' },
  ].filter(Boolean)

  const settingsMenu = [
    has('kelola_users') && { to: '/Users',        icon: User,       label: 'Users' },
    has('kelola_role')  && { to: '/Role',          icon: UserCog,    label: 'Role' },
    has('kelola_users') && { to: '/Log Aktivitas', icon: ScrollText, label: 'Log Aktivitas' },
  ].filter(Boolean)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col xl:hidden"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    CRM <span className="text-sky-500">Al-Kautsar</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Complaint Management</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
              {has('dashboard') && (
                <div className="flex flex-col gap-1">
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">General</p>
                  <PagesNav to="/Dashboard" icon={LayoutDashboard}>Dashboard</PagesNav>
                </div>
              )}
              {mainMenu.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Main Menu</p>
                  {mainMenu.map(item => (
                    <PagesNav key={item.to} to={item.to} icon={item.icon}>{item.label}</PagesNav>
                  ))}
                </div>
              )}
              {settingsMenu.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Pengaturan</p>
                  {settingsMenu.map(item => (
                    <PagesNav key={item.to} to={item.to} icon={item.icon}>{item.label}</PagesNav>
                  ))}
                </div>
              )}
            </nav>

            <div className="px-4 py-4 border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-sky-500 to-sky-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{profile?.full_name ?? '...'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{profile?.roles?.name ?? '...'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NavSidebar
