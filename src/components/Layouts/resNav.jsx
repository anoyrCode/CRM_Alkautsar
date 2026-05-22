import { useState } from 'react'
import NavSidebar from '../navSidebar'
import Navbar from '../navbar'

function ResNav() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Navbar onMenuClick={() => setIsOpen(true)} />
      <NavSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default ResNav
