import { useState, useEffect } from 'react'
import { MessageSquareText, CircleCheckBig, Clock, CircleAlert, Eye, X, ShieldCheck, FileText, Building2, User as UserIcon, Calendar, Tag, AlignLeft, Paperclip, Download, FileImage, FileType, Pencil, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import EditComplaintModal from '../components/EditComplaintModal'
import DeleteComplaintModal from '../components/DeleteComplaintModal'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

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

const STATUS_OPTIONS = ['Pending', 'Diproses', 'Selesai']

function ConfirmSelesaiModal({ complaint, onConfirm, onCancel, saving }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
      >
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Konfirmasi Penyelesaian</h3>
            <p className="text-sm text-slate-500">
              Apakah komplain <span className="font-semibold text-slate-700">{complaint.ticket_id}</span> ini sudah benar-benar terselesaikan?
            </p>
            <p className="text-xs text-slate-400 mt-2">Status tidak dapat dikembalikan ke Pending setelah ditandai Selesai.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Belum, Kembali
            </button>
            <button
              onClick={onConfirm}
              disabled={saving}
              className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Menyimpan...' : 'Ya, Selesaikan'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FileIcon({ name }) {
  const ext = name?.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FileImage className="w-3.5 h-3.5 text-sky-500" />
  return <FileType className="w-3.5 h-3.5 text-slate-400" />
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function DetailModal({ complaint, onClose }) {
  const divisionName = complaint.categories?.assigned_role?.name ?? '—'
  const [attachments, setAttachments] = useState([])
  const [loadingAtt,  setLoadingAtt]  = useState(true)

  useEffect(() => {
    supabase
      .from('complaint_attachments')
      .select('id, file_name, file_url, file_size')
      .eq('complaint_id', complaint.id)
      .then(({ data }) => { setAttachments(data ?? []); setLoadingAtt(false) })
  }, [complaint.id])

  const infoRows = [
    { label: 'Pelapor',        value: complaint.reporter?.full_name ?? '—',   Icon: UserIcon },
    { label: 'Kategori',       value: complaint.categories?.name ?? '—',       Icon: Tag },
    { label: 'Tanggal Dibuat', value: complaint.created_at
        ? new Date(complaint.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—', Icon: Calendar },
  ]

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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{complaint.ticket_id}</p>
              <p className="text-xs text-slate-400">Detail Komplain</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Judul + badge */}
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">{complaint.title}</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          {/* Info rows */}
          <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
            {infoRows.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deskripsi */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" />Deskripsi
            </p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
              {complaint.description || 'Tidak ada deskripsi.'}
            </p>
          </div>

          {/* Lampiran */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />Dokumen Pendukung
            </p>
            {loadingAtt ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                Memuat lampiran...
              </div>
            ) : attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Tidak ada dokumen pendukung.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-sky-50 hover:border-sky-200 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <FileIcon name={att.file_name} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-slate-700 truncate group-hover:text-sky-700 transition-colors">{att.file_name}</p>
                      {att.file_size && <p className="text-xs text-slate-400">{formatSize(att.file_size)}</p>}
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Divisi */}
          <div className="bg-sky-50 rounded-xl p-4 flex items-center gap-3 border border-sky-100">
            <div className="w-9 h-9 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Divisi Penanggung Jawab</p>
              <p className="text-sm font-bold text-sky-700">{divisionName}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
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

function EditStatusModal({ complaint, onClose, onSave }) {
  const [status,  setStatus]  = useState(complaint.status)
  const [saving,  setSaving]  = useState(false)
  const [errMsg,  setErrMsg]  = useState('')
  const [confirm, setConfirm] = useState(false)

  const doSave = async () => {
    setSaving(true)
    setErrMsg('')
    const { error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', complaint.id)
    setSaving(false)
    if (error) { setErrMsg(error.message); setConfirm(false); return }
    onSave(complaint.id, status)
  }

  const handleSave = () => {
    if (status === 'Selesai' && complaint.status !== 'Selesai') {
      setConfirm(true)
    } else {
      doSave()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Update Status Komplain</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-lg px-4 py-3 flex flex-col gap-1">
            <span className="text-xs text-slate-400">{complaint.ticket_id}</span>
            <span className="text-sm font-semibold text-slate-700">{complaint.title}</span>
            <span className="text-xs text-slate-500 line-clamp-2">{complaint.description}</span>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Status Baru</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    status === s
                      ? s === 'Selesai'  ? 'bg-emerald-500 text-white border-emerald-500'
                      : s === 'Diproses' ? 'bg-amber-500 text-white border-amber-500'
                      :                    'bg-red-500 text-white border-red-500'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        {errMsg && <div className="mx-5 mb-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{errMsg}</div>}
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving || status === complaint.status} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirm && (
          <ConfirmSelesaiModal
            complaint={complaint}
            saving={saving}
            onConfirm={doSave}
            onCancel={() => setConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CompliantData() {
  const { profile } = useAuth()
  const [complaints,     setComplaints]     = useState([])
  const [fetching,       setFetching]       = useState(true)
  const [editComplaint,  setEditComplaint]  = useState(null)
  const [detailComplaint, setDetailComplaint] = useState(null)
  const [editFull,       setEditFull]       = useState(null)
  const [deleteTarget,   setDeleteTarget]   = useState(null)
  const [search,         setSearch]         = useState('')
  const [filterValues,   setFilterValues]   = useState({ status: '' })

  const isAdmin = (profile?.roles?.permissions ?? []).includes('komplain_semua')

  useEffect(() => {
    if (!profile) return
    const load = async () => {
      setFetching(true)
      const perms     = profile.roles?.permissions ?? []
      const isAdmin   = perms.includes('komplain_semua')
      const isDivisi  = perms.includes('komplain_diterima')

      // Tidak punya permission komplain apapun → kosong
      if (!isAdmin && !isDivisi) {
        setComplaints([])
        setFetching(false)
        return
      }

      let query = supabase
        .from('complaints')
        .select('*, reporter:profiles!reporter_id(full_name), categories(name, assigned_role:roles!assigned_role_id(name))')
        .order('created_at', { ascending: false })

      // Divisi lihat semua komplain yang kategorinya ditujukan ke role mereka
      if (!isAdmin && isDivisi) {
        const { data: cats } = await supabase
          .from('categories')
          .select('id')
          .eq('assigned_role_id', profile.role_id)
        const catIds = cats?.map(c => c.id) ?? []
        if (catIds.length === 0) {
          setComplaints([])
          setFetching(false)
          return
        }
        query = query.in('category_id', catIds)
      }

      const { data, error } = await query
      if (error) console.error('complaintData fetch error:', error)
      setComplaints(data ?? [])
      setFetching(false)
    }
    load()
  }, [profile])

  const handleStatusSaved = (id, newStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    setEditComplaint(null)
  }

  const handleEditSaved = async (id, _payload) => {
    const { data } = await supabase
      .from('complaints')
      .select('*, reporter:profiles!reporter_id(full_name), categories(name, assigned_role:roles!assigned_role_id(name))')
      .eq('id', id)
      .single()
    setComplaints(prev => prev.map(c => c.id === id ? (data ?? c) : c))
    setEditFull(null)
  }

  const handleDeleted = id => {
    setComplaints(prev => prev.filter(c => c.id !== id))
    setDeleteTarget(null)
  }

  const handleFilterChange = (name, val) => setFilterValues(prev => ({ ...prev, [name]: val }))

  const q = search.toLowerCase()
  const filtered = complaints.filter(c => {
    const matchSearch = !q ||
      c.ticket_id?.toLowerCase().includes(q) ||
      c.title?.toLowerCase().includes(q) ||
      c.reporter?.full_name?.toLowerCase().includes(q)
    const matchStatus = !filterValues.status || c.status === filterValues.status
    return matchSearch && matchStatus
  })

  const total    = complaints.length
  const selesai  = complaints.filter(c => c.status === 'Selesai').length
  const diproses = complaints.filter(c => c.status === 'Diproses').length
  const pending  = complaints.filter(c => c.status === 'Pending').length

  const STATS = [
    { label: 'Total Komplain', value: total,    delta: `${total} komplain`,    deltaColor: 'text-sky-600',     icon: MessageSquareText, iconBg: 'bg-sky-100',     iconColor: 'text-sky-600' },
    { label: 'Selesai',        value: selesai,  delta: `${selesai} selesai`,   deltaColor: 'text-emerald-600', icon: CircleCheckBig,    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Diproses',       value: diproses, delta: `${diproses} diproses`, deltaColor: 'text-slate-400',   icon: Clock,             iconBg: 'bg-amber-100',   iconColor: 'text-amber-600' },
    { label: 'Pending',        value: pending,  delta: `${pending} pending`,   deltaColor: 'text-red-500',     icon: CircleAlert,       iconBg: 'bg-red-100',     iconColor: 'text-red-500' },
  ]

  const COLUMNS = [
    { key: 'ticket_id',   label: 'ID Tiket',  render: v => <span className="font-semibold text-sky-600">{v}</span> },
    { key: 'title',       label: 'Judul',     render: v => <span className="text-slate-700 line-clamp-1 max-w-xs">{v}</span> },
    { key: 'reporter',    label: 'Pelapor',   render: v => <span className="text-slate-600">{v?.full_name ?? '—'}</span> },
    { key: 'categories',  label: 'Kategori',  render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v?.name ?? '—'}</span> },
    { key: 'status',      label: 'Status',    render: v => <StatusBadge status={v} /> },
    { key: 'priority',    label: 'Prioritas', render: v => <PriorityBadge priority={v} /> },
    { key: 'created_at',  label: 'Tanggal',   render: v => <span className="text-slate-400 text-xs">{v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span> },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <div className="flex gap-1.5">
        <button
          onClick={() => setDetailComplaint(row)}
          className="w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors"
          title="Lihat Detail"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
        </button>
        <button
          onClick={() => setEditComplaint(row)}
          className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors"
          title="Edit Status"
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" />
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => setEditFull(row)}
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
    )},
  ]

  return (
    <>
      <motion.div
        className="p-5 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader title="Data Komplain" subtitle="Status perkembangan komplain terbaru" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
        <SearchFilterBar
          placeholder="Cari berdasarkan ID, Judul, atau Nama Pelapor..."
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
      </motion.div>

      <AnimatePresence>
        {detailComplaint && (
          <DetailModal
            complaint={detailComplaint}
            onClose={() => setDetailComplaint(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editComplaint && (
          <EditStatusModal
            complaint={editComplaint}
            onClose={() => setEditComplaint(null)}
            onSave={handleStatusSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editFull && (
          <EditComplaintModal
            complaint={editFull}
            onClose={() => setEditFull(null)}
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
    </>
  )
}

export default CompliantData
