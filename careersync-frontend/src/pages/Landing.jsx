import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, FileText, Briefcase, PenLine, Zap, Mic2,
  Map, Kanban, MessageSquare, ArrowRight, CheckCircle2,
  Star, TrendingUp, Shield
} from 'lucide-react'

const FEATURES = [
  { icon: FileText,       color: 'brand',  title: 'Resume Analyzer',       desc: 'AI-powered ATS scoring, skill extraction, and actionable improvement suggestions.' },
  { icon: Briefcase,      color: 'blue',   title: 'JD Matcher',            desc: 'Compare your resume against job descriptions and see your match percentage instantly.' },
  { icon: PenLine,        color: 'purple', title: 'Cover Letter AI',       desc: 'Generate tailored, professional cover letters for any role in seconds.' },
  { icon: Zap,            color: 'amber',  title: 'Skill Gap Analyzer',    desc: 'Discover missing skills for your target role and get a personalized learning plan.' },
  { icon: Mic2,           color: 'red',    title: 'Mock Interviews',       desc: 'Practice with AI-generated questions and get detailed feedback on your answers.' },
  { icon: Map,            color: 'brand',  title: 'Career Roadmap',        desc: 'Get a personalized milestone-based career roadmap tailored to your goals.' },
  { icon: Kanban,         color: 'blue',   title: 'Job Tracker',           desc: 'Track every application with status updates, notes, and analytics.' },
  { icon: MessageSquare,  color: 'purple', title: 'AI Career Chatbot',     desc: 'Ask anything career-related — your personal AI advisor available 24/7.' },
]

const STATS = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '95%',  label: 'ATS Success Rate' },
  { value: '3×',   label: 'Interview Callback Rate' },
  { value: '4.9★', label: 'User Rating' },
]

const COLOR_MAP = {
  brand:  'text-brand-500 bg-brand-50 dark:bg-brand-950/30',
  blue:   'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  purple: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
  amber:  'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  red:    'text-red-500 bg-red-50 dark:bg-red-950/30',
}

const fade  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-300 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 glass border-b border-surface-100 dark:border-surface-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-green">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-surface-900 dark:text-surface-50">
              CareerSync <span className="text-brand-500">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 badge-green mb-6 py-1.5 px-3"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Gemini AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-800 text-surface-900 dark:text-surface-50 leading-[1.05] mb-6"
          >
            Land Your{' '}
            <span className="text-gradient">Dream Job</span>
            <br />with AI Precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            CareerSync AI analyzes your resume, matches job descriptions, generates cover letters,
            runs mock interviews, and builds your personalized career roadmap — all powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Sign In
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-surface-500"
          >
            {['No credit card required', 'Free to start', 'Cancel anytime'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 border-y border-surface-100 dark:border-surface-800/50 bg-surface-50 dark:bg-dark-200">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {STATS.map(({ value, label }) => (
              <motion.div key={label} variants={fade}>
                <div className="text-3xl font-display font-800 text-gradient mb-1">{value}</div>
                <div className="text-sm text-surface-500">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-display font-800 text-surface-900 dark:text-surface-50 mb-3">
              Everything you need to <span className="text-gradient">accelerate your career</span>
            </h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              8 powerful AI tools designed to take you from application to offer letter.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <motion.div key={title} variants={fade} className="card p-5 hover:shadow-card-hover transition-all duration-200">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${COLOR_MAP[color]}`}>
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <h3 className="font-display font-700 text-sm text-surface-900 dark:text-surface-50 mb-1.5">{title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-800 text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-brand-100 mb-8 text-lg">
              Join thousands of professionals using CareerSync AI to optimize their career journey.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-display font-700 rounded-xl hover:bg-brand-50 transition-all active:scale-95 shadow-lg">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-100 dark:border-surface-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span className="font-display font-600">CareerSync AI</span>
          </div>
          <span className="flex items-center gap-1.5">
            © 2026 CareerSync AI. Built with{' '}
              <span className="animate-heartbeat text-red-500 text-base leading-none select-none">
                ♥
              </span>{' '}
            by Achyut Tripathi
          </span>
        </div>
      </footer>
    </div>
  )
}
