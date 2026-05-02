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
    Legend,
    
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

function PerformChart(){
    const data = {
        labels : ['juli','agustus','september','oktober','november','desember'],
        datasets : [
            {
                label : "belum selesai",
                data : [1,2,3,1,3,5],
                backgroundColor : ["#f21f1f"]
            },

            {
                label : "terselesaikan",
                data : [3,2,3,2,4,1],
                backgroundColor : ["#03940f"]
            }
        ]
    }

    return <Bar key={JSON.stringify(data)} data={data} options={options} className=""/>
}

export default PerformChart