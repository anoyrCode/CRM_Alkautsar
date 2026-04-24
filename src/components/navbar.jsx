import {Menu,Bell} from 'lucide-react'
import { useLocation } from 'react-router-dom'

function Navbar(){
    const location = useLocation();

    const isDashboard = location.pathname === '/';
    const isCategory = location.pathname === '/category'
    const isComplaintData = location.pathname === '/complaintData'
    const isCreateComplaint = location.pathname === '/createComplaint'
    const isMyComplaint = location.pathname === '/myComplaint'
    const isUsers = location.pathname === '/users'
    const isRole = location.pathname === '/role'



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
            bread = "Komplain saya"
        }else if(isUsers){
            bread = "Data users"
        }
        return bread
    }

    return (
        <nav className="bg-white p-3.5 flex justify-between shadow-lg shadow-gray-">
            <div id='left-nav' className='flex gap-4 items-center'>
                <Menu className='cursor-pointer'/>
                <span id='bread' className='text-xl font-semibold text-[#0A1628]'>{breadText()}</span>
            </div>
            <div id='right-nav' className='flex items-center gap-4'>
                <div className='bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] px-3 rounded-4xl flex items-center'> <span className='text-xl text-white'>{userProfile}</span></div>
            </div>
        </nav>
    )
}

export default Navbar

