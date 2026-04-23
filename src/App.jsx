import { useState } from 'react'
import Sidebar from './components/sidebar'
import RouteConfig from './routes/routeConfig'
import Navbar from './components/navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <Navbar/>
        <RouteConfig/>
    </div>
  )
}

export default App
