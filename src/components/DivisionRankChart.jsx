const RANK_STYLE = [
  'bg-amber-400 text-white',
  'bg-slate-400 text-white',
  'bg-orange-400 text-white',
]

function DivisionRankChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
        Belum ada data
      </div>
    )
  }

  const maxPoints = Math.max(...data.map(d => d.points), 1)

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 py-1 pr-1">
      {data.map((item, i) => {
        const barPct     = Math.max(0, (item.points / maxPoints) * 100)
        const pointColor = item.points >= 50 ? 'bg-emerald-100 text-emerald-700'
          : item.points >= 20               ? 'bg-amber-100 text-amber-700'
          : item.points < 0                 ? 'bg-red-100 text-red-700'
          :                                   'bg-slate-100 text-slate-500'

        return (
          <div key={item.name} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${RANK_STYLE[i] ?? 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${pointColor}`}>
                  {item.points} poin
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 mt-1 block">
                {item.selesai} dari {item.total} komplain selesai
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DivisionRankChart
