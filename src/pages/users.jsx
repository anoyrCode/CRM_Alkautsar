import { useState, useEffect } from 'react'
import { Upload, UserPlus, X, User, Mail, Lock, UserCog, KeyRound, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'
import { supabase } from '../lib/supabase'

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all'

const ModalWrapper = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-xl shadow-xl w-full max-w-sm"
    >
      {children}
    </motion.div>
  </div>
)

const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
)

// ── Modal Tambah User ────────────────────────────────────────────
function AddUserModal({ roles, onSave, onClose, loading }) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [roleId,   setRoleId]   = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim() || !roleId) return
    const roleName = roles.find(r => r.id === parseInt(roleId))?.name ?? ''
    onSave({ name: name.trim(), email: email.trim(), password, roleId: parseInt(roleId), roleName })
  }

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Tambah User" onClose={onClose} />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-5 flex flex-col gap-4">
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
            <select value={roleId} onChange={e => setRoleId(e.target.value)} className={`${inputClass} cursor-pointer`}>
              <option value="">Pilih role pengguna</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Menyimpan...' : 'Tambah User'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}

// ── Modal Edit Role ──────────────────────────────────────────────
function EditRoleModal({ user, roles, onClose, onSaved }) {
  const [roleId,  setRoleId]  = useState(user.roleId ?? '')
  const [saving,  setSaving]  = useState(false)
  const [err,     setErr]     = useState('')

  const handleSave = async () => {
    setSaving(true); setErr('')
    const { error } = await supabase.from('profiles').update({ role_id: parseInt(roleId) }).eq('id', user.uuid)
    setSaving(false)
    if (error) { setErr(error.message); return }
    const roleName = roles.find(r => r.id === parseInt(roleId))?.name ?? '-'
    onSaved(user.uuid, parseInt(roleId), roleName)
  }

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Edit Role" onClose={onClose} />
      <div className="p-5 flex flex-col gap-4">
        <div className="bg-slate-50 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400">User</p>
          <p className="text-sm font-semibold text-slate-700">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <div>
          <label className="flex items-center gap-1.5 mb-1.5">
            <UserCog className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Role Baru</span>
          </label>
          <select value={roleId} onChange={e => setRoleId(e.target.value)} className={`${inputClass} cursor-pointer`}>
            <option value="">Pilih role</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {err && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          Batal
        </button>
        <button onClick={handleSave} disabled={saving || !roleId || parseInt(roleId) === user.roleId} className="flex-1 bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </ModalWrapper>
  )
}

