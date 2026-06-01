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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data?.user) {
      supabase.from('profiles').select('full_name, roles(name)').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          const roleName = p?.roles?.name ?? '-'
          if (roleName === 'Admin' || roleName === 'SuperAdmin') return
          supabase.from('activity_logs').insert({
            user_id:   data.user.id,
            full_name: p?.full_name ?? email,
            role_name: roleName,
            action:    'login',
            page:      null,
          })
        })
    }
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
