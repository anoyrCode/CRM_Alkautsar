import { useState, useEffect } from 'react'
import { MessageSquareText, CircleCheckBig, Clock, CircleAlert, Pencil, Trash2, FileText, X, Tag, Calendar, AlignLeft, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import EditComplaintModal from '../components/EditComplaintModal'
import DeleteComplaintModal from '../components/DeleteComplaintModal'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ComplaintThread from '../components/ComplaintThread'

const STATUS_STYLES = {
  Selesai:  { bg: 'bg-emerald-100 text-emerald-700', icon: CircleCheckBig },
  Diproses: { bg: 'bg-amber-100 text-amber-700',     icon: Clock },
  Pending:  { bg: 'bg-red-100 text-red-700',         icon: CircleAlert },
}

const PRIORITY_STYLES = {
  High:     'bg-red-100 text-red-700',
  Medium:   'bg-amber-100 text-amber-700',
  Low:      'bg-emerald-100 text-emerald-700',
  Critical: 'bg-purple-100 text-purple-700',
}

function StatusBadge({ status }) {
  const s    = STATUS_STYLES[status] ?? { bg: 'bg-slate-100 text-slate-600', icon: CircleAlert }
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

const FILTERS = [
  { name: 'status', options: [
    { value: '',         label: 'Semua Status' },
    { value: 'Selesai',  label: 'Selesai' },
    { value: 'Diproses', label: 'Diproses' },
    { value: 'Pending',  label: 'Pending' },
  ]},
]

function DetailModal({ complaint, onClose, currentUser }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{complaint.ticket_id}</p>
              <p className="text-xs text-slate-400">Detail Laporan</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">{complaint.title}</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Kategori</p>
                <p className="text-sm font-semibold text-slate-700">{complaint.categories?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Tanggal Dibuat</p>
                <p className="text-sm font-semibold text-slate-700">
                  {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
            {complaint.location && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Lokasi</p>
                  <p className="text-sm font-semibold text-slate-700">{complaint.location}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" />Deskripsi
            </p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
              {complaint.description || 'Tidak ada deskripsi.'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5" />Catatan Penangan
            </p>
            <p className="text-sm bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
              {complaint.handler_notes
                ? <span className="text-slate-600">{complaint.handler_notes}</span>
                : <span className="text-slate-400 italic">Belum ada catatan dari penangan.</span>
              }
            </p>
          </div>

          <ComplaintThread complaintId={complaint.id} currentUser={currentUser} />
        </div>

        <div className="px-5 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function MyComplaint() {
  const { profile }  = useAuth()
  const [complaints, setComplaints] = useState([])
  const [fetching,   setFetching]   = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterValues, setFilterValues] = useState({ status: '' })
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)
  const [unreadMap,    setUnreadMap]    = useState({})

  useEffect(() => {
    if (!profile?.id) return
    const fetch = async () => {
      setFetching(true)
      const { data } = await supabase
        .from('complaints')
        .select('*, categories(name)')
        .eq('reporter_id', profile.id)
        .order('created_at', { ascending: false })
      setComplaints(data ?? [])
      setFetching(false)

      if (!data?.length) return
      const ids = data.map(c => c.id)
      const [{ data: msgs }, { data: reads }] = await Promise.all([
        supabase.from('complaint_messages').select('complaint_id, created_at').in('complaint_id', ids),
        supabase.from('complaint_message_reads').select('complaint_id, last_read_at').eq('user_id', profile.id),
      ])
      const readMap = Object.fromEntries((reads ?? []).map(r => [r.complaint_id, r.last_read_at]))
      const newUnread = {}
      for (const msg of (msgs ?? [])) {
        const lastRead = readMap[msg.complaint_id]
        if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
          newUnread[msg.complaint_id] = (newUnread[msg.complaint_id] ?? 0) + 1
        }
      }
      setUnreadMap(newUnread)
    }
    fetch()
  }, [profile?.id])

  const handleFilterChange = (name, val) => setFilterValues(prev => ({ ...prev, [name]: val }))

  const q = search.toLowerCase()
  const filtered = complaints.filter(c => {
    const matchSearch = !q ||
      c.ticket_id?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    const matchStatus = !filterValues.status || c.status === filterValues.status
    return matchSearch && matchStatus
  })

  const total    = complaints.length
  const selesai  = complaints.filter(c => c.status === 'Selesai').length
  const diproses = complaints.filter(c => c.status === 'Diproses').length
  const pending  = complaints.filter(c => c.status === 'Pending').length

  const handleEditSaved = async id => {
    const { data } = await supabase
      .from('complaints')
      .select('*, categories(name)')
      .eq('id', id)
      .single()
    setComplaints(prev => prev.map(c => c.id === id ? (data ?? c) : c))
    setEditTarget(null)
  }

  const handleDeleted = id => {
    setComplaints(prev => prev.filter(c => c.id !== id))
    setDeleteTarget(null)
  }

  const COLUMNS = [
    { key: 'ticket_id',   label: 'ID Tiket',  render: v => <span className="font-semibold text-sky-600">{v}</span> },
    { key: 'description', label: 'Deskripsi', render: v => <span className="text-slate-700 line-clamp-1 max-w-xs">{v}</span> },
    { key: 'categories',  label: 'Kategori',  render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v?.name ?? '—'}</span> },
    { key: 'status',      label: 'Status',    render: v => <StatusBadge status={v} /> },
    { key: 'priority',    label: 'Prioritas', render: v => <PriorityBadge priority={v} /> },
    { key: 'created_at',  label: 'Tanggal',   render: v => <span className="text-slate-400 text-xs">{v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span> },
    { key: 'aksi', label: 'Aksi', render: (_, row) => {
      const editable = row.status === 'Pending' || row.status === 'Diproses'
      return (
        <div className="flex gap-1.5">
          <button
            onClick={() => { setDetailTarget(row); setUnreadMap(prev => ({ ...prev, [row.id]: 0 })) }}
            className="relative w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors"
            title="Lihat Detail"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            {!!unreadMap[row.id] && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadMap[row.id] > 9 ? '9+' : unreadMap[row.id]}
              </span>
            )}
          </button>
          {editable && (
            <>
              <button
                onClick={() => setEditTarget(row)}
                className="w-7 h-7 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center transition-colors"
                title="Edit Komplain"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            </>
          )}
        </div>
      )
    }},
  ]

  const STATS = [
    { label: 'Total Laporan', value: total,    delta: `${total} laporan`,     deltaColor: 'text-sky-600',     icon: MessageSquareText, iconBg: 'bg-sky-100',     iconColor: 'text-sky-600' },
    { label: 'Selesai',       value: selesai,  delta: `${selesai} selesai`,   deltaColor: 'text-emerald-600', icon: CircleCheckBig,    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Diproses',      value: diproses, delta: `${diproses} diproses`, deltaColor: 'text-slate-400',   icon: Clock,             iconBg: 'bg-amber-100',   iconColor: 'text-amber-600' },
    { label: 'Pending',       value: pending,  delta: `${pending} pending`,   deltaColor: 'text-red-500',     icon: CircleAlert,       iconBg: 'bg-red-100',     iconColor: 'text-red-500' },
  ]

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
      <SearchFilterBar
        placeholder="Cari berdasarkan ID atau Deskripsi..."
        filters={FILTERS}
        value={search}
        onSearch={setSearch}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />
      {fetching ? (
        <div className="bg-white rounded-xl shadow-sm p-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          Memuat data...
        </div>
      ) : (
        <DataTable columns={COLUMNS} data={filtered} />
      )}

      <AnimatePresence>
        {detailTarget && (
          <DetailModal
            complaint={detailTarget}
            onClose={() => setDetailTarget(null)}
            currentUser={profile}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <EditComplaintModal
            complaint={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handleEditSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteComplaintModal
            complaint={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDelete={handleDeleted}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MyComplaint
