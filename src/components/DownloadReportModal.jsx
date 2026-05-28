import { useState } from 'react'
import { X, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { exportPDF, exportExcel } from '../utils/exportReport'

const firstDay = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10) }
const lastDay  = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10) }

export default function DownloadReportModal({ open, onClose }) {
  const { profile } = useAuth()
  const [dateFrom, setDateFrom] = useState(firstDay)
  const [dateTo,   setDateTo]   = useState(lastDay)
  const [format,   setFormat]   = useState('pdf')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  if (!open) return null

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    if (dateFrom > dateTo) {
      setError('Tanggal "Dari" tidak boleh lebih besar dari "Sampai".')
      setLoading(false)
      return
    }
    if (!profile) {
      setError('Profil pengguna tidak ditemukan.')
      setLoading(false)
      return
    }
    try {
      const perms   = profile?.roles?.permissions ?? []
      const isAdmin = perms.includes('komplain_semua')
      const isDivisi = perms.includes('komplain_diterima')

      let query = supabase
        .from('complaints')
        .select('ticket_id, title, status, priority, created_at, categories(name)')
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo + 'T23:59:59')
        .order('created_at', { ascending: false })

      if (!isAdmin) {
        if (isDivisi) {
          const { data: cats } = await supabase
            .from('categories').select('id').eq('assigned_role_id', profile.role_id)
          const catIds = cats?.map(c => c.id) ?? []
          if (catIds.length > 0) query = query.in('category_id', catIds)
        } else {
          query = query.eq('reporter_id', profile.id)
        }
      }

      const { data: complaints, error: fetchErr } = await query
      if (fetchErr) throw fetchErr

      const meta = {
        dateFrom,
        dateTo,
        userName:  profile?.full_name ?? '',
        roleName:  profile?.roles?.name ?? '',
        printDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      }

      if (format === 'pdf') await exportPDF(complaints ?? [], meta)
      else                  exportExcel(complaints ?? [], meta)

      onClose()
    } catch {
      setError('Gagal mengunduh laporan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">Unduh Laporan</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date-from" className="text-xs font-semibold text-slate-600 mb-1 block">Dari</label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="text-xs font-semibold text-slate-600 mb-1 block">Sampai</label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  format === 'pdf'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  format === 'excel'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Unduh Laporan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
