import { Bar } from 'react-chartjs-2'
import {
  Chart as Chartjs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js/auto'

Chartjs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const options = { responsive: true, maintainAspectRatio: false }

function PerformChart() {
  const data = {
    labels: ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    datasets: [
      {
        label: 'Belum Selesai',
        data: [1, 2, 3, 1, 3, 5],
        backgroundColor: '#fca5a5',
        borderRadius: 4,
      },
      {
        label: 'Terselesaikan',
        data: [3, 2, 3, 2, 4, 1],
        backgroundColor: '#7dd3fc',
        borderRadius: 4,
      },
    ],
  }
  return <Bar key={JSON.stringify(data)} data={data} options={options} />
}

export default PerformChart
