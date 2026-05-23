function ResolutionGauge({ avgDays = 0, selesaiCount = 0 }) {
  const MAX  = 14
  const pct  = Math.min(avgDays / MAX, 1)
  const cx = 100, cy = 108, r = 72

  function polar(angleDeg) {
    const rad = angleDeg * Math.PI / 180
    return {
      x: +(cx + r * Math.cos(rad)).toFixed(2),
      y: +(cy - r * Math.sin(rad)).toFixed(2),
    }
  }

  const startPt = polar(180)
  const endPt   = polar(0)
  const valPt   = polar(180 + pct * 180)

  const color = avgDays === 0 ? '#94a3b8'
              : avgDays <= 3  ? '#10b981'
              : avgDays <= 7  ? '#f59e0b'
              :                 '#ef4444'

  const badge = avgDays === 0
    ? null
    : avgDays <= 3 ? { label: 'Cepat',  bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' }
    : avgDays <= 7 ? { label: 'Sedang', bg: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500' }
    :                { label: 'Lambat', bg: 'bg-red-100 text-red-700',          dot: 'bg-red-500' }

  const hoursEq = avgDays > 0
    ? avgDays < 1
      ? `≈ ${(avgDays * 24).toFixed(1)} jam`
      : `≈ ${Math.floor(avgDays)} hari ${Math.round((avgDays % 1) * 24)} jam`
    : null

  const bgPath  = `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 0 0 ${endPt.x} ${endPt.y}`
  const valPath = pct > 0
    ? `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 0 ${valPt.x} ${valPt.y}`
    : null

  return (
    <div className="h-full flex flex-col items-center justify-center gap-1.5">
      <svg viewBox="0 0 200 130" className="w-full max-w-55">
        {/* Track */}
        <path d={bgPath} fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
        {/* Value */}
        {valPath && (
          <path d={valPath} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
        )}
        {/* Center label */}
        <text x="100" y="96" textAnchor="middle" fill="#1e293b" fontSize="26" fontWeight="bold">
          {avgDays > 0 ? avgDays.toFixed(1) : '—'}
        </text>
        <text x="100" y="114" textAnchor="middle" fill="#94a3b8" fontSize="11">
          {avgDays > 0 ? 'hari rata-rata' : 'belum ada data selesai'}
        </text>
        {/* Scale labels at arc endpoints */}
        <text x="22" y="126" textAnchor="middle" fill="#cbd5e1" fontSize="9">0 hari</text>
        <text x="178" y="126" textAnchor="middle" fill="#cbd5e1" fontSize="9">14 hari</text>
      </svg>

      {badge && (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      )}
      {hoursEq && (
        <span className="text-[11px] text-slate-500 font-medium">{hoursEq}</span>
      )}
      {selesaiCount > 0 && (
        <span className="text-[11px] text-slate-400">Berdasarkan {selesaiCount} komplain selesai</span>
      )}

      <div className="flex gap-4 text-[11px] text-slate-400 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />Cepat ≤3 hari
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />Sedang ≤7 hari
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />Lambat &gt;7 hari
        </span>
      </div>
    </div>
  )
}

export default ResolutionGauge
