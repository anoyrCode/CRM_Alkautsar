import { useState, useEffect } from 'react'
import {
  UserStar, MessageSquareText, CircleCheckBig, Clock, CircleAlert,
  ChartSpline, ChartColumn, ClipboardPlus, MessageSquare, Download, Headset, Zap,
  Activity, InboxIcon, Sparkles, Trophy, Flag, X, MessageCircle, Info, Medal
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import StatisticChart from '../components/statisticChart'
import ResolutionGauge from '../components/resolutionGauge'
import PerformChart from '../components/performChart'
import DivisionRankChart from '../components/DivisionRankChart'
import PriorityDonutChart from '../components/PriorityDonutChart'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import DownloadReportModal from '../components/DownloadReportModal'
import { calcDivisionPoints } from '../utils/divisionPoints'

const QUICK_ACTIONS = [
  { label: 'Buat Laporan', icon: ClipboardPlus, to: '/Buat Laporan' },
  { label: 'Lihat Status', icon: MessageSquare, to: '/Data Komplain' },
  { label: 'Unduh Laporan', icon: Download,      to: '#' },
  { label: 'Hubungi CS',   icon: Headset,        to: 'https://wa.me/62895329572147' },
]

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

function Dashboard() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showCSModal,       setShowCSModal]       = useState(false)

  const [stats,          setStats]          = useState({ total: 0, selesai: 0, diproses: 0, pending: 0 })
  const [pieData,        setPieData]        = useState({ labels: [], pending: [], diproses: [], selesai: [] })
  const [barData,        setBarData]        = useState({ labels: [], selesai: [], belumSelesai: [] })
  const [avgDays,        setAvgDays]        = useState(0)
  const [todayComplaints,setTodayComplaints]= useState([])
  const [divStats,       setDivStats]       = useState([])
  const [priorityData,   setPriorityData]   = useState({})
  const [fetching,       setFetching]       = useState(true)
  const [divisiPoin,     setDivisiPoin]     = useState(0)
  const [divisiRank,     setDivisiRank]     = useState(0)
  const [totalDivisi,    setTotalDivisi]    = useState(0)
  const [rankList,       setRankList]       = useState([])
  const [isDivisiRole,   setIsDivisiRole]   = useState(false)
  const [showPoinInfo,   setShowPoinInfo]   = useState(false)
  const [showRankInfo,   setShowRankInfo]   = useState(false)

  useEffect(() => {
    if (!profile) return
    const fetchDashboard = async () => {
      setFetching(true)

      const perms    = profile.roles?.permissions ?? []
      const isAdmin  = perms.includes('komplain_semua')
      const isDivisi = perms.includes('komplain_diterima')
      setIsDivisiRole(isDivisi)

      let query = supabase.from('complaints').select('id, ticket_id, title, status, priority, created_at, updated_at, resolved_at, categories(name)')

      if (isAdmin) {
        // lihat semua
      } else if (isDivisi) {
        const { data: cats } = await supabase
          .from('categories').select('id').eq('assigned_role_id', profile.role_id)
        const catIds = cats?.map(c => c.id) ?? []
        if (catIds.length === 0) { setFetching(false); return }
        query = query.in('category_id', catIds)
      } else {
        query = query.eq('reporter_id', profile.id)
      }

      const { data: complaints } = await query

      if (!complaints) { setFetching(false); return }

      // Stats
      const total       = complaints.length
      const selesaiList = complaints.filter(c => c.status === 'Selesai')
      const selesai     = selesaiList.length
      const diproses    = complaints.filter(c => c.status === 'Diproses').length
      const pending     = complaints.filter(c => c.status === 'Pending').length
      setStats({ total, selesai, diproses, pending })

      // Aktivitas hari ini — max 5, terbaru di atas
      const todayStr = new Date().toDateString()
      const todayList = complaints
        .filter(c => new Date(c.created_at).toDateString() === todayStr)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setTodayComplaints(todayList)

      // Rata-rata hari penyelesaian
      if (selesaiList.length > 0) {
        const avg = selesaiList.reduce((sum, c) => {
          return sum + (new Date(c.updated_at) - new Date(c.created_at)) / 86400000
        }, 0) / selesaiList.length
        setAvgDays(avg)
      }

      // Stacked bar — per kategori + status
      const catMap = {}
      complaints.forEach(c => {
        const name = c.categories?.name ?? 'Lainnya'
        if (!catMap[name]) catMap[name] = { pending: 0, diproses: 0, selesai: 0 }
        if (c.status === 'Selesai')       catMap[name].selesai++
        else if (c.status === 'Diproses') catMap[name].diproses++
        else                              catMap[name].pending++
      })
      const catLabels = Object.keys(catMap)
      setPieData({
        labels:   catLabels,
        pending:  catLabels.map(l => catMap[l].pending),
        diproses: catLabels.map(l => catMap[l].diproses),
        selesai:  catLabels.map(l => catMap[l].selesai),
      })

      if (isAdmin) {
        const now = new Date()
        const monthComplaints = complaints.filter(c => {
          const d = new Date(c.created_at)
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        })

        const pointsMap = calcDivisionPoints(monthComplaints)

        const divMap = {}
        complaints.forEach(c => {
          const name = c.categories?.name ?? 'Lainnya'
          if (!divMap[name]) divMap[name] = { total: 0, selesai: 0 }
          divMap[name].total++
          if (c.status === 'Selesai') divMap[name].selesai++
        })

        const ranked = Object.entries(divMap)
          .map(([name, d]) => ({
            name,
            total:   d.total,
            selesai: d.selesai,
            points:  Math.round(pointsMap[name] ?? 0),
          }))
          .sort((a, b) => b.points - a.points)
        setDivStats(ranked)

        const pMap = { Critical: 0, High: 0, Medium: 0, Low: 0 }
        complaints.forEach(c => { if (c.priority && pMap[c.priority] !== undefined) pMap[c.priority]++ })
        setPriorityData(pMap)
      }

      if (isDivisi) {
        const now = new Date()
        const monthComplaints = complaints.filter(c => {
          const d = new Date(c.created_at)
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        })
        const pMap = calcDivisionPoints(monthComplaints)
        const total = Math.round(Object.values(pMap).reduce((sum, p) => sum + p, 0))
        setDivisiPoin(total)

        const [rolesRes, allRes, divsRes] = await Promise.all([
          supabase.from('roles').select('id, name'),
          supabase.from('complaints').select('priority, status, created_at, resolved_at, categories(assigned_role_id)'),
          supabase.from('categories').select('assigned_role_id').not('assigned_role_id', 'is', null),
        ])

        const rolesMap     = Object.fromEntries((rolesRes.data ?? []).map(r => [r.id, r.name]))
        const allComplaints = allRes.data ?? []
        const allRoleIds    = [...new Set((divsRes.data ?? []).map(c => c.assigned_role_id))]
        const monthAll      = allComplaints.filter(c => {
          const d = new Date(c.created_at)
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        })

        const rolePoints = Object.fromEntries(allRoleIds.map(id => [id, 0]))
        const mapped = monthAll.map(c => ({
          ...c,
          categories: { name: String(c.categories?.assigned_role_id ?? '') },
        }))
        const pointsByRoleId = calcDivisionPoints(mapped)
        Object.entries(pointsByRoleId).forEach(([rid, pts]) => {
          if (rolePoints[rid] !== undefined) rolePoints[rid] = pts
        })

        const sorted = Object.entries(rolePoints)
          .map(([rid, pts]) => ({ roleId: Number(rid), name: rolesMap[rid] ?? 'Divisi', points: Math.round(pts) }))
          .sort((a, b) => b.points - a.points)

        let curRank   = 0
        let lastPts   = null
        const rankedList = sorted.map((r, i) => {
          if (r.points !== lastPts) {
            curRank = i + 1
            lastPts = r.points
          }
          return { ...r, rank: curRank }
        })

        const myEntry  = rankedList.find(r => r.roleId === profile.role_id)
        const myPoints = myEntry?.points ?? 0
        const finalRank = myPoints === 0 ? 0 : (myEntry?.rank ?? 0)

        setDivisiRank(finalRank)
        setTotalDivisi(allRoleIds.length)
        setRankList(rankedList)
      }

      // Bar — Mei s/d Oktober tahun berjalan
      const year   = new Date().getFullYear()
      const months = [4, 5, 6, 7, 8, 9].map(m => ({ year, month: m, label: MONTH_NAMES[m] }))

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
  }, [profile])

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
        title={`Selamat datang, ${profile?.full_name ?? '...'}`}
        titleIcon={Sparkles}
        subtitle="Berikut pembaruan rekapitulasi komplain saat ini"
        badge={profile?.roles?.name ?? 'User'}
        badgeIcon={UserStar}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {isDivisiRole && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            label="Poin Divisi Bulan Ini"
            value={divisiPoin}
            delta={divisiPoin >= 0 ? `+${divisiPoin} poin bulan ini` : `${divisiPoin} poin bulan ini`}
            deltaColor={divisiPoin >= 50 ? 'text-emerald-600' : divisiPoin >= 0 ? 'text-amber-500' : 'text-red-500'}
            icon={Trophy}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            cardBg="bg-linear-to-br from-amber-100 via-amber-50 to-white"
            onClick={() => setShowPoinInfo(true)}
          />
          <StatCard
            label="Peringkat Divisi"
            value={divisiRank > 0 ? `#${divisiRank}` : '—'}
            delta={divisiRank > 0 ? `dari ${totalDivisi} divisi` : 'Belum ada poin bulan ini'}
            deltaColor={divisiRank === 1 ? 'text-emerald-600' : divisiRank > 0 && divisiRank <= 3 ? 'text-sky-600' : 'text-slate-400'}
            icon={Medal}
            iconBg={divisiRank === 1 ? 'bg-emerald-100' : divisiRank <= 3 ? 'bg-sky-100' : 'bg-slate-100'}
            iconColor={divisiRank === 1 ? 'text-emerald-600' : divisiRank <= 3 ? 'text-sky-600' : 'text-slate-400'}
            cardBg="bg-linear-to-br from-sky-100 via-sky-50 to-white"
            onClick={() => setShowRankInfo(true)}
          />
        </div>
      )}

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
            <span className="text-sm font-bold text-slate-800">
              {(profile?.roles?.permissions ?? []).includes('komplain_semua')
                ? 'Statistik Per Kategori'
                : 'Rata-rata Waktu Penyelesaian'}
            </span>
          </div>
          <div className="h-48 md:h-64">
            {fetching
              ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">Memuat...</div>
              : (profile?.roles?.permissions ?? []).includes('komplain_semua')
                ? <StatisticChart labels={pieData.labels} pending={pieData.pending} diproses={pieData.diproses} selesai={pieData.selesai} />
                : <ResolutionGauge avgDays={avgDays} selesaiCount={stats.selesai} />
            }
          </div>
        </div>
      </div>

      {(profile?.roles?.permissions ?? []).includes('komplain_semua') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-bold text-slate-800">Peringkat Divisi</span>
            </div>
            <div className="h-48 md:h-64">
              {fetching
                ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">Memuat...</div>
                : <DivisionRankChart data={divStats} />
              }
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-bold text-slate-800">Distribusi Prioritas</span>
            </div>
            <div className="h-48 md:h-64">
              {fetching
                ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">Memuat...</div>
                : <PriorityDonutChart data={priorityData} />
              }
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-slate-800">Aktivitas Hari Ini</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>
        {fetching ? (
          <div className="flex items-center justify-center gap-3 py-8 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Memuat...
          </div>
        ) : todayComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <InboxIcon className="w-5 h-5 text-slate-300" />
            </div>
            <span className="text-sm text-slate-400">Belum ada komplain masuk hari ini</span>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50 max-h-52 overflow-y-auto pr-1">
            {todayComplaints.map(c => {
              const statusDot = c.status === 'Selesai' ? 'bg-emerald-400'
                              : c.status === 'Diproses' ? 'bg-amber-400'
                              : 'bg-red-400'
              const statusBadge = c.status === 'Selesai'
                ? 'bg-emerald-100 text-emerald-700'
                : c.status === 'Diproses'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
              const time = new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={c.id} className="flex items-center gap-3 py-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-sky-600 shrink-0">{c.ticket_id}</span>
                      <span className="text-xs text-slate-700 truncate">{c.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{c.categories?.name ?? '—'}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}>{c.status}</span>
                    <span className="text-[11px] text-slate-400">{time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
              onClick={() => label === 'Unduh Laporan' ? setShowDownloadModal(true) : label === 'Hubungi CS' ? setShowCSModal(true) : navigate(to)}
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

      <DownloadReportModal open={showDownloadModal} onClose={() => setShowDownloadModal(false)} />

      {showCSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCSModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Butuh Bantuan?</h2>
              <button type="button" onClick={() => setShowCSModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menemui kendala atau memiliki pertanyaan? Tim CS kami siap membantu Anda melalui WhatsApp.
              </p>
              <span className="text-sm font-semibold text-slate-700">0895-3295-72147</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCSModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => { window.open('https://wa.me/62895329572147', '_blank'); setShowCSModal(false) }}
                className="flex-1 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {showRankInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowRankInfo(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Medal className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Peringkat Divisi</h2>
                  <p className="text-[11px] text-slate-400">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowRankInfo(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5">
              {rankList.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">Belum ada data peringkat</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {rankList.map(r => {
                    const isCurrent = r.roleId === profile.role_id
                    const rankNum   = r.rank
                    const medalCls  = rankNum === 1 ? 'bg-amber-100 text-amber-700'
                                    : rankNum === 2 ? 'bg-slate-200 text-slate-700'
                                    : rankNum === 3 ? 'bg-orange-100 text-orange-700'
                                    : 'bg-slate-50 text-slate-500'
                    const pointCls  = r.points >= 50 ? 'text-emerald-600'
                                    : r.points >= 0  ? 'text-amber-500'
                                    : 'text-red-500'
                    return (
                      <div
                        key={r.roleId}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                          isCurrent ? 'bg-sky-50 border-sky-200' : 'bg-white border-slate-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${medalCls}`}>
                          {rankNum}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800 truncate">{r.name}</span>
                            {isCurrent && <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded">Anda</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-bold ${pointCls}`}>{r.points >= 0 ? `+${r.points}` : r.points}</p>
                          <p className="text-[10px] text-slate-400">poin</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex items-start gap-2 mt-4 bg-slate-50 rounded-xl p-3">
                <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed">Peringkat dihitung berdasarkan poin bulan berjalan. Reset setiap awal bulan.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPoinInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowPoinInfo(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Cara Penilaian Poin</h2>
              </div>
              <button type="button" onClick={() => setShowPoinInfo(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-2">
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Poin dihitung otomatis setiap bulan berdasarkan kinerja penanganan komplain divisi Anda.</p>

              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-emerald-700 mb-1.5">Komplain Selesai</p>
                  <p className="text-xs text-emerald-600 mb-2.5">Poin = <span className="font-semibold">5 × Multiplier Prioritas</span> + Bonus Kecepatan</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[['Critical', '×3 (15 poin)', 'text-red-600 bg-red-50'], ['High', '×2 (10 poin)', 'text-orange-600 bg-orange-50'], ['Medium', '×1 (5 poin)', 'text-amber-600 bg-amber-50'], ['Low', '×0.5 (2.5 poin)', 'text-slate-600 bg-slate-100']].map(([label, val, cls]) => (
                      <div key={label} className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg text-[11px] ${cls}`}>
                        <span className="font-semibold">{label}</span>
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-sky-50 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-sky-700 mb-2">Bonus Kecepatan Penyelesaian</p>
                  <div className="space-y-1.5">
                    {[['Selesai dalam 1 hari', '+5 poin', 'text-emerald-600'], ['Selesai dalam 3 hari', '+3 poin', 'text-emerald-600'], ['Selesai dalam 7 hari', '+0 poin', 'text-slate-500'], ['Lebih dari 7 hari', '-3 poin', 'text-red-500']].map(([label, val, cls]) => (
                      <div key={label} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600">{label}</span>
                        <span className={`font-bold ${cls}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-red-700 mb-2">Penalti Komplain Belum Selesai</p>
                  <div className="space-y-1.5">
                    {[['Belum selesai > 7 hari', '-3 poin', 'text-red-500'], ['Belum selesai > 14 hari', '-8 poin', 'text-red-600']].map(([label, val, cls]) => (
                      <div key={label} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600">{label}</span>
                        <span className={`font-bold ${cls}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3 bg-slate-50 rounded-xl p-3">
                <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed">Poin direset setiap awal bulan. Hanya komplain pada bulan berjalan yang dihitung.</p>
              </div>
            </div>

            <div className="p-5 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowPoinInfo(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Dashboard