// ── Modal Reset Password ─────────────────────────────────────────
function ResetPasswordModal({ user, onClose }) {
  const [sending, setSending] = useState(false)
  const [done,    setDone]    = useState(false)
  const [err,     setErr]     = useState('')

  const handleSend = async () => {
    setSending(true); setErr('')
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSending(false)
    if (error) { setErr(error.message); return }
    setDone(true)
  }

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Reset Password" onClose={onClose} />
      <div className="p-5 flex flex-col gap-4">
        <div className="bg-slate-50 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400">User</p>
          <p className="text-sm font-semibold text-slate-700">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        {done ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700 font-medium">
            Link reset password berhasil dikirim ke <strong>{user.email}</strong>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Link reset password akan dikirim ke email <span className="font-semibold text-slate-800">{user.email}</span>. User dapat menggunakan link tersebut untuk membuat password baru.
          </p>
        )}
        {err && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          {done ? 'Tutup' : 'Batal'}
        </button>
        {!done && (
          <button onClick={handleSend} disabled={sending} className="flex-1 bg-amber-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {sending && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {sending ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        )}
      </div>
    </ModalWrapper>
  )
}

// ── Modal Hapus User ─────────────────────────────────────────────
function DeleteModal({ user, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [err,      setErr]      = useState('')

  const handleDelete = async () => {
    setDeleting(true); setErr('')
    const { error } = await supabase.from('profiles').delete().eq('id', user.uuid)
    setDeleting(false)
    if (error) { setErr(error.message); return }
    onDeleted(user.uuid)
  }

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Hapus User" onClose={onClose} />
      <div className="p-5 flex flex-col gap-4">
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <p className="text-xs text-red-400 mb-1">User yang akan dihapus</p>
          <p className="text-sm font-semibold text-slate-700">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <p className="text-sm text-slate-600">
          Tindakan ini akan menghapus data profil user. User tidak akan bisa mengakses aplikasi setelah dihapus.
        </p>
        {err && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          Batal
        </button>
        <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          {deleting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {deleting ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </ModalWrapper>
  )
}

// ── Main Component ───────────────────────────────────────────────
function Users() {
  const [users,         setUsers]         = useState([])
  const [allRoles,      setAllRoles]      = useState([])
  const [fetching,      setFetching]      = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [saveError,     setSaveError]     = useState('')
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [editRoleUser,  setEditRoleUser]  = useState(null)
  const [resetUser,     setResetUser]     = useState(null)
  const [search,        setSearch]        = useState('')
  const [deleteUser,    setDeleteUser]    = useState(null)

  const fetchUsers = async () => {
    setFetching(true)
    const [{ data }, { data: rolesData }] = await Promise.all([
      supabase.from('profiles').select('id, employee_id, full_name, email, roles(id, name)').order('full_name'),
      supabase.from('roles').select('id, name').order('name'),
    ])
    const mapped = (data ?? []).map(u => ({
      uuid:   u.id,
      id:     u.employee_id ?? '-',
      name:   u.full_name,
      email:  u.email,
      role:   u.roles?.name ?? '-',
      roleId: u.roles?.id ?? null,
    }))
    setUsers(mapped)
    setAllRoles(rolesData ?? [])
    setFetching(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleAddSave = async ({ name, email, password, roleId, roleName }) => {
    setSaving(true); setSaveError('')
    const { data: { session: adminSession } } = await supabase.auth.getSession()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setSaveError(error.message); setSaving(false); return }
    if (adminSession) {
      await supabase.auth.setSession({ access_token: adminSession.access_token, refresh_token: adminSession.refresh_token })
    }
    const { error: upsertErr } = await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, email, role_id: roleId })
    if (upsertErr) { setSaveError(upsertErr.message); setSaving(false); return }
    const { data: newProfile } = await supabase.from('profiles').select('id, employee_id').eq('id', data.user.id).single()
    setUsers(prev => [...prev, { uuid: newProfile?.id, id: newProfile?.employee_id ?? '-', name, email, role: roleName, roleId }])
    setSaving(false)
    setShowAddModal(false)
  }

  const handleRoleSaved = (uuid, roleId, roleName) => {
    setUsers(prev => prev.map(u => u.uuid === uuid ? { ...u, role: roleName, roleId } : u))
    setEditRoleUser(null)
  }

  const handleDeleted = (uuid) => {
    setUsers(prev => prev.filter(u => u.uuid !== uuid))
    setDeleteUser(null)
  }

  const COLUMNS = [
    { key: 'id',    label: 'No',    render: (_, __, i) => <span className="font-semibold text-sky-600">{i + 1}</span> },
    { key: 'name',  label: 'Nama',  render: v => <span className="text-slate-700">{v}</span> },
    { key: 'email', label: 'Email', render: v => <span className="text-slate-400">{v}</span> },
    { key: 'role',  label: 'Role',  render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v ?? '-'}</span> },
    { key: 'aksi',  label: 'Aksi',  render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => setResetUser(row)} title="Reset Password" className="w-7 h-7 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center transition-colors">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
        </button>
        <button onClick={() => setEditRoleUser(row)} title="Edit Role" className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
          <UserCog className="w-3.5 h-3.5 text-sky-600" />
        </button>
        <button onClick={() => setDeleteUser(row)} title="Hapus" className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    )},
  ]

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
            onClick={() => { setSaveError(''); setShowAddModal(true) }}
            className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">{saveError}</div>
        )}

        <SearchFilterBar
          placeholder="Cari berdasarkan ID, Nama, atau Email..."
          value={search}
          onSearch={setSearch}
        />

        {fetching ? (
          <div className="bg-white rounded-xl shadow-sm p-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : (
          <DataTable columns={COLUMNS} data={
            search
              ? users.filter(u => {
                  const q = search.toLowerCase()
                  return u.id?.toLowerCase().includes(q) ||
                         u.name?.toLowerCase().includes(q) ||
                         u.email?.toLowerCase().includes(q)
                })
              : users
          } />
        )}
      </motion.div>

      <AnimatePresence>
        {showAddModal  && <AddUserModal     roles={allRoles} loading={saving} onSave={handleAddSave}  onClose={() => setShowAddModal(false)} />}
        {editRoleUser  && <EditRoleModal    user={editRoleUser}  roles={allRoles} onClose={() => setEditRoleUser(null)}  onSaved={handleRoleSaved} />}
        {resetUser     && <ResetPasswordModal user={resetUser}   onClose={() => setResetUser(null)} />}
        {deleteUser    && <DeleteModal      user={deleteUser}    onClose={() => setDeleteUser(null)}  onDeleted={handleDeleted} />}
      </AnimatePresence>
    </>
  )
}

export default Users
