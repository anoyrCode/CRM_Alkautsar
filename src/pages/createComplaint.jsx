import {
  User, Mail, ChartBarStacked, CircleGauge, ReceiptText, Link2, Send, MapPin
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150'

const PRIORITY_OPTIONS = [
  { value: 'Low',      label: 'Low — Rendah' },
  { value: 'Medium',   label: 'Medium — Sedang' },
  { value: 'High',     label: 'High — Tinggi' },
  { value: 'Critical', label: 'Critical — Kritis' },
]

function FormSection({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
      <Icon className="w-4 h-4 text-sky-600" />
      <span className="text-sm font-bold text-slate-800">{title}</span>
    </div>
  )
}

function DokumenPendukung({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const formatSize = bytes => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const addFiles   = newFiles => setFiles(prev => [...prev, ...Array.from(newFiles)])
  const removeFile = index   => setFiles(prev => prev.filter((_, i) => i !== index))

  return (
    <div className="flex flex-col gap-3">
      <FormSection icon={Link2} title="Dokumen Pendukung" />
      <p className="text-xs text-slate-400 -mt-1">(opsional)</p>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
        }`}
      >
        <input ref={inputRef} type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => addFiles(e.target.files)} />
        <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-700">Klik atau seret file ke sini</p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG, PNG — maks. 10MB per file</p>
      </div>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-sky-700">{file.name.split('.').pop().toUpperCase()}</span>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); removeFile(i) }} className="text-slate-400 hover:text-red-500 transition-colors px-1">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateComplaint() {
  const { profile } = useAuth()
  const navigate    = useNavigate()

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [title,      setTitle]      = useState('')
  const [priority,   setPriority]   = useState('')
  const [detail,     setDetail]     = useState('')
  const [location,   setLocation]   = useState('')
  const [files,      setFiles]      = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, assigned_role:roles!assigned_role_id(name)')
      .order('name')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title.trim() || !categoryId || !priority || detail.trim().length < 10) {
      setError('Lengkapi semua field. Deskripsi minimal 10 karakter.')
      return
    }

    setSubmitting(true)
    setError('')

    const { data: complaint, error: cErr } = await supabase
      .from('complaints')
      .insert({
        reporter_id:  profile.id,
        title:        title.trim(),
        category_id:  categoryId,
        priority,
        description:  detail.trim(),
        location:     location.trim() || null,
        status:       'Pending',
      })
      .select('id')
      .single()

    if (cErr) { setError(cErr.message); setSubmitting(false); return }

    // Upload attachments jika ada
    for (const file of files) {
      const ext      = file.name.split('.').pop()
      const filePath = `${complaint.id}/${Date.now()}.${ext}`

      const { data: uploaded, error: upErr } = await supabase.storage
        .from('complaint-attachments')
        .upload(filePath, file)

      if (!upErr && uploaded) {
        const { data: { publicUrl } } = supabase.storage
          .from('complaint-attachments')
          .getPublicUrl(filePath)

        await supabase.from('complaint_attachments').insert({
          complaint_id: complaint.id,
          file_name:    file.name,
          file_url:     publicUrl,
          file_size:    file.size,
        })
      }
    }

    setSubmitting(false)
    navigate('/Laporan Saya')
  }

  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Form Komplain" subtitle="Laporkan masalah Anda dengan jelas dan lengkap" />
      <div className="bg-white rounded-xl shadow-sm p-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5 mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <FormSection icon={User} title="Informasi Pelapor" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Nama Lengkap</span>
                </label>
                <input type="text" className={`${inputClass} bg-slate-100 cursor-not-allowed`} value={profile?.full_name ?? ''} readOnly />
              </div>
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Email</span>
                </label>
                <input type="email" className={`${inputClass} bg-slate-100 cursor-not-allowed`} value={profile?.email ?? ''} readOnly />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FormSection icon={ChartBarStacked} title="Kategori Komplain" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <ChartBarStacked className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Kategori</span>
                </label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Pilih kategori komplain</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.assigned_role?.name ? ` — ${c.assigned_role.name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <CircleGauge className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Priority Level</span>
                </label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Pilih level prioritas</option>
                  {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FormSection icon={ReceiptText} title="Detail Komplain" />
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <ReceiptText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Judul Komplain</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Tuliskan judul singkat komplain Anda"
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <ReceiptText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Deskripsi</span>
              </label>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                rows={6}
                placeholder="Jelaskan masalah Anda secara detail... (minimal 10 karakter)"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Lokasi <span className="font-normal text-slate-400">(opsional)</span></span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Contoh: Gedung A Lt. 2, Asrama Putra Blok B, ..."
                className={inputClass}
              />
            </div>
          </div>

          <DokumenPendukung files={files} setFiles={setFiles} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-linear-to-r from-sky-700 to-sky-400 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? 'Mengirim...' : 'Kirim Komplain'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default CreateComplaint
