import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

const PRIORITIES = [
  { key: 'Critical', color: '#a855f7', bg: 'bg-purple-100 text-purple-700' },
  { key: 'High',     color: '#ef4444', bg: 'bg-red-100 text-red-700' },
  { key: 'Medium',   color: '#f59e0b', bg: 'bg-amber-100 text-amber-700' },
  { key: 'Low',      color: '#10b981', bg: 'bg-emerald-100 text-emerald-700' },
]

function PriorityDonutChart({ data = {} }) {
  const total = PRIORITIES.reduce((s, p) => s + (data[p.key] ?? 0), 0)

  const chartData = {
    labels: PRIORITIES.map(p => p.key),
    datasets: [{
      data:            total > 0 ? PRIORITIES.map(p => data[p.key] ?? 0) : [1, 0, 0, 0],
      backgroundColor: total > 0 ? PRIORITIES.map(p => p.color) : ['#e2e8f0'],
      borderColor:     '#fff',
      borderWidth:     3,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.raw} komplain`,
        },
      },
    },
  }

  return (
    <div className="h-full flex items-center gap-5">
      {/* Donut */}
      <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800">{total}</span>
          <span className="text-[11px] text-slate-400">komplain</span>
        </div>
      </div>

      {/* Legend + counts */}
      <div className="flex flex-col gap-2.5 flex-1">
        {PRIORITIES.map(p => {
          const count = data[p.key] ?? 0
          const pct   = total > 0 ? Math.round(count / total * 100) : 0
          return (
            <div key={p.key} className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-16 text-center ${p.bg}`}>
                {p.key}
              </span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: p.color }} />
              </div>
              <span className="text-xs font-bold text-slate-600 w-5 text-right">{count}</span>
              <span className="text-[10px] text-slate-400 w-8">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriorityDonutChart
