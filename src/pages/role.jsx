import { motion } from 'framer-motion'
import { UserCog, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Role() {
  const navigate = useNavigate()
  return (
    <motion.div
      className="p-5 flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
          <UserCog className="w-8 h-8 text-sky-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Halaman Role</h2>
          <p className="text-sm text-slate-400 mt-1">Fitur ini sedang dalam pengembangan</p>
        </div>
        <button
          onClick={() => navigate('/Dashboard')}
          className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Kembali ke Dashboard
        </button>
      </div>
    </motion.div>
  )
}

export default Role
