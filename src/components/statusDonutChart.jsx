import { Doughnut } from 'react-chartjs-2'
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from 'chart.js/auto'

Chartjs.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 16 } },
  },
}

function StatusDonutChart({ pending = 0, diproses = 0, selesai = 0 }) {
  const total = pending + diproses + selesai
  const data = {
    labels: ['Pending', 'Diproses', 'Selesai'],
    datasets: [{
      data:            total > 0 ? [pending, diproses, selesai] : [1, 0, 0],
      backgroundColor: total > 0 ? ['#fca5a5', '#fcd34d', '#6ee7b7'] : ['#e2e8f0'],
      borderColor:     '#fff',
      borderWidth:     3,
    }],
  }

  return (
    <div className="relative h-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute flex flex-col items-center pointer-events-none">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-xs text-slate-400">komplain</span>
      </div>
    </div>
  )
}

export default StatusDonutChart
