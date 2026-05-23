import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <Download className="w-4.5 h-4.5 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-tight">Install CRM Al-Kautsar</p>
              <p className="text-xs text-slate-400">Tambahkan ke homescreen untuk akses cepat</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstall}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShow(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
