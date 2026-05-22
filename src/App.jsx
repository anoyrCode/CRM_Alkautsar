import Sidebarr from './components/sidebar'
import RouteConfig from './routes/routeConfig'
import ResNav from './components/Layouts/resNav'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebarr />
      <div className="xl:ml-64">
        <ResNav />
        <main className="xl:pt-14">
          <RouteConfig />
        </main>
      </div>
    </div>
  )
}

export default App
