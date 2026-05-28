const PRIORITY_MULT = { Critical: 3, High: 2, Medium: 1, Low: 0.5 }
const BASE = 5

function speedBonus(days) {
  if (days <= 1) return 5
  if (days <= 3) return 3
  if (days <= 7) return 0
  return -3
}

function activePenalty(days) {
  if (days > 14) return -8
  if (days > 7)  return -3
  return 0
}

/**
 * Hitung poin per divisi (nama kategori) dari array complaints.
 * Gunakan complaints yang sudah difilter ke bulan berjalan.
 * Returns: { 'Nama Divisi': number, ... }
 */
export function calcDivisionPoints(complaints) {
  const now    = new Date()
  const points = {}

  complaints.forEach(c => {
    const div = c.categories?.name ?? 'Lainnya'
    if (points[div] === undefined) points[div] = 0

    if (c.status === 'Selesai' && c.resolved_at) {
      const mult = PRIORITY_MULT[c.priority] ?? 1
      const days = (new Date(c.resolved_at) - new Date(c.created_at)) / 86400000
      points[div] += BASE * mult + speedBonus(days)
    } else {
      const days = (now - new Date(c.created_at)) / 86400000
      points[div] += activePenalty(days)
    }
  })

  return points
}
