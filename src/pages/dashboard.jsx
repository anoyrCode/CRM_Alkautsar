import { 
    UserStar,
    PartyPopper,
    MessageSquareText,
    CircleCheckBig,
    Clock,
    CircleAlert,
    ChartColumn,
    ChartSpline,
    ClipboardPlus,
    MessageSquare,
    Download,
    Headset,
    Gift
} from "lucide-react"

import StatisticChart from "../components/statisticChart";
import PerformChart from "../components/performChart";

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
        <div className="p-5.5 xl:ml-70 xl:mt-14">
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

            <div id="dashboard-total" className="mt-5 flex flex-wrap gap-2 justify-center w-full md:gap-5">
                <section id="dt-card-1" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-1-container" className="inline-flex flex-col px-5 py-4 gap-2 relative">
                        <div className="bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] rounded-xl px-2 py-1.5"><MessageSquareText className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl absolute top-15">{totalVal}</div>
                        <p className="text-gray-800 absolute top-25">Total</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{totalAddNew}</span>
                </section>

                <section id="dt-card-2" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-2-container" className="inline-flex flex-col px-5 py-4 gap-2 relative">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl px-2 py-1.5"><CircleCheckBig className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{clearVal}</div>
                        <p className="text-gray-800">Clear</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>

                <section id="dt-card-3" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-3-container" className="inline-flex flex-col px-5 py-4 gap-2 relative">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600  rounded-xl px-2 py-1.5"><Clock className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl absolute top-15">{proccesVal}</div>
                        <p className="text-gray-800 absolute top-25">Pros</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>

                <section id="dt-card-4" className="bg-white shadow-md shadow-gray-400 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-4-container" className="inline-flex flex-col px-5 py-4 gap-2 relative">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl px-2 py-1.5"><CircleAlert className="text-white w-5"/></div>
                        <div id="count" className="font-bold text-2xl">{pendingVal}</div>
                        <p className="text-gray-800">Pend</p>
                    </div>
                    <span className="absolute top-3 right-3 ">+{clearAddNew}</span>
                </section>
            </div>

            <div id="mid-hero" className="w-full mt-5 flex flex-col gap-5 lg:flex-row">
                <section id="statistik-komplain-perform" className="bg-white shadow-lg shadow-gray-400 rounded-xl lg:w-10 md:flex-1">
                    <div id="statistik-komplain-container-perform" className="px-5 py-4 flex flex-col gap-4">
                        <div id="sk-header" className="flex gap-2 text-[#c3a339] font-semibold text-sm items-center">
                            <ChartSpline className="w-5" />
                            <span className="text-lg text-[#0A1628] font-bold">Kinerja Penanganan Komplain</span>
                        </div>
                        <div id="statistik-komplain-card-container">
                            <div id="skc-p1">
                                <div id="skc-p1-header">
                                    <span id="skc-p1-title"></span>
                                    <span id="skc-p1-title"></span>
                                </div>
                                <div id="skc-p1-val" className="flex h-50 md:h-80">
                                    <PerformChart/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="statistik-komplain-category" className="bg-white shadow-lg shadow-gray-400 rounded-xl xl:w-20 md:flex-1">
                    <div id="statistik-komplain-container-category" className="px-5 py-4 flex flex-col gap-4">
                        <div id="sk-header" className="flex gap-2 text-[#c3a339] font-semibold text-sm items-center">
                            <ChartColumn className="w-5" />
                            <span className="text-lg text-[#0A1628] font-bold">Statistik Komplain Perkategori</span>
                        </div>
                        <div id="statistik-komplain-card-container">
                            <div id="skc-p1">
                                <div id="skc-p1-header">
                                    <span id="skc-p1-title"></span>
                                    <span id="skc-p1-title"></span>
                                </div>
                                <div id="skc-p1-val" className="flex h-70">
                                    <StatisticChart/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <section id="recent-activity" className="bg-white shadow-lg shadow-gray-400 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 mt-5 w-full">
                    <div id="recent-activity-container" className="px-5 py-4 flex flex-col gap-4">
                         <div id="sk-header" className="flex gap-2 text-[#c3a339] font-semibold text-sm items-center">
                            <Gift className="w-5"/>
                            <span className="text-lg text-[#0A1628] font-bold">Quick Actions</span>
                        </div>

                        <div id="recent-activity-card-container" className="flex justify-around gap-3">

                            <div id="rc-a1" className="flex flex-col gap-3 sm:flex-row sm:flex-1 sm:justify-around">
                                <div id="buat-laporan" className="bg-white p-5 rounded-xl flex flex-col items-center justify-center shadow-md shadow-gray-300 gap-2 border border-gray-100 md:flex-1 cursor-pointer">
                                    <ClipboardPlus/>
                                    <p className="font-semibold">Buat Laporan</p>
                                </div>

                                <div id="lihat-status" className="bg-white p-5 rounded-xl flex flex-col items-center justify-center shadow-md shadow-gray-300 gap-2 border border-gray-100 md:flex-1 cursor-pointer">
                                    <MessageSquare/>
                                    <p className="font-semibold">Lihat Status</p>
                                </div>
                            </div>


                            <div id="rc-a2" className="flex flex-col gap-3 sm:flex-row sm:flex-1 justify-around">
                                <div id="unduh-laporan" className="bg-white p-5 rounded-xl flex flex-col items-center justify-center shadow-md shadow-gray-300 gap-2 border border-gray-100 md:flex-1 cursor-pointer">
                                    <Download/>
                                    <p className="font-semibold">Unduh Laporan</p>
                                </div>

                                <div id="hubungi-cs" className="bg-white p-5 rounded-xl flex flex-col items-center justify-center shadow-md shadow-gray-300 gap-2 border border-gray-100 md:flex-1 cursor-pointer">
                                    <Headset/>
                                    <p className="font-semibold">Hubungi CS</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </section>

        </div>
    )
}

export default Dashboard