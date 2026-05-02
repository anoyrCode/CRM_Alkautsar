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
    Gift,
    Search,
    Eye

} from "lucide-react"

import { useState } from "react";


function CompliantData(){
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
            <div id="data-komplain-hero" className="bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] rounded-xl">
                <div id="data-komplain-hero-container" className="px-5 py-4 flex flex-col gap-4">
                    <div id="dhc-p1" className="text-3xl text-white font-bold">
                        <span>Data Komplain</span> 
                    </div>

                    <div id="dhc-p2" className="text-white/70">
                        <span>Berikut pembaruan rekaptulasi komplain saat ini</span>
                    </div>
                </div>
            </div>

            <div id="data-komplain-total" className="mt-5 flex flex-wrap gap-2.5 justify-center w-full md:gap-3">
                <section id="dt-card-1" className="bg-white shadow-md shadow-gray-300 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-1-container" className="flex flex-col px-5 py-3 gap-2">
                        <div id="header" className="flex justify-between items-center">
                            <MessageSquare className="text-amber-500 w-5"/>
                            <div id="count" className="font-bold text-2xl">{totalVal}</div>
                        </div>
                        <p className="opacity-60 text-sm">Total Komplain</p>
                    </div>
                </section>
                <section id="dt-card-2" className="bg-white shadow-md shadow-gray-300 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-2-container" className="flex flex-col px-5 py-3 gap-2">
                        <div id="header" className="flex justify-between items-center">
                            <CircleCheckBig className="text-green-500 w-5"/>
                            <div id="count" className="font-bold text-2xl">{totalVal}</div>
                        </div>
                        <p className="opacity-60 text-sm">Selesai</p>
                    </div>
                </section>
                <section id="dt-card-3" className="bg-white shadow-md shadow-gray-300 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-3-container" className="flex flex-col px-5 py-3 gap-2">
                        <div id="header" className="flex justify-between items-center">
                            <Clock className="text-blue-500 w-5"/>
                            <div id="count" className="font-bold text-2xl">{totalVal}</div>
                        </div>
                        <p className="opacity-60 text-sm">Diproses</p>
                    </div>
                </section>
                <section id="dt-card-4" className="bg-white shadow-md shadow-gray-300 rounded-2xl relative w-40 xs:w-45 sm:flex-1">
                    <div id="dtc-4-container" className="flex flex-col px-5 py-3 gap-2">
                        <div id="header" className="flex justify-between items-center">
                            <CircleAlert className="text-amber-500 w-5"/>
                            <div id="count" className="font-bold text-2xl">{totalVal}</div>
                        </div>
                        <p className="opacity-60 text-sm">Pending</p>
                    </div>
                </section>
            </div>

            <div id="search" className="bg-white shadow-sm shadow-gray-300 mt-5 rounded-xl p-3 mb-3">
                <form action="" className="flex gap-3 flex-col md:flex-row">
                    <div id="search-page" className="px-3 py-1 bg-white border-1 border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-all duration-200 flex gap-2 flex-3">
                        <Search className="opacity-50 w-4"/>
                        <input type="text" className="outline-0 text-sm w-full" placeholder="Cari berdasarkan ID, Judul, atau Nama Pelapor"/>
                    </div>

                    <div className="search-filter flex flex-2 w-full gap-3">
                        <select name="" id="" className="px-3 py-1 bg-white border-1 border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-all duration-200 cursor-pointer text-sm opacity-65 flex-1">
                            <option value>semua status</option>
                            <option value="">konsumsi</option>
                            <option value="">pelayanan</option>
                            <option value="">kesantrian</option>
                            <option value="">administrasi</option>
                        </select>

                        <select name="" id="" className="px-3 py-1 bg-white border-1 border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-all duration-200  cursor-pointer text-sm opacity-65 flex-1">
                            <option value>semua kategori</option>
                            <option value="">konsumsi</option>
                            <option value="">pelayanan</option>
                            <option value="">kesantrian</option>
                            <option value="">administrasi</option>
                        </select>
                    </div>
                </form>
            </div>

            <div id="data-komplain-tabel" className="bg-white mt-3 p-3 w-full overflow-x-auto rounded-xl">
                <table className="min-w-[500px] w-full ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">ID Tiket</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Judul</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Pelapor</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Kategori</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Status</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Prioritas</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Tanggal</th>
                            <th className="px-6 py-2 text-left text-xs opacity-70 font-medium">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="hover:bg-gray-50 border-b-1 border-gray-200">
                            <td className="px-6 py-2 text-sm font-semibold">CMP-2026-001</td>
                            <td className="px-6 py-2 text-sm">Pelayanannya tidak buruk dan....</td>
                            <td className="px-6 py-2 text-sm">ahmad yani</td>
                            <td className="px-6 py-2 text-sm">Pelayanan</td>
                            <td className="px-6 py-2 text-xs">
                                <button className="cursor-pointer flex gap-1 items-center bg-green-200 px-2 rounded-lg">
                                    <CircleCheckBig className="w-3 text-green-600"/>
                                    <span className="font-semibold text-green-900">Selesai</span>
                                </button>
                            </td>
                            <td className="px-6 py-2 text-xs">
                                <p className="flex gap-1 items-center justify-center bg-red-200 px-2 p-1 rounded-lg">
                                    <span className="font-semibold text-red-900">High</span>
                                </p>
                            </td>
                            <td className="px-6 py-2 text-sm">02-06-2006</td>
                            <td className="px-6 py-2 text-sm"><button className="cursor-pointer"><Eye className="w-5 opacity-60" /></button></td>
                        </tr>
                        <tr className="hover:bg-gray-50 border-b-1 border-gray-200">
                            <td className="px-6 py-2 text-sm font-semibold">CMP-2026-001</td>
                            <td className="px-6 py-2 text-sm">Pelayanannya tidak buruk dan....</td>
                            <td className="px-6 py-2 text-sm">ahmad yani</td>
                            <td className="px-6 py-2 text-sm">Pelayanan</td>
                            <td className="px-6 py-2 text-xs">
                                <button className="cursor-pointer flex gap-1 items-center bg-green-200 px-2 rounded-lg">
                                    <CircleCheckBig className="w-3 text-green-600"/>
                                    <span className="font-semibold text-green-900">Selesai</span>
                                </button>
                            </td>
                            <td className="px-6 py-2 text-xs">
                                <p className="flex gap-1 items-center justify-center bg-red-200 px-2 p-1 rounded-lg">
                                    <span className="font-semibold text-red-900">High</span>
                                </p>
                            </td>
                            <td className="px-6 py-2 text-sm">02-06-2006</td>
                            <td className="px-6 py-2 text-sm"><button className="cursor-pointer"><Eye className="w-5 opacity-60" /></button></td>
                        </tr>
                        <tr className="hover:bg-gray-50 border-b-1 border-gray-200">
                            <td className="px-6 py-2 text-sm font-semibold">CMP-2026-001</td>
                            <td className="px-6 py-2 text-sm">Pelayanannya tidak buruk dan....</td>
                            <td className="px-6 py-2 text-sm">ahmad yani</td>
                            <td className="px-6 py-2 text-sm">Pelayanan</td>
                            <td className="px-6 py-2 text-xs">
                                <button className="cursor-pointer flex gap-1 items-center bg-green-200 px-2 rounded-lg">
                                    <CircleCheckBig className="w-3 text-green-600"/>
                                    <span className="font-semibold text-green-900">Selesai</span>
                                </button>
                            </td>
                            <td className="px-6 py-2 text-xs">
                                <p className="flex gap-1 items-center justify-center bg-red-200 px-2 p-1 rounded-lg">
                                    <span className="font-semibold text-red-900">High</span>
                                </p>
                            </td>
                            <td className="px-6 py-2 text-sm">02-06-2006</td>
                            <td className="px-6 py-2 text-sm"><button className="cursor-pointer"><Eye className="w-5 opacity-60" /></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CompliantData