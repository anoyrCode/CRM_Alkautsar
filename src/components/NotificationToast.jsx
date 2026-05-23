import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-4 right-4 z-[9999] w-80 max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-sky-600 mb-0.5">CRM Al-Kautsar</p>
              <p className="text-sm text-slate-700 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
            className="h-0.5 bg-sky-400 rounded-full mt-1 origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
