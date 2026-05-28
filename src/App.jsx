import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebarr from './components/sidebar'
import ResNav from './components/Layouts/resNav'
import RouteConfig from './routes/routeConfig'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import InstallPrompt from './components/InstallPrompt'
import usePushNotification from './hooks/usePushNotification'

function AppLayout() {
  usePushNotification()
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
        <Route path="/login"          element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
      <InstallPrompt />
    </AuthProvider>
  )
}

export default App
