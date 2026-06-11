import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquareText, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function FeatureAnnouncementModal() {
  const { profile, refreshProfile } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [saving,    setSaving]    = useState(false)

  const show = profile && profile.seen_thread_announcement === false && !dismissed

  const handleClose = async () => {
    setSaving(true)
    setDismissed(true)
    const { error } = await supabase
      .from('profiles')
      .update({ seen_thread_announcement: true })
      .eq('id', profile.id)
    if (!error) await refreshProfile()
    setSaving(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="flex items-start justify-between px-5 pt-5">
              <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5 text-sky-600" />
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-3 pb-5">
              <h2 className="text-base font-bold text-slate-800 mb-2">Ada Fitur Baru: Diskusi</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Mulai sekarang pelapor dan penanggung jawab bisa saling balas pesan di dalam tiap komplain.
                Jadi kalau ada keluhan yang kurang jelas, bisa langsung tanya-jawab di sana, tidak perlu lagi
                nebak-nebak lewat catatan.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Buka saja detail komplain, lalu scroll ke bawah ke bagian <span className="font-semibold text-slate-700">Diskusi</span>.
                Pesan sendiri juga bisa diedit atau dihapus kalau salah ketik.
              </p>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={handleClose}
                disabled={saving}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : 'Oke, paham'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
