import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*, roles(*)')
      .eq('id', userId)
      .single()
    setProfile(data)

    // Catat login HANYA bila ini hasil login eksplisit (flag di-set oleh signIn),
    // bukan restore session saat refresh. Dijalankan di sini agar profil (role) sudah tersedia
    // dan tidak terputus oleh redirect halaman login.
    if (data && sessionStorage.getItem('pending_login_log') === '1') {
      sessionStorage.removeItem('pending_login_log')
      const roleName = data.roles?.name ?? '-'
      if (roleName !== 'Admin' && roleName !== 'SuperAdmin') {
        supabase.from('activity_logs').insert({
          user_id:   userId,
          full_name: data.full_name ?? '',
          role_name: roleName,
          action:    'login',
          page:      null,
        }).then(({ error }) => { if (error) console.error('[login log]', error) })
      }
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    // Set flag SEBELUM login agar pasti tersedia saat onAuthStateChange -> fetchProfile
    // mengeceknya (menghindari race condition). Dibersihkan lagi jika login gagal.
    sessionStorage.setItem('pending_login_log', '1')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) sessionStorage.removeItem('pending_login_log')
    return { error }
  }

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    const defaultRole = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'User')
      .single()

    const { error: profileError } = await supabase.from('profiles').insert({
      id:        data.user.id,
      full_name: fullName,
      role_id:   defaultRole.data?.id,
    })

    return { error: profileError }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
