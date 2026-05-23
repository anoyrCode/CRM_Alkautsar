import { Route, Routes, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Dashboard from "../pages/dashboard"
import Category from "../pages/category"
import CompliantData from "../pages/complaintData"
import CreateComplaint from "../pages/createComplaint"
import MyComplaint from "../pages/myComplaint"
import Users from "../pages/users"
import Role from "../pages/role"

function Guard({ perm, perms, children }) {
  const { profile } = useAuth()
  const permissions = profile?.roles?.permissions ?? []
  const allowed = perms
    ? perms.some(p => permissions.includes(p))
    : permissions.includes(perm)
  return allowed ? children : <Navigate to="/Dashboard" replace />
}

function RouteConfig() {
  return (
    <Routes>
      <Route path="/"              element={<Dashboard />} />
      <Route path="/Dashboard"     element={<Dashboard />} />
      <Route path="/Buat Laporan"  element={<Guard perm="buat_laporan"><CreateComplaint /></Guard>} />
      <Route path="/Data Komplain" element={<Guard perms={['komplain_semua','komplain_diterima']}><CompliantData /></Guard>} />
      <Route path="/Laporan Saya"  element={<Guard perm="laporan_saya"><MyComplaint /></Guard>} />
      <Route path="/Kategori"      element={<Guard perm="kelola_kategori"><Category /></Guard>} />
      <Route path="/Users"         element={<Guard perm="kelola_users"><Users /></Guard>} />
      <Route path="/Role"          element={<Guard perm="kelola_role"><Role /></Guard>} />
    </Routes>
  )
}

export default RouteConfig