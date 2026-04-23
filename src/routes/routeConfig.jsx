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
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/category" element={<Category/>}/>
            <Route path="/complaintData" element={<CompliantData/>}/>
            <Route path="/createComplaint" element={<CreateComplaint/>}/>
            <Route path="/myComplaint" element={<MyComplaint/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/role" element={<Role/>}/>
        </Routes>

    )
}

export default RouteConfig