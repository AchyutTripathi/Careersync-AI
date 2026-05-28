import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 68 : 240

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Topbar sidebarWidth={sidebarWidth} />

      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pt-14 min-h-screen"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
