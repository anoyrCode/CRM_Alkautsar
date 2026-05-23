import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const record = req.body?.record
  if (!record) return res.status(400).json({ error: 'No record' })

  const { user_id, message } = record

  const { data } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', user_id)
    .single()

  if (!data) return res.status(200).json({ ok: true, skipped: true })

  try {
    await webpush.sendNotification(
      data.subscription,
      JSON.stringify({ title: 'CRM Al-Kautsar', body: message })
    )
    res.status(200).json({ ok: true })
  } catch (err) {
    if (err.statusCode === 410) {
      await supabase.from('push_subscriptions').delete().eq('user_id', user_id)
    }
    res.status(200).json({ ok: true })
  }
}
