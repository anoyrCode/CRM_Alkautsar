import {
  UserStar, MessageSquareText, CircleCheckBig, Clock, CircleAlert,
  ChartSpline, ChartColumn, ClipboardPlus, MessageSquare, Download, Headset, Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import StatisticChart from '../components/statisticChart'
import PerformChart from '../components/performChart'

const username = '[testing-user]'

const STATS = [
  { label: 'Total Komplain', value: 0, delta: '+0 hari ini', deltaColor: 'text-sky-600', icon: MessageSquareText, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Selesai', value: 0, delta: '+0 hari ini', deltaColor: 'text-emerald-600', icon: CircleCheckBig, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Diproses', value: 0, delta: 'Tidak ada perubahan', deltaColor: 'text-slate-400', icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Pending', value: 0, delta: '+0 hari ini', deltaColor: 'text-red-500', icon: CircleAlert, iconBg: 'bg-red-100', iconColor: 'text-red-500' },
]

const QUICK_ACTIONS = [
  { label: 'Buat Laporan', icon: ClipboardPlus, to: '/Buat Laporan' },
  { label: 'Lihat Status', icon: MessageSquare, to: '/Data Komplain' },
  { label: 'Unduh Laporan', icon: Download, to: '#' },
  { label: 'Hubungi CS', icon: Headset, to: '#' },
]

function Dashboard() {
  const navigate = useNavigate()
  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title={`Selamat datang, ${username} 🎉`}
        subtitle="Berikut pembaruan rekapitulasi komplain saat ini"
        badge="Administrator"
        badgeIcon={UserStar}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ChartSpline className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-slate-800">Kinerja Penanganan Komplain</span>
          </div>
          <div className="h-48 md:h-64"><PerformChart /></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ChartColumn className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-slate-800">Statistik Per Kategori</span>
          </div>
          <div className="h-48 md:h-64"><StatisticChart /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-bold text-slate-800">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="bg-sky-50 border border-sky-100 rounded-xl py-4 flex flex-col items-center gap-2 hover:bg-sky-100 hover:border-sky-200 transition-all duration-150"
            >
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-xs font-semibold text-sky-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
