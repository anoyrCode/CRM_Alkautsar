import { useState, useEffect } from 'react'
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
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const QUICK_ACTIONS = [
  { label: 'Buat Laporan', icon: ClipboardPlus, to: '/Buat Laporan' },
  { label: 'Lihat Status', icon: MessageSquare, to: '/Data Komplain' },
  { label: 'Unduh Laporan', icon: Download,      to: '#' },
  { label: 'Hubungi CS',   icon: Headset,        to: '#' },
]

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

function Dashboard() {
  const { profile } = useAuth()
  const navigate    = useNavigate()

  const [stats, setStats] = useState({ total: 0, selesai: 0, diproses: 0, pending: 0 })
  const [pieData,  setPieData]  = useState({ labels: [], values: [] })
  const [barData,  setBarData]  = useState({ labels: [], selesai: [], belumSelesai: [] })
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setFetching(true)

      const { data: complaints } = await supabase
        .from('complaints')
        .select('status, created_at, categories(name)')

      if (!complaints) { setFetching(false); return }

      // Stats
      const total    = complaints.length
      const selesai  = complaints.filter(c => c.status === 'Selesai').length
      const diproses = complaints.filter(c => c.status === 'Diproses').length
      const pending  = complaints.filter(c => c.status === 'Pending').length
      setStats({ total, selesai, diproses, pending })

      // Pie — per kategori
      const catMap = {}
      complaints.forEach(c => {
        const name = c.categories?.name ?? 'Lainnya'
        catMap[name] = (catMap[name] ?? 0) + 1
      })
      setPieData({ labels: Object.keys(catMap), values: Object.values(catMap) })

      // Bar — 6 bulan terakhir
      const now     = new Date()
      const months  = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
        return { year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] }
      })

      const barSelesai      = months.map(m => complaints.filter(c => {
        const d = new Date(c.created_at)
        return d.getFullYear() === m.year && d.getMonth() === m.month && c.status === 'Selesai'
      }).length)

      const barBelumSelesai = months.map(m => complaints.filter(c => {
        const d = new Date(c.created_at)
        return d.getFullYear() === m.year && d.getMonth() === m.month && c.status !== 'Selesai'
      }).length)

      setBarData({ labels: months.map(m => m.label), selesai: barSelesai, belumSelesai: barBelumSelesai })
      setFetching(false)
    }

    fetchDashboard()
  }, [])

  const STATS = [
    { label: 'Total Komplain', value: stats.total,    delta: `${stats.total} komplain`,     deltaColor: 'text-sky-600',     icon: MessageSquareText, iconBg: 'bg-sky-100',     iconColor: 'text-sky-600' },
    { label: 'Selesai',        value: stats.selesai,  delta: `${stats.selesai} selesai`,    deltaColor: 'text-emerald-600', icon: CircleCheckBig,    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Diproses',       value: stats.diproses, delta: `${stats.diproses} diproses`,  deltaColor: 'text-slate-400',   icon: Clock,             iconBg: 'bg-amber-100',   iconColor: 'text-amber-600' },
    { label: 'Pending',        value: stats.pending,  delta: `${stats.pending} pending`,    deltaColor: 'text-red-500',     icon: CircleAlert,       iconBg: 'bg-red-100',     iconColor: 'text-red-500' },
  ]

  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title={`Selamat datang, ${profile?.full_name ?? '...'} 🎉`}
        subtitle="Berikut pembaruan rekapitulasi komplain saat ini"
        badge={profile?.roles?.name ?? 'User'}
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
          <div className="h-48 md:h-64">
            {fetching
              ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">Memuat...</div>
              : <PerformChart labels={barData.labels} selesai={barData.selesai} belumSelesai={barData.belumSelesai} />
            }
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ChartColumn className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-slate-800">Statistik Per Kategori</span>
          </div>
          <div className="h-48 md:h-64">
            {fetching
              ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">Memuat...</div>
              : <StatisticChart labels={pieData.labels} values={pieData.values} />
            }
          </div>
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
