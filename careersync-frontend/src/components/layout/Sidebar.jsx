import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Briefcase, PenLine, Zap,
  Mic2, Map, Kanban, MessageSquare, User, LogOut,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resume',         icon: FileText,         label: 'Resume Analyzer' },
  { to: '/jd-matcher',     icon: Briefcase,        label: 'JD Matcher' },
  { to: '/cover-letter',   icon: PenLine,          label: 'Cover Letter' },
  { to: '/skill-gap',      icon: Zap,              label: 'Skill Gap' },
  { to: '/interview',      icon: Mic2,             label: 'Mock Interview' },
  { to: '/roadmap',        icon: Map,              label: 'Career Roadmap' },
  { to: '/job-tracker',    icon: Kanban,           label: 'Job Tracker' },
  { to: '/chatbot',        icon: MessageSquare,    label: 'AI Chatbot' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-30 flex flex-col
                 bg-white dark:bg-dark-100
                 border-r border-surface-100 dark:border-surface-800/50
                 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-100 dark:border-surface-800/50">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-glow-green">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-700 text-surface-900 dark:text-surface-50 whitespace-nowrap text-[15px]"
            >
              CareerSync <span className="text-brand-500">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active flex' : 'sidebar-link flex'
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-[13px]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom — user + collapse */}
      <div className="border-t border-surface-100 dark:border-surface-800/50 p-2 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? 'sidebar-link-active flex' : 'sidebar-link flex'
          }
        >
          <div className="w-4 h-4 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-700">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-[13px] truncate"
              >
                {user?.name || 'Profile'}
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={logout}
          className="sidebar-link w-full flex text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-[13px]"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCollapsed(c => !c)}
          className="sidebar-link w-full flex justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>
    </motion.aside>
  )
}
