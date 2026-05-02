import { matchPath, NavLink } from "react-router-dom"
import {
    ShieldHalf,
    ChevronLeft,
    LayoutDashboard,
    ClipboardPlus,
    Database,
    MessageSquare,
    ChartColumnStacked,
    User,
    UserCog,
    Pi
} from 'lucide-react'
import logo from '../assets/logo.png';

import { useLocation } from "react-router-dom";
import { useState } from "react";


function PagesNav(props){
    const location = useLocation();

    const isDashboard = location.pathname === '/';
    const isCategory = location.pathname === '/Kategori'
    const isComplaintData = location.pathname === '/Data Komplain'
    const isCreateComplaint = location.pathname === '/Buat Laporan'
    const isMyComplaint = location.pathname === '/Laporan Saya'
    const isUsers = location.pathname === '/Data User'
    const isRole = location.pathname === '/Role'

    const {to,children,Icon} = props

    let navVal = false;
    let pageVal;

    const localLocation = location.pathname
    const locacationVal = localLocation.slice(0,5)

    const childVal = '/' + children
    const childVall = childVal.slice(0,5)

    if(locacationVal === childVall){
        navVal = true
    }else {
        navVal = false
    }
    

    if(navVal === true){
        pageVal = (( <NavLink to={to} className="group relative px-2 py-2 rounded flex gap-2 items-center w-full cursor-pointer overflow-hidden pr-23 bg-gradient-to-r from-[#0A1628] to-[#1B2B4A]">
                            <span className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] opacity-0  transition-opacity duration-300 rounded" />
                            <Icon className="group-hover:text-white w-4 relative z-10 transition-colors duration-300 text-white" />
                            <span className="group-hover:text-white font-semibold text-sm relative z-10 transition-colors duration-300 text-white">{children}</span>
                        </NavLink>))
    }else {
        pageVal = (<NavLink to={to} className="group relative px-2 py-2 rounded flex gap-2 items-center w-full cursor-pointer overflow-hidden pr-23">
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
                                    <Icon className="group-hover:text-white w-4 relative z-10 transition-colors duration-300 text-black/85" />
                                    <span className="group-hover:text-white font-semibold text-sm relative z-10 transition-colors duration-300 text-black/85">{children}</span>
                                </NavLink>)
    }
    return pageVal
}



function Sidebarr(){
    const [isOpen,setIsOpen] = useState(false)
    function OpenSidebar(){
    setIsOpen(true)
}

    return (
        <div id="sidebar" className={`hidden w-70 h-screen xl:flex bg-white flex-2 fixed shadow-md shadow-gray-500`}>
            <div id="sidebar-container" className="pl-5 py-4 flex flex-col gap-6">
                <header className="flex gap-4 w-full items-center">
                    <div id="sidebar-logo" className="inline-block rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" className="w-9"/>
                    </div>


                    <div id="sidebar-title" className="flex flex-col w-full">
                        <p id="sidebar-big-title" className="font-bold text-lg tracking-wide text-black">CRM <span className="text-[#04b4cf]">Al-Kautsar</span></p>
                        <p id="sidebar-big-title" className="text-xs flex opacity-70">Complaint Management</p>
                    </div>
                    <button className="absolute right-2 top-6 bg-amber-100 cursor-pointer rounded" onClick={OpenSidebar}><ChevronLeft /></button>
                </header>

                <nav>
                    <div id="navbar-container" className="w-full flex flex-col gap-5">

                        <div id="general" className="flex flex-col gap-2 w-full cursor-pointer">
                            <header className="text-xs font-semibold opacity-80">General</header>
                            <div id="general-navbar">
                                <PagesNav to='/Dashboard' Icon={LayoutDashboard}>Dashboard</PagesNav>
                            </div>
                        </div>

                        <div id="master-data" className="flex flex-col gap-2 w-full cursor-pointer">
                            <header className="text-xs font-semibold opacity-80">Main Menu</header>
                            <div id="master-data-navbar" className="flex flex-col gap-2 ">
                                <PagesNav to='/Buat Laporan' Icon={ClipboardPlus}>Buat Laporan</PagesNav>
                                <PagesNav to='/Data Komplain' Icon={Database}>Data Komplain</PagesNav>
                                <PagesNav to='/Laporan Saya' Icon={MessageSquare}>Laporan Saya</PagesNav>
                                <PagesNav to='/Kategori' Icon={ChartColumnStacked}>Kategori</PagesNav>
                            </div>
                        </div>

                        <div id="pengaturan" className="flex flex-col gap-2 w-full cursor-pointer">
                            <header className="text-xs font-semibold opacity-80">Pengaturan</header>
                            <div id="general-navbar" className="flex flex-col gap-2">
                                <PagesNav to='/Users' Icon={User}>Users</PagesNav>
                                <PagesNav to='/Role' Icon={UserCog}>Role</PagesNav>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Sidebarr