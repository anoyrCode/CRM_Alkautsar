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

function StatisticChart(){
    const data = {
        labels : ['teknisi','pelayanan','administrasi'],
        datasets : [
            {
                data : [1,2,3],
                backgroundColor : ["#0a1628a3","#0e1f39d1","#0a1628"]
            }
        ]

    }

    return <Pie key={JSON.stringify(data)} data={data} />
}

export default StatisticChart