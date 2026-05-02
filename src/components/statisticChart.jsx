import { Bar,Pie,Line } from "react-chartjs-2";

import {
    Chart as Chartjs,
    ArcElement,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js/auto"

Chartjs.register(
    ArcElement,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

const options = {
  responsive: true,
  maintainAspectRatio: false
}

function StatisticChart(){
    const data = {
        labels : ['teknisi','pelayanan','administrasi','konsumsi','kesantrian'],
        datasets : [
            {
                data : [1,2,3,1,4],
                backgroundColor : ["#0a1628a3","#0e1f39d1","#0a1628","#172f54","#102545"]
            }
        ]

    }

    return <Pie key={JSON.stringify(data)} data={data} options={options}/>
}

export default StatisticChart