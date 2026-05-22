import { MessageSquareText, CircleCheckBig, Clock, CircleAlert, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'

const STATS = [
  { label: 'Total Komplain', value: 0, delta: '+0 hari ini', deltaColor: 'text-sky-600', icon: MessageSquareText, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Selesai', value: 0, delta: '+0 hari ini', deltaColor: 'text-emerald-600', icon: CircleCheckBig, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Diproses', value: 0, delta: 'Tidak ada perubahan', deltaColor: 'text-slate-400', icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Pending', value: 0, delta: '+0 hari ini', deltaColor: 'text-red-500', icon: CircleAlert, iconBg: 'bg-red-100', iconColor: 'text-red-500' },
]

const STATUS_STYLES = {
  Selesai: { bg: 'bg-emerald-100 text-emerald-700', icon: CircleCheckBig },
  Diproses: { bg: 'bg-amber-100 text-amber-700', icon: Clock },
  Pending: { bg: 'bg-red-100 text-red-700', icon: CircleAlert },
}

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
  Critical: 'bg-purple-100 text-purple-700',
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: 'bg-slate-100 text-slate-600', icon: CircleAlert }
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  )
}

function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[priority] ?? 'bg-slate-100 text-slate-600'}`}>
      {priority}
    </span>
  )
}

const SAMPLE_DATA = [
  { id: 'CMP-2026-001', judul: 'Makanan sering dijumpai tanpa lauk...', pelapor: 'testing-user', kategori: 'Konsumsi', status: 'Pending', prioritas: 'High', tanggal: '02 Jun 2026' },
  { id: 'CMP-2026-002', judul: 'Pelayanannya tidak buruk dan...', pelapor: 'testing-user', kategori: 'Pelayanan', status: 'Diproses', prioritas: 'Medium', tanggal: '05 Jun 2026' },
]

const COLUMNS = [
  { key: 'id', label: 'ID Tiket', render: v => <span className="font-semibold text-sky-600">{v}</span> },
  { key: 'judul', label: 'Judul' },
  { key: 'pelapor', label: 'Pelapor' },
  { key: 'kategori', label: 'Kategori', render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v}</span> },
  { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
  { key: 'prioritas', label: 'Prioritas', render: v => <PriorityBadge priority={v} /> },
  { key: 'tanggal', label: 'Tanggal', render: v => <span className="text-slate-400">{v}</span> },
  { key: 'aksi', label: 'Aksi', render: () => (
    <button className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
      <Eye className="w-3.5 h-3.5 text-sky-600" />
    </button>
  )},
]

const FILTERS = [
  { name: 'status', options: [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Diproses', label: 'Diproses' },
    { value: 'Pending', label: 'Pending' },
  ]},
  { name: 'kategori', options: [
    { value: '', label: 'Semua Kategori' },
    { value: 'Pelayanan', label: 'Pelayanan' },
    { value: 'Konsumsi', label: 'Konsumsi' },
    { value: 'Fasilitas', label: 'Fasilitas' },
    { value: 'Administrasi', label: 'Administrasi' },
  ]},
]

function MyComplaint() {
  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Laporan Saya" subtitle="Status perkembangan laporan Anda" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <SearchFilterBar placeholder="Cari berdasarkan ID, Judul, atau Nama Pelapor..." filters={FILTERS} />
      <DataTable columns={COLUMNS} data={SAMPLE_DATA} />
    </motion.div>
  )
}

export default MyComplaint
