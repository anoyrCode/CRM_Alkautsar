import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Activity, LogIn, MonitorDot, ShieldCheck, Lock } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'
import { verifyTOTP } from '../lib/totp'

const TOTP_SECRET = import.meta.env.VITE_TOTP_SECRET

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

function TotpGate({ onUnlock }) {
  const navigate = useNavigate()
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) { setError('Masukkan 6 digit kode.'); return }
    if (!TOTP_SECRET) { setError('Secret OTP belum dikonfigurasi.'); return }
    setLoading(true)
    setError('')
    const ok = await verifyTOTP(TOTP_SECRET, code)
    setLoading(false)
    if (ok) {
      sessionStorage.setItem('activity_log_unlocked', '1')
      onUnlock()
    } else {
      setError('Kode salah atau sudah kedaluwarsa. Coba lagi.')
      setCode('')
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-sky-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">Verifikasi Akses</h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Halaman ini dilindungi. Masukkan 6 digit kode dari aplikasi Authenticator untuk melanjutkan.
        </p>
        <form onSubmit={handleSubmit} className="w-full mt-5 flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full text-center text-2xl font-bold tracking-[0.5em] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Lock className="w-4 h-4" />}
            {loading ? 'Memverifikasi...' : 'Buka Halaman'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/Dashboard')}
            className="w-full text-slate-400 text-xs font-medium py-1.5 hover:text-slate-600 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function ActivityLogPage() {
  const [unlocked,     setUnlocked]     = useState(() => sessionStorage.getItem('activity_log_unlocked') === '1')
  const [logs,         setLogs]         = useState([])
  const [fetching,     setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState('')
  const [search,       setSearch]       = useState('')
  const [filterValues, setFilterValues] = useState({ action: '' })

  useEffect(() => {
    if (!unlocked) return
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
  }, [unlocked])

  if (!unlocked) return <TotpGate onUnlock={() => setUnlocked(true)} />

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
        <DataTable columns={COLUMNS} data={filtered} pageSize={20} />
      )}
    </motion.div>
  )
}

export default ActivityLogPage
