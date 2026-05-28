import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/resume':       'Resume Analyzer',
  '/jd-matcher':   'JD Matcher',
  '/cover-letter': 'Cover Letter Generator',
  '/skill-gap':    'Skill Gap Analyzer',
  '/interview':    'Mock Interview',
  '/roadmap':      'Career Roadmap',
  '/job-tracker':  'Job Tracker',
  '/chatbot':      'AI Chatbot',
  '/profile':      'Profile',
}

export default function Topbar({ sidebarWidth = 240 }) {
  const { dark, toggle } = useTheme()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'CareerSync AI'

  return (
    <header
      className="fixed top-0 right-0 z-20 h-14 flex items-center justify-between px-6
                 bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl
                 border-b border-surface-100 dark:border-surface-800/50"
      style={{ left: sidebarWidth }}
    >
      {/* Page title */}
      <h1 className="text-[15px] font-display font-700 text-surface-900 dark:text-surface-50">
        {title}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-surface-500 hover:text-surface-700 dark:hover:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-dark-50 transition-all"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-px h-5 bg-surface-200 dark:bg-surface-800" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-400
                          flex items-center justify-center text-white text-xs font-700
                          shadow-glow-green">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-500 text-surface-700 dark:text-surface-300 hidden sm:block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  )
}
