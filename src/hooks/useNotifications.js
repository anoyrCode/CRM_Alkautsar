import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useNotifications() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!profile?.id) return

    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(30)
      setNotifications(data ?? [])
    }

    fetchNotifs()

    const channel = supabase
      .channel(`notif-${profile.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${profile.id}`,
      }, payload => {
        setNotifications(prev => [payload.new, ...prev])
        setToast(payload.new)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.id])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markAllRead = useCallback(async () => {
    const ids = notifications.filter(n => !n.is_read).map(n => n.id)
    if (ids.length === 0) return
    await supabase.from('notifications').update({ is_read: true }).in('id', ids)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }, [notifications])

  const markOneRead = useCallback(async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  return { notifications, unreadCount, markAllRead, markOneRead, toast, setToast }
}
