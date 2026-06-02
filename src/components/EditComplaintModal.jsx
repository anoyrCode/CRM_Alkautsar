import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, AlignLeft, CircleGauge, ChartBarStacked } from 'lucide-react'
import { supabase } from '../lib/supabase'

const PRIORITY_OPTIONS = [
  { value: 'Low',      label: 'Low — Rendah' },
  { value: 'Medium',   label: 'Medium — Sedang' },
  { value: 'High',     label: 'High — Tinggi' },
  { value: 'Critical', label: 'Critical — Kritis' },
]

function EditComplaintModal({ complaint, onClose, onSave }) {
  const [title,       setTitle]       = useState(complaint.title ?? '')
  const [description, setDescription] = useState(complaint.description ?? '')
  const [categoryId,  setCategoryId]  = useState(complaint.category_id ?? '')
  const [priority,    setPriority]    = useState(complaint.priority ?? '')
  const [categories,  setCategories]  = useState([])
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, assigned_role:roles!assigned_role_id(name)')
      .order('name')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  const handleSave = async () => {
    if (!title.trim() || !categoryId || !priority || description.trim().length < 20) {
      setError('Lengkapi semua field. Deskripsi minimal 20 karakter.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      title:       title.trim(),
      description: description.trim(),
      category_id: categoryId,
      priority,
    }
    const { error: err } = await supabase.from('complaints').update(payload).eq('id', complaint.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSave(complaint.id, payload)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">Edit Komplain</p>
              <p className="text-xs text-slate-400">{complaint.ticket_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Tuliskan judul singkat komplain"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <ChartBarStacked className="w-3.5 h-3.5" />Kategori
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.assigned_role?.name ? ` — ${c.assigned_role.name}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <CircleGauge className="w-3.5 h-3.5" />Prioritas
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih prioritas</option>
                {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" />Deskripsi
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Jelaskan masalah secara detail... (minimal 20 karakter)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default EditComplaintModal
