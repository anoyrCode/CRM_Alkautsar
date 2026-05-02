import {Route,Routes} from "react-router-dom"
import Dashboard from "../pages/dashboard"
import Category from "../pages/category"
import CompliantData from "../pages/complaintData"
import CreateComplaint from "../pages/createComplaint"
import MyComplaint from "../pages/myComplaint"
import Users from "../pages/users"
import Role from "../pages/role"

function RouteConfig(){
    return (
        <Routes>
            <Route path="/Dashboard" element={<Dashboard/>}/>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/Kategori" element={<Category/>}/>
            <Route path="/Data Komplain" element={<CompliantData/>}/>
            <Route path="/Buat Laporan" element={<CreateComplaint/>}/>
            <Route path="/Laporan Saya" element={<MyComplaint/>}/>
            <Route path="/Users" element={<Users/>}/>
            <Route path="/Role" element={<Role/>}/>
        </Routes>

    )
}


export default RouteConfig