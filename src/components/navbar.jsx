import {Menu,Bell} from 'lucide-react'
import { useLocation } from 'react-router-dom'

function Navbar(){
    const location = useLocation();

    const isDashboard = location.pathname === '/Dashboard';
    const isDashboardU = location.pathname === '/';
    const isCategory = location.pathname === '/Kategori'
    const isComplaintData = location.pathname === '/Data%20Komplain'
    const isCreateComplaint = location.pathname === '/Buat%20Laporan'
    const isMyComplaint = location.pathname === '/Laporan%20Saya'
    const isUsers = location.pathname === '/Users'
    const isRole = location.pathname === '/Role'

    const username = 'muslim';
    const userProfile = username[0];

    function breadText(){
        let bread;

        if(isDashboard){
            bread = "Dashboard"
        }else if(isCategory){
            bread = "Kategori"
        }else if(isComplaintData){
            bread = "Data komplain"
        }else if(isCreateComplaint){
            bread = "Buat laporan"
        }else if(isMyComplaint){
            bread = "Laporan saya"
        }else if(isUsers){
            bread = "Data users"
        }else if(isRole){
            bread = "Role"
        }else if(isDashboardU){
            bread = "Dashboard"
        }
        return bread
    }

    return (
        <nav className="bg-white p-3.5 flex justify-between shadow-lg shadow-gray xl:fixed xl:ml-70 xl:w-[78%] z-1000">
            <div id='left-nav' className='flex gap-4 items-center'>
                <Menu className='cursor-pointer xl:hidden'/>
                <span id='bread' className='text-xl font-semibold text-[#0A1628]'>{breadText()}</span>
            </div>
            <div id='right-nav' className='flex items-center gap-4'>
                <div className='bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] px-3 rounded-4xl flex items-center md:py-1'> <span className='text-xl text-white'>{userProfile}</span></div>
            </div>
        </nav>
    )
}

export default Navbar

