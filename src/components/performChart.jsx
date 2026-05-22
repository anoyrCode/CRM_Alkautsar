import { Bar } from 'react-chartjs-2'
import { Chart as Chartjs, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js/auto'

Chartjs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const options = { responsive: true, maintainAspectRatio: false }

function PerformChart({ labels = [], selesai = [], belumSelesai = [] }) {
  const data = {
    labels,
    datasets: [
      { label: 'Belum Selesai', data: belumSelesai, backgroundColor: '#fca5a5', borderRadius: 4 },
      { label: 'Terselesaikan', data: selesai,      backgroundColor: '#7dd3fc', borderRadius: 4 },
    ],
  }
  return <Bar key={JSON.stringify(data)} data={data} options={options} />
}

export default PerformChart
