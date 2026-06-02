import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartColumnStacked, FolderPlus, Pencil, Trash2, X, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all'

function CategoryModal({ category, divisionRoles, onSave, onClose, loading }) {
  const [name,           setName]           = useState(category?.name ?? '')
  const [desc,           setDesc]           = useState(category?.description ?? '')
  const [assignedRoleId, setAssignedRoleId] = useState(category?.assigned_role_id ?? '')

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim() || !assignedRoleId) return
    onSave({ name: name.trim(), description: desc.trim(), assigned_role_id: assignedRoleId })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-slate-800 text-sm">{category ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="overflow-y-auto p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nama Kategori</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Akademik, Fasilitas, ..." className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Deskripsi</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Deskripsi singkat kategori ini" rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Divisi Penanggung Jawab</span>
              </label>
              <select value={assignedRoleId} onChange={e => setAssignedRoleId(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
                <option value="">Pilih divisi yang menangani</option>
                {divisionRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">Komplain kategori ini akan otomatis diarahkan ke divisi yang dipilih.</p>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Menyimpan...' : (category ? 'Simpan Perubahan' : 'Tambah Kategori')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function Category() {
  const [categories,    setCategories]    = useState([])
  const [divisionRoles, setDivisionRoles] = useState([])
  const [fetching,      setFetching]      = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')
  const [modal,         setModal]         = useState(null)
  const [search,        setSearch]        = useState('')

  const fetchAll = async () => {
    setFetching(true)
    const [{ data: cats }, { data: roles }] = await Promise.all([
      supabase.from('categories').select('*, roles(id, name)').order('created_at', { ascending: true }),
      supabase.from('roles').select('id, name').not('name', 'in', '("SuperAdmin","Admin","User")').order('name'),
    ])
    setCategories(cats ?? [])
    setDivisionRoles(roles ?? [])
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [])

  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  const openCreate = () => { setError(''); setModal({ mode: 'create' }) }
  const openEdit   = cat => { setError(''); setModal({ mode: 'edit', category: cat }) }
  const closeModal = () => setModal(null)

  const handleSave = async ({ name, description, assigned_role_id }) => {
    setSaving(true)
    setError('')

    if (modal.mode === 'create') {
      const nextCode = `K${String(categories.length + 1).padStart(3, '0')}`
      const { error } = await supabase.from('categories').insert({ name, description, assigned_role_id, code: nextCode })
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase
        .from('categories')
        .update({ name, description, assigned_role_id })
        .eq('id', modal.category.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    await fetchAll()
    setSaving(false)
    closeModal()
  }

  const handleDelete = async id => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { setError(error.message); return }
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const COLUMNS = [
    { key: 'name',        label: 'Nama Kategori',         render: v => <span className="font-semibold text-slate-800">{v}</span> },
    { key: 'description', label: 'Deskripsi',              render: v => <span className="block max-w-55 truncate text-slate-400 text-xs" title={v ?? ''}>{v ?? '—'}</span> },
    {
      key: 'roles', label: 'Divisi Penanggung Jawab',
      render: v => v
        ? <span className="bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{v.name}</span>
        : <span className="text-slate-300 text-xs">—</span>,
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
        <PageHeader title="Manajemen Kategori" subtitle="Kelola kategori komplain yang tersedia di sistem" badge="Admin Only" badgeIcon={ChartColumnStacked} />
        <div className="flex justify-end">
          <button onClick={openCreate} className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
            <FolderPlus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">{error}</div>
        )}

        <SearchFilterBar
          placeholder="Cari berdasarkan nama kategori..."
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
            search ? categories.filter(c => c.name?.toLowerCase().includes(search.toLowerCase())) : categories
          } />
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <CategoryModal
            category={modal.mode === 'edit' ? modal.category : null}
            divisionRoles={divisionRoles}
            loading={saving}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Category
