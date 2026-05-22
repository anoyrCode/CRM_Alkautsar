import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebarr from './components/sidebar'
import ResNav from './components/Layouts/resNav'
import RouteConfig from './routes/routeConfig'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebarr />
      <div className="xl:ml-64">
        <ResNav />
        <main className="xl:pt-14">
          <RouteConfig />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
