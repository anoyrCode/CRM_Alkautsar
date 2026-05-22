import {
  User, Mail, ChartBarStacked, CircleGauge, ReceiptText, Link2, Send
} from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150'

function FormSection({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
      <Icon className="w-4 h-4 text-sky-600" />
      <span className="text-sm font-bold text-slate-800">{title}</span>
    </div>
  )
}

function DokumenPendukung() {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const formatSize = bytes => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const addFiles = newFiles => setFiles(prev => [...prev, ...Array.from(newFiles)])
  const removeFile = index => setFiles(prev => prev.filter((_, i) => i !== index))

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
  const username = 'testing-user'
  const emailUser = 'usertesting@gmail.com'

  return (
    <motion.div
      className="p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Form Komplain" subtitle="Laporkan masalah Anda dengan jelas dan lengkap" />
      <div className="bg-white rounded-xl shadow-sm p-5">
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <FormSection icon={User} title="Informasi Pelapor" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Nama Lengkap</span>
                </label>
                <input type="text" className={inputClass} defaultValue={username} readOnly />
              </div>
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Email</span>
                </label>
                <input type="email" className={inputClass} defaultValue={emailUser} readOnly />
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
                <select className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Pilih kategori komplain</option>
                  <option>Akademik</option>
                  <option>Peraturan dan Kedisiplinan</option>
                  <option>Pelayanan</option>
                  <option>Fasilitas</option>
                  <option>Administrasi</option>
                  <option>Keamanan</option>
                  <option>Konsumsi</option>
                  <option>Kantin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 mb-1.5">
                  <CircleGauge className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Priority Level</span>
                </label>
                <select className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Pilih level prioritas</option>
                  <option>Low — Rendah</option>
                  <option>Medium — Sedang</option>
                  <option>High — Tinggi</option>
                  <option>Critical — Kritis</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FormSection icon={ReceiptText} title="Detail Komplain" />
            <textarea
              rows={6}
              placeholder="Jelaskan masalah Anda secara detail... (minimal 20 karakter)"
              className={`${inputClass} resize-none`}
            />
          </div>

          <DokumenPendukung />

          <button
            type="submit"
            className="w-full bg-linear-to-r from-sky-700 to-sky-400 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Kirim Komplain
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default CreateComplaint
