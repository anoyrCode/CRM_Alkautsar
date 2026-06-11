import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, RefreshCw, MessageSquare, Pencil, Trash2, Check, CheckCheck, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ComplaintThread({ complaintId, currentUser }) {
  const [messages,  setMessages]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [body,      setBody]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [sendError, setSendError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editBody,  setEditBody]  = useState('')
  const [otherLastRead, setOtherLastRead] = useState(null)
  const bottomRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('complaint_messages')
      .select('id, body, created_at, sender_id')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: true })

    if (!error && data?.length) {
      const senderIds = [...new Set(data.map(m => m.sender_id))]
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds)
      const profMap = Object.fromEntries((profs ?? []).map(p => [p.id, p.full_name]))
      setMessages(data.map(m => ({ ...m, senderName: profMap[m.sender_id] ?? '—' })))
    } else {
      setMessages(data ?? [])
    }

    setLoading(false)
    if (!error) {
      // Kapan terakhir pihak LAIN membuka thread ini (untuk status "Dibaca" di pesan sendiri)
      const { data: reads } = await supabase
        .from('complaint_message_reads')
        .select('last_read_at')
        .eq('complaint_id', complaintId)
        .neq('user_id', currentUser.id)
      const latest = (reads ?? [])
        .map(r => new Date(r.last_read_at).getTime())
        .reduce((max, t) => Math.max(max, t), 0)
      setOtherLastRead(latest > 0 ? latest : null)

      await supabase
        .from('complaint_message_reads')
        .upsert(
          { user_id: currentUser.id, complaint_id: complaintId, last_read_at: new Date().toISOString() },
          { onConflict: 'user_id,complaint_id' }
        )
    }
  }, [complaintId, currentUser.id])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!body.trim() || sending) return
    setSending(true)
    setSendError('')
    const { data, error } = await supabase
      .from('complaint_messages')
      .insert({ complaint_id: complaintId, sender_id: currentUser.id, body: body.trim() })
      .select('id, body, created_at, sender_id')
      .single()
    if (!error && data) {
      setMessages(prev => [...prev, { ...data, senderName: currentUser.full_name }])
      setBody('')
    } else if (error) {
      console.error('[ComplaintThread] send error:', error)
      setSendError(error.message)
    }
    setSending(false)
  }

  const handleSaveEdit = async (id) => {
    if (!editBody.trim()) return
    const { error } = await supabase
      .from('complaint_messages')
      .update({ body: editBody.trim() })
      .eq('id', id)
    if (!error) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, body: editBody.trim() } : m))
      setEditingId(null)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('complaint_messages')
      .delete()
      .eq('id', id)
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />Diskusi
        </p>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 min-h-[100px] max-h-[220px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
            <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Memuat diskusi...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">
            Belum ada diskusi. Mulai percakapan di sini.
          </p>
        ) : (
          <>
            {messages.map(msg => {
              const isSelf   = msg.sender_id === currentUser.id
              const isEditing = editingId === msg.id
              const time     = new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              const isRead   = isSelf && otherLastRead != null && new Date(msg.created_at).getTime() <= otherLastRead
              return (
                <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <p className="text-[10px] text-slate-400 mb-0.5 px-1">
                    {isSelf ? 'Anda' : (msg.senderName ?? '—')} · {time}
                  </p>

                  {isSelf && !isEditing && (
                    <div className="flex gap-2 mt-0.5 px-1">
                      <button
                        onClick={() => { setEditingId(msg.id); setEditBody(msg.body) }}
                        className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        <Pencil className="w-2.5 h-2.5" />Edit
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5" />Hapus
                      </button>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="flex flex-col items-end gap-1.5 w-full max-w-[80%]">
                      <textarea
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        rows={2}
                        className="w-full resize-none text-sm border border-sky-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white text-slate-700"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveEdit(msg.id)}
                          className="flex items-center gap-1 text-xs bg-sky-500 hover:bg-sky-600 text-white px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Check className="w-3 h-3" />Simpan
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 text-xs border border-slate-200 text-slate-500 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      isSelf
                        ? 'bg-sky-500 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.body}
                    </div>
                  )}

                  {isSelf && !isEditing && (
                    <p className={`text-[10px] mt-0.5 px-1 flex items-center gap-0.5 ${isRead ? 'text-sky-500' : 'text-slate-400'}`}>
                      {isRead
                        ? <><CheckCheck className="w-3 h-3" />Dibaca</>
                        : <><Check className="w-3 h-3" />Terkirim</>
                      }
                    </p>
                  )}
                </div>
              )
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {sendError && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-1.5">{sendError}</p>
      )}
      <div className="flex gap-2 mt-2">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan... (Enter untuk kirim)"
          rows={1}
          className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 bg-white text-slate-700 placeholder-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={!body.trim() || sending}
          aria-label="Kirim pesan"
          className="w-9 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end"
        >
          {sending
            ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Send className="w-4 h-4" />
          }
        </button>
      </div>
    </div>
  )
}
