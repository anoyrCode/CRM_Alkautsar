import {
  LayoutDashboard, ClipboardPlus, Database, MessageSquare,
  ChartColumnStacked, User, UserCog
} from 'lucide-react'
import logo from '../assets/logo.png'
import PagesNav from './PagesNav'

function Sidebarr() {
  return (
    <div className="hidden xl:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-30">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <div>
          <p className="font-bold text-slate-800 text-sm leading-tight">
            CRM <span className="text-sky-500">Al-Kautsar</span>
          </p>
          <p className="text-[11px] text-slate-400">Complaint Management</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">General</p>
          <PagesNav to="/Dashboard" icon={LayoutDashboard}>Dashboard</PagesNav>
        </div>
        <div className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Main Menu</p>
          <PagesNav to="/Buat Laporan" icon={ClipboardPlus}>Buat Laporan</PagesNav>
          <PagesNav to="/Data Komplain" icon={Database}>Data Komplain</PagesNav>
          <PagesNav to="/Laporan Saya" icon={MessageSquare}>Laporan Saya</PagesNav>
          <PagesNav to="/Kategori" icon={ChartColumnStacked}>Kategori</PagesNav>
        </div>
        <div className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Pengaturan</p>
          <PagesNav to="/Users" icon={User}>Users</PagesNav>
          <PagesNav to="/Role" icon={UserCog}>Role</PagesNav>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-sky-500 to-sky-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            M
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-700">Testing User</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebarr
