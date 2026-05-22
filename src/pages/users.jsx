import { Eye, Upload, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import SearchFilterBar from '../components/SearchFilterBar'
import DataTable from '../components/DataTable'

const SAMPLE_DATA = [
  { id: 'AK1902831', name: 'Testing-User', email: 'usertesting@gmail.com', role: 'SuperAdmin', created: '01 Mei 2026', updated: '03 Mei 2026' },
  { id: 'AK1902832', name: 'Ahmad Yani', email: 'ahmadyani@gmail.com', role: 'Admin', created: '02 Mei 2026', updated: '04 Mei 2026' },
  { id: 'AK1902833', name: 'Siti Rahma', email: 'sitirahma@gmail.com', role: 'User', created: '03 Mei 2026', updated: '05 Mei 2026' },
]

const COLUMNS = [
  { key: 'id', label: 'ID Pegawai', render: v => <span className="font-semibold text-sky-600">{v}</span> },
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email', render: v => <span className="text-slate-400">{v}</span> },
  { key: 'role', label: 'Role', render: v => <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-xs font-medium">{v}</span> },
  { key: 'created', label: 'Dibuat', render: v => <span className="text-slate-400 text-xs">{v}</span> },
  { key: 'updated', label: 'Diperbarui', render: v => <span className="text-slate-400 text-xs">{v}</span> },
  { key: 'aksi', label: 'Aksi', render: () => (
    <button className="w-7 h-7 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
      <Eye className="w-3.5 h-3.5 text-sky-600" />
    </button>
  )},
]

function Users() {
  return (
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
        <button className="flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Tambah User
        </button>
      </div>
      <SearchFilterBar placeholder="Cari berdasarkan ID, Nama, atau Email..." />
      <DataTable columns={COLUMNS} data={SAMPLE_DATA} />
    </motion.div>
  )
}

export default Users
