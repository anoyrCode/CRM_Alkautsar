import { useState, useEffect } from 'react'
import { Eye, Upload, UserPlus, X, User, Mail, Lock, UserCog } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
// import { supabase } from '../lib/supabase' // Commented out Supabase client import

// Menggunakan REST API dari backend server.js
const createUserApi = async (userData) => {
  const res = await fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (!res.ok) return { user: null, error: json };
  return { user: json, error: null };
};

const ROLES = ['SuperAdmin', 'Admin', 'User',
  'Bagian Akademik', 'Bagian Kedisiplinan', 'Bagian Pelayanan',
  'Bagian Sarana & Prasarana', 'Bagian Administrasi', 'Bagian Keamanan', 'Bagian Dapur',
]

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all'

function UserModal({ onSave, onClose, loading }) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [role,     setRole]     = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim() || !role) return
    onSave({ name: name.trim(), email: email.trim(), password, role })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-slate-800 text-sm">Tambah User</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="overflow-y-auto p-5 flex flex-col gap-4">
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Nama Lengkap</span>
              </label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Email</span>
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contoh@email.com" className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Password</span>
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Buat password" className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5">
                <UserCog className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Role</span>
              </label>
              <select value={role} onChange={e => setRole(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
                <option value="">Pilih role pengguna</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Menyimpan...' : 'Tambah User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function Users() {
  const [users,      setUsers]      = useState([])
  const [fetching,   setFetching]   = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saveError,  setSaveError]  = useState('')

  const fetchUsers = async () => {
    setFetching(true);
    const res = await fetch("http://localhost:8080/api/users");
    const data = await res.json();
    setUsers(data ?? []);
    setFetching(false);
  };

  useEffect(() => { fetchUsers() }, [])

  const handleSave = async ({ name, email, password, role }) => {
    setSaving(true);
    setSaveError("");

    // Buat user melalui API backend
    const { user: newUser, error: creationError } = await createUserApi({ name, email, password, role });

    if (creationError) {
      setSaveError(creationError.error ?? "Gagal membuat user");
      setSaving(false);
      return;
    }

    await fetchUsers();
    setSaving(false);
    setShowModal(false);
  };

  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  const COLUMNS = [
    { key: "id",        label: "ID",          render: v => <span className="font-semibold text-sky-600">{v}</span> },
    { key: "name",      label: "Nama",        render: v => <span className="text-slate-700">{v}</span> },
    { key: "email",     label: "Email",       render: v => <span className="text-slate-400">{v}</span> },
    { key: "role",      label: "Role",        render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v ?? "-"}</span> },
    // { key: "created_at",  label: "Dibuat",    render: v => <span className="text-slate-400 text-xs">{formatDate(v)}</span> },
    // { key: "updated_at",  label: "Diperbarui", render: v => <span className="text-slate-400 text-xs">{formatDate(v)}</span> },
    { key: "aksi",      label: "Aksi",        render: () => (
      <button className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
        <Eye className="w-3.5 h-3.5 text-sky-600" />
      </button>
    )},
  ];

  return (
    <>
      <motion.div
        className="p-5 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader title="Data User" subtitle="Berikut pembaruan data user terdaftar" />
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            Upload User
          </button>
          <button
            onClick={() => { setSaveError(''); setShowModal(true) }}
            className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">
            {saveError}
          </div>
        )}

        <SearchFilterBar placeholder="Cari berdasarkan ID, Nama, atau Email..." />

        {fetching ? (
          <div className="bg-white rounded-xl shadow-sm p-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : (
          <DataTable columns={COLUMNS} data={users} />
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <UserModal
            loading={saving}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Users
