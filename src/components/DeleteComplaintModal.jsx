import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

function DeleteComplaintModal({ complaint, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const { data: files } = await supabase.storage.from('complaint-attachments').list(complaint.id)
      if (files && files.length > 0) {
        await supabase.storage.from('complaint-attachments').remove(files.map(f => `${complaint.id}/${f.name}`))
      }

      await supabase.from('complaint_attachments').delete().eq('complaint_id', complaint.id)
      await supabase.from('notifications').delete().eq('complaint_id', complaint.id)

      const { error: err } = await supabase.from('complaints').delete().eq('id', complaint.id)
      if (err) { setError(err.message); setDeleting(false); return }

      setDeleting(false)
      onDelete(complaint.id)
    } catch (e) {
      setError(e.message ?? 'Gagal menghapus komplain')
      setDeleting(false)
    }
  }

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
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Hapus Komplain?</h3>
            <p className="text-sm text-slate-500">
              Komplain <span className="font-semibold text-slate-700">{complaint.ticket_id}</span> akan dihapus permanen beserta semua lampirannya.
            </p>
            <p className="text-xs text-red-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 text-left">{error}</div>
          )}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deleting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteComplaintModal
