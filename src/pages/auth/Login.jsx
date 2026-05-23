import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const FEATURES = [
  'Notifikasi real-time ke divisi terkait',
  'Pantau progress & status komplain',
  'Laporan & analitik kinerja divisi',
]

function BrandPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-linear-to-br from-sky-700 via-sky-600 to-sky-400 flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-24 -right-12 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute top-1/2 -right-10 w-48 h-48 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-14">
          <img src={logo} alt="logo" className="h-8 w-auto" />
          <div>
            <p className="font-extrabold text-white text-base leading-tight">CRM Al-Kautsar</p>
            <p className="text-sky-200 text-xs">Complaint Management</p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white leading-snug mb-4">
          Kelola komplain<br />lebih mudah &<br />terstruktur
        </h1>
        <p className="text-sky-100 text-sm leading-relaxed mb-10">
          Platform terpadu untuk manajemen pengaduan dan monitoring penyelesaian komplain pesantren Al-Kautsar.
        </p>

        <div className="flex flex-col gap-3">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sky-100 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-sky-200 text-xs">© 2026 MANAGORA · Al-Kautsar</p>
    </div>
  )
}

function Login() {
  const navigate    = useNavigate()
  const { signIn }  = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('Email atau password salah. Silakan coba lagi.')
    } else {
      navigate('/Dashboard')
    }
  }

  return (
    <div className="min-h-screen flex">
      <BrandPanel />

      <div className="w-full lg:w-1/2 flex flex-col lg:items-center lg:justify-center lg:p-8 bg-linear-to-br from-sky-50/60 via-white to-slate-100/80 min-h-screen lg:min-h-0 relative overflow-hidden">
        {/* Dekorasi blur — desktop only */}
        <div className="hidden lg:block absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-slate-200/40 blur-2xl pointer-events-none" />

        {/* Mobile: logo + form dalam satu container terpusat */}
        <div className="flex-1 lg:hidden flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm flex flex-col gap-4"
          >
            {/* Logo box */}
            <div className="flex justify-center">
              <div className="flex items-center gap-3 bg-sky-600/10 border border-sky-200 rounded-2xl px-5 py-3">
                <img src={logo} alt="logo" className="h-9 w-auto" />
                <div>
                  <p className="font-extrabold text-slate-800 text-sm leading-tight">CRM <span className="text-sky-600">Al-Kautsar</span></p>
                  <p className="text-slate-400 text-[11px]">Complaint Management</p>
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                Assalamualaikum <Sparkles className="w-5 h-5 text-sky-500" />
              </h2>
              <p className="text-xs text-slate-400 mb-5">Masuk untuk melanjutkan ke dashboard</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all" />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-1 shadow-md shadow-sky-100">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                  {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
                </button>
              </form>

            </div>
          </motion.div>
        </div>

        {/* Desktop: form dengan card */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl shadow-sky-100/40 p-8">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                Assalamualaikum <Sparkles className="w-6 h-6 text-sky-500" />
              </h2>
              <p className="text-sm text-slate-400 mb-8">Masuk untuk melanjutkan ke dashboard</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all" />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 shadow-md shadow-sky-100">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                  {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
                </button>
              </form>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default Login
