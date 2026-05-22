import { Pie } from 'react-chartjs-2'
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from 'chart.js/auto'

Chartjs.register(ArcElement, Tooltip, Legend)

const options = { responsive: true, maintainAspectRatio: false }

const COLORS = ['#0092b7', '#38bdf8', '#7dd3fc', '#bae6fd', '#93c5fd', '#0284c7', '#0ea5e9', '#22d3ee']

function StatisticChart({ labels = [], values = [] }) {
  const data = {
    labels,
    datasets: [{
      data:            values.length ? values : [1],
      backgroundColor: COLORS.slice(0, Math.max(labels.length, 1)),
      borderColor:     COLORS.slice(0, Math.max(labels.length, 1)).map(() => '#fff'),
      borderWidth:     2,
    }],
  }
  return <Pie key={JSON.stringify(data)} data={data} options={options} />
}

export default StatisticChart
