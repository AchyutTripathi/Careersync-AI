import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, Briefcase, Mic2, Zap, TrendingUp, ArrowRight,
  ChevronRight, Sparkles, Target, Award
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { dashboardService } from '../services'
import { useAuth } from '../context/AuthContext'
import { ScoreRing, SkeletonCard } from '../components/ui'
import { toTitleCase, timeAgo } from '../utils/helpers'

const STATUS_PALETTE = {
  APPLIED:      '#f59e0b',
  INTERVIEW:    '#8b5cf6',
  OFFER:        '#14b46a',
  REJECTED:     '#ef4444',
  WISHLIST:     '#3b82f6',
  PHONE_SCREEN: '#06b6d4',
  ACCEPTED:     '#10b981',
  WITHDRAWN:    '#6b7280',
}

const QUICK_ACTIONS = [
  { to: '/resume',       icon: FileText,  color: 'brand',  label: 'Analyze Resume',    sub: 'Upload & get ATS score' },
  { to: '/jd-matcher',   icon: Briefcase, color: 'blue',   label: 'Match a Job',        sub: 'Compare with JD' },
  { to: '/interview',    icon: Mic2,      color: 'purple', label: 'Practice Interview', sub: 'AI mock questions' },
  { to: '/skill-gap',    icon: Zap,       color: 'amber',  label: 'Skill Gap Analysis', sub: 'Find missing skills' },
]

const COLOR_MAP = {
  brand: 'text-brand-500 bg-brand-50 dark:bg-brand-950/30',
  blue:  'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  purple:'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
  amber: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
}

const fade    = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

export default function Dashboard() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.stats()
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pieData = stats?.applicationsByStatus
    ? Object.entries(stats.applicationsByStatus).map(([k, v]) => ({
        name: toTitleCase(k), value: v, color: STATUS_PALETTE[k] || '#94a3b8'
      }))
    : []

  const barData = pieData.slice(0, 5)

  const STAT_CARDS = [
    {
      label: 'Resumes Analyzed', value: stats?.totalResumes ?? '—',
      icon: FileText, color: 'brand', sub: stats?.latestAtsScore ? `Latest ATS: ${stats.latestAtsScore}` : 'No uploads yet'
    },
    {
      label: 'Job Applications', value: stats?.totalApplications ?? '—',
      icon: Briefcase, color: 'blue', sub: `${stats?.activeApplications ?? 0} active`
    },
    {
      label: 'Interview Sessions', value: stats?.interviewSessions ?? '—',
      icon: Mic2, color: 'purple', sub: 'Mock practice sessions'
    },
    {
      label: 'Skill Analyses', value: stats?.skillAnalyses ?? '—',
      icon: Zap, color: 'amber', sub: 'Gap analyses run'
    },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-800 text-surface-900 dark:text-surface-50">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">Here's your career progress at a glance.</p>
        </div>
        {stats?.latestAtsScore && (
          <div className="card p-3 flex items-center gap-3">
            <ScoreRing score={stats.latestAtsScore} size={56} strokeWidth={5} />
            <div>
              <div className="text-[11px] font-600 text-surface-500 uppercase tracking-wider">ATS Score</div>
              <div className="text-xs text-surface-500 mt-0.5">Latest resume</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} lines={2} />)
          : STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
            <motion.div key={label} variants={fade} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_MAP[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
              </div>
              <div className="text-2xl font-display font-800 text-surface-900 dark:text-surface-50">{value}</div>
              <div className="text-xs font-600 text-surface-700 dark:text-surface-300 mt-0.5">{label}</div>
              <div className="text-[11px] text-surface-400 mt-0.5">{sub}</div>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Charts row */}
      {!loading && pieData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="card p-5">
            <h3 className="text-sm font-display font-700 text-surface-800 dark:text-surface-200 mb-4">Applications by Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={24}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--color-dark-100, #161b29)', border: 'none', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: 'rgba(20,180,106,0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card p-5">
            <h3 className="text-sm font-display font-700 text-surface-800 dark:text-surface-200 mb-4">Application Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#161b29', border: 'none', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-display font-700 text-surface-700 dark:text-surface-300 mb-3">Quick Actions</h2>
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {QUICK_ACTIONS.map(({ to, icon: Icon, color, label, sub }) => (
            <motion.div key={to} variants={fade}>
              <Link
                to={to}
                className="card p-4 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${COLOR_MAP[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-display font-700 text-surface-800 dark:text-surface-200">{label}</div>
                  <div className="text-[11px] text-surface-400 mt-0.5">{sub}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-surface-400 self-end" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Profile completion prompt */}
      {!user?.targetRole && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5 border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-950/10 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-sm font-display font-700 text-surface-800 dark:text-surface-200">Complete your profile</div>
              <div className="text-xs text-surface-500">Set your target role to get personalized recommendations</div>
            </div>
          </div>
          <Link to="/profile" className="btn-primary text-xs px-4 py-2 flex-shrink-0">
            Complete <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
