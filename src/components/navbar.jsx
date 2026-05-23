import { useState, useEffect, useRef } from 'react'
import { Menu, Bell, Check } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import NotificationToast from './NotificationToast'

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

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs} jam lalu`
  return `${Math.floor(hrs / 24)} hari lalu`
}

function Navbar({ onMenuClick }) {
  const location  = useLocation()
  const { profile } = useAuth()
  const { notifications, unreadCount, markAllRead, markOneRead, toast, setToast } = useNotifications()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const path      = decodeURIComponent(location.pathname)
  const pageLabel = PAGE_LABELS[path] ?? path.slice(1)
  const initials  = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    if (!open) return
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <>
    <NotificationToast toast={toast} onClose={() => setToast(null)} />
    <nav className="bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center xl:fixed xl:left-64 xl:right-0 xl:top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="xl:hidden text-slate-500 hover:text-slate-700 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-slate-800">{pageLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Bell + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="relative w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-[11px] font-semibold px-1.5 py-0.5 rounded-full">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 font-medium transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-sm text-slate-400">Tidak ada notifikasi</span>
                  </div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markOneRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex gap-3 items-start ${!n.is_read ? 'bg-sky-50/70' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-sky-500' : 'bg-slate-200'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar
