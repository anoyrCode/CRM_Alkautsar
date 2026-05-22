import { Pie } from 'react-chartjs-2'
import {
  Chart as Chartjs,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js/auto'

Chartjs.register(ArcElement, Tooltip, Legend)

const options = { responsive: true, maintainAspectRatio: false }

function StatisticChart() {
  const data = {
    labels: ['Teknisi', 'Pelayanan', 'Administrasi', 'Konsumsi', 'Kesantrian'],
    datasets: [
      {
        data: [1, 2, 3, 1, 4],
        backgroundColor: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#93c5fd'],
        borderColor: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#60a5fa'],
        borderWidth: 1,
      },
    ],
  }
  return <Pie key={JSON.stringify(data)} data={data} options={options} />
}

export default StatisticChart
