import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, LogIn, MonitorDot } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

const ACTION_STYLES = {
  login:      { bg: 'bg-emerald-100 text-emerald-700', label: 'Login' },
  page_visit: { bg: 'bg-sky-100 text-sky-700',         label: 'Kunjungan Halaman' },
}

const FILTERS = [
  { name: 'action', options: [
    { value: '',           label: 'Semua Aktivitas' },
    { value: 'login',      label: 'Login' },
    { value: 'page_visit', label: 'Kunjungan Halaman' },
  ]},
]

function ActionBadge({ action }) {
  const s = ACTION_STYLES[action] ?? { bg: 'bg-slate-100 text-slate-600', label: action }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      {action === 'login' ? <LogIn className="w-3 h-3" /> : <MonitorDot className="w-3 h-3" />}
      {s.label}
    </span>
  )
}

function ActivityLogPage() {
  const [logs,         setLogs]         = useState([])
  const [fetching,     setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState('')
  const [search,       setSearch]       = useState('')
  const [filterValues, setFilterValues] = useState({ action: '' })

  useEffect(() => {
    const fetchLogs = async () => {
      setFetching(true)
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .not('role_name', 'in', '("Admin","SuperAdmin")')
        .order('created_at', { ascending: false })
        .limit(500)
      if (error) setFetchError(error.message)
      setLogs(data ?? [])
      setFetching(false)
    }
    fetchLogs()

    const channel = supabase
      .channel('activity_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, payload => {
        const row = payload.new
        if (row.role_name === 'Admin' || row.role_name === 'SuperAdmin') return
        setLogs(prev => [row, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleFilterChange = (name, val) => setFilterValues(prev => ({ ...prev, [name]: val }))

  const q = search.toLowerCase()
  const filtered = logs.filter(l => {
    const matchSearch = !q ||
      l.full_name?.toLowerCase().includes(q) ||
      l.role_name?.toLowerCase().includes(q)
    const matchAction = !filterValues.action || l.action === filterValues.action
    return matchSearch && matchAction
  })

  const COLUMNS = [
    { key: 'full_name',  label: 'Nama',      render: v => <span className="font-semibold text-slate-800">{v ?? '—'}</span> },
    { key: 'role_name',  label: 'Role',      render: v => <span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium">{v ?? '—'}</span> },
    { key: 'action',     label: 'Aktivitas', render: v => <ActionBadge action={v} /> },
    { key: 'page',       label: 'Halaman',   render: v => <span className="text-slate-500 text-xs font-mono">{v ?? '—'}</span> },
    { key: 'created_at', label: 'Waktu',     render: v => (
      <span className="text-slate-400 text-xs whitespace-nowrap">
        {v ? new Date(v).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
      </span>
    )},
  ]

  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Log Aktivitas"
        subtitle="Rekam jejak login dan akses halaman pengguna"
        badge="Admin Only"
        badgeIcon={Activity}
      />
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">
          Gagal memuat: {fetchError}
        </div>
      )}
      <SearchFilterBar
        placeholder="Cari berdasarkan nama atau role..."
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
  )
}

export default ActivityLogPage
