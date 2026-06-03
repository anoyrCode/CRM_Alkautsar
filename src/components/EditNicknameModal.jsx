import { useState } from 'react'
import { X, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Wrapper: form di-mount ulang setiap modal dibuka sehingga prefill cukup lewat
// useState awal (tanpa useEffect/setState-in-effect).
function EditNicknameModal({ open, onClose }) {
  if (!open) return null
  return <NicknameForm onClose={onClose} />
}

function NicknameForm({ onClose }) {
  const { user, profile, refreshProfile } = useAuth()
  const [value, setValue]   = useState(profile?.nickname ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleSave = async () => {
    if (!user?.id) {
      setError('Sesi tidak ditemukan. Silakan login ulang.')
      return
    }
    setSaving(true)
    setError('')
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ nickname: value.trim() || null })
      .eq('id', user.id)
    if (updErr) {
      console.error('[update nickname]', updErr)
      setError('Gagal menyimpan. Coba lagi.')
      setSaving(false)
      return
    }
    await refreshProfile()
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Pencil className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Edit Nama Panggilan</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Nama Panggilan</label>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            maxLength={30}
            placeholder="Contoh: Ustadz Ahmad"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <p className="text-xs text-slate-400">
            Dipakai pada sapaan di dashboard. Kosongkan untuk memakai nama lengkap.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-60 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditNicknameModal

