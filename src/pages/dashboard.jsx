import { UserStar,PartyPopper,MessageSquareText,CircleCheckBig,Clock,CircleAlert,ChartColumn } from "lucide-react"
import StatisticChart from "../components/chart";

function Dashboard(){
    const dashboard_tittle = "dashboard"
    const username = "muslim";

    const totalVal = 0
    const clearVal = 0
    const proccesVal = 0
    const pendingVal = 0

    const totalAddNew = 0
    const clearAddNew = 0
    const prosesAddNew = 0
    const pendingAddNew = 0

    return (
        <div className="p-5.5">
            <div id="dashboard-hero" className="bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] rounded-xl">
                <div id="dashboard-hero-container" className="px-5 py-4 flex flex-col gap-4">
                    <div id="dhc-p1" className="flex gap-2 text-[#D4AF37] font-semibold text-sm items-center">
                        <UserStar className="w-5" />
                        <span>Administrator</span>
                    </div>

                    <div id="dhc-p2" className="text-3xl text-white font-bold">
                        <span>Selamat datang, {username} <PartyPopper className="inline w-7 mb-2"/></span> 
                    </div>

                    <div id="dhc-p3" className="text-white/70">
                        <span>Berikut pembaruan rekaptulasi komplain saat ini</span>
                    </div>
                </div>
            </div>


            {/* jangan lupa w-nya nanti dirubah pas berubah dekstop */}
            <div id="dashboard-total" className="mt-5 flex flex-wrap gap-2 justify-center w-full">
                <section id="dt-card-1" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-1-container" className="inline-flex flex-col px-5 py-4 gap-2">
                        <div className="bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] rounded-xl px-2 py-1.5"><MessageSquareText className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{totalVal}</div>
                        <p className="text-gray-800">Total</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{totalAddNew}</span>
                </section>

                <section id="dt-card-2" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-2-container" className="inline-flex flex-col px-5 py-4 gap-2">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl px-2 py-1.5"><CircleCheckBig className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{clearVal}</div>
                        <p className="text-gray-800">Clear</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>

                <section id="dt-card-3" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-3-container" className="inline-flex flex-col px-5 py-4 gap-2">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600  rounded-xl px-2 py-1.5"><Clock className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{proccesVal}</div>
                        <p className="text-gray-800">Pros</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>

                <section id="dt-card-4" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-4-container" className="inline-flex flex-col px-5 py-4 gap-2">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl px-2 py-1.5"><CircleAlert className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{pendingVal}</div>
                        <p className="text-gray-800">Pend</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>
            </div>

            <div id="mid-hero" className="mt-5">
                <section id="statistik-komplain" className="bg-white shadow-lg shadow-gray-400 rounded-xl">
                    <div id="statistik-komplain-container" className="px-5 py-4 flex flex-col gap-4">
                        <div id="sk-header" className="flex gap-2 text-[#c3a339] font-semibold text-sm items-center">
                            <ChartColumn className="w-5" />
                            <span className="text-lg text-[#0A1628] font-bold">Statistik Komplain Terbanyak</span>
                        </div>

                        <div id="statistik-komplain-card-container">
                            <div id="skc-p1">
                                <div id="skc-p1-header">
                                    <span id="skc-p1-title"></span>
                                    <span id="skc-p1-title"></span>
                                </div>

                                <div id="skc-p1-val">
                                    <StatisticChart/>
                                </div>
                            </div>
                        </div>

                    </div>

                </section>

                <section id="recent-activity">

                </section>
            </div>

        </div>
    )
}

export default Dashboard