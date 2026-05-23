function StatisticChart({ labels = [], pending = [], diproses = [], selesai = [] }) {
  if (labels.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
        Belum ada data
      </div>
    )
  }

  const items = labels
    .map((label, i) => ({
      label,
      pending:  pending[i]  ?? 0,
      diproses: diproses[i] ?? 0,
      selesai:  selesai[i]  ?? 0,
      total: (pending[i] ?? 0) + (diproses[i] ?? 0) + (selesai[i] ?? 0),
    }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-3.5 py-1 pr-1">
      {items.map(item => {
        const pendingPct  = item.total > 0 ? (item.pending  / item.total) * 100 : 0
        const diprosesPct = item.total > 0 ? (item.diproses / item.total) * 100 : 0
        const selesaiPct  = item.total > 0 ? (item.selesai  / item.total) * 100 : 0

        return (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {item.total} komplain
              </span>
            </div>

            {/* Segmented bar */}
            <div className="h-2.5 rounded-full overflow-hidden bg-slate-100 flex">
              {item.pending  > 0 && <div className="h-full bg-red-400 transition-all"    style={{ width: `${pendingPct}%` }} />}
              {item.diproses > 0 && <div className="h-full bg-amber-400 transition-all"  style={{ width: `${diprosesPct}%` }} />}
              {item.selesai  > 0 && <div className="h-full bg-emerald-400 transition-all" style={{ width: `${selesaiPct}%` }} />}
            </div>

            {/* Mini stats */}
            <div className="flex gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {item.pending} Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {item.diproses} Diproses
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item.selesai} Selesai
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatisticChart
