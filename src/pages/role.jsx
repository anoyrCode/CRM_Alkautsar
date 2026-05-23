import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCog, ShieldPlus, Pencil, Trash2, X, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

const PERMISSIONS = [
  { key: 'dashboard',         label: 'Dashboard' },
  { key: 'buat_laporan',      label: 'Buat Laporan' },
  { key: 'laporan_saya',      label: 'Laporan Saya' },
  { key: 'komplain_semua',    label: 'Data Komplain: Semua Divisi', note: 'Lihat seluruh komplain dari semua divisi' },
  { key: 'komplain_diterima', label: 'Data Komplain: Diterima',    note: 'Hanya lihat komplain yang diterima/ditugaskan ke divisi ini' },
  { key: 'kelola_kategori',   label: 'Kelola Kategori' },
  { key: 'kelola_users',      label: 'Kelola Users' },
  { key: 'kelola_role',       label: 'Kelola Role' },
]

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all'

function RoleModal({ role, onSave, onClose, loading }) {
  const [name,  setName]  = useState(role?.name ?? '')
  const [desc,  setDesc]  = useState(role?.description ?? '')
  const [perms, setPerms] = useState(role?.permissions ?? [])

  const togglePerm = p => setPerms(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  )

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description: desc.trim(), permissions: perms })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-slate-800 text-sm">{role ? 'Edit Role' : 'Tambah Role'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="overflow-y-auto p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nama Role</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Admin, Moderator, ..." className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Deskripsi</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Deskripsi singkat role ini" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Hak Akses</label>
              <div className="flex flex-col gap-2">
                {PERMISSIONS.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => togglePerm(p.key)}
                    className={`text-left px-3 py-2 rounded-lg border font-medium transition-colors flex items-start gap-2 ${
                      perms.includes(p.key)
                        ? 'bg-sky-50 border-sky-300 text-sky-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-sky-200 hover:text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      perms.includes(p.key) ? 'bg-sky-500 border-sky-500' : 'border-slate-300'
                    }`}>
                      {perms.includes(p.key) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{p.label}</div>
                      {p.note && <div className="text-[11px] text-slate-400 font-normal mt-0.5">{p.note}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Menyimpan...' : (role ? 'Simpan Perubahan' : 'Tambah Role')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function Role() {
  const [roles,    setRoles]    = useState([])
  const [fetching, setFetching] = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [modal,    setModal]    = useState(null)
  const [search,   setSearch]   = useState('')

  const fetchRoles = async () => {
    setFetching(true)
    const { data } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })
    setRoles(data ?? [])
    setFetching(false)
  }

  useEffect(() => { fetchRoles() }, [])

  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  const openCreate = () => { setError(''); setModal({ mode: 'create' }) }
  const openEdit   = role => { setError(''); setModal({ mode: 'edit', role }) }
  const closeModal = () => setModal(null)

  const handleSave = async ({ name, description, permissions }) => {
    setSaving(true)
    setError('')

    if (modal.mode === 'create') {
      const { error } = await supabase.from('roles').insert({ name, description, permissions })
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase
        .from('roles')
        .update({ name, description, permissions })
        .eq('id', modal.role.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    await fetchRoles()
    setSaving(false)
    closeModal()
  }

  const handleDelete = async id => {
    const { error } = await supabase.from('roles').delete().eq('id', id)
    if (error) { setError(error.message); return }
    setRoles(prev => prev.filter(r => r.id !== id))
  }

  const COLUMNS = [
    { key: 'name',        label: 'Nama Role',  render: v => <span className="font-semibold text-slate-800">{v}</span> },
    { key: 'description', label: 'Deskripsi',  render: v => <span className="text-slate-400 text-xs">{v ?? '—'}</span> },
    {
      key: 'permissions', label: 'Hak Akses',
      render: v => {
        const arr    = v ?? []
        const labels = arr.map(key => PERMISSIONS.find(p => p.key === key)?.label ?? key)
        return (
          <div className="flex flex-wrap gap-1">
            {labels.slice(0, 2).map(label => (
              <span key={label} className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">{label}</span>
            ))}
            {labels.length > 2 && (
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-medium">+{labels.length - 2}</span>
            )}
          </div>
        )
      },
    },
    { key: 'created_at', label: 'Dibuat', render: v => <span className="text-slate-400 text-xs">{formatDate(v)}</span> },
    {
      key: 'aksi', label: 'Aksi',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openEdit(row)} className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
            <Pencil className="w-3.5 h-3.5 text-sky-600" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <motion.div
        className="p-5 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader title="Manajemen Role" subtitle="Kelola hak akses dan peran pengguna sistem" badge="Admin Only" badgeIcon={UserCog} />
        <div className="flex justify-end">
          <button onClick={openCreate} className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
            <ShieldPlus className="w-4 h-4" />
            Tambah Role
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">{error}</div>
        )}

        <SearchFilterBar
          placeholder="Cari berdasarkan nama role..."
          value={search}
          onSearch={setSearch}
        />

        {fetching ? (
          <div className="bg-white rounded-xl shadow-sm p-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : (
          <DataTable columns={COLUMNS} data={
            search ? roles.filter(r => r.name?.toLowerCase().includes(search.toLowerCase())) : roles
          } />
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <RoleModal
            role={modal.mode === 'edit' ? modal.role : null}
            loading={saving}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Role
