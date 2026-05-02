import { useState } from 'react'
import Sidebar from './components/sidebar'
import RouteConfig from './routes/routeConfig'
import Navbar from './components/navbar'
import Dashboard from './pages/dashboard'
import CreateComplaint from './pages/createComplaint'
import Sidebarr from './components/sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='lg:flex'>
      <Sidebarr/>
      <div className='flex-8 min-w-0'>
        <Navbar/>
        <RouteConfig/>
      </div>
    </div>
  )
}

export default App
