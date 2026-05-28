import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Sparkles, ChevronRight, Clock, Code2, FolderKanban, History } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { roadmapService } from '../services'
import { Button } from '../components/ui'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const PHASE_COLORS = [
  'bg-brand-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-red-500',
]

const PHASE_BG = [
  'bg-brand-50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800/40',
  'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40',
  'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40',
  'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40',
  'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40',
]

export default function CareerRoadmap() {
  const [result,    setResult]    = useState(null)
  const [history,   setHistory]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [histLoading, setHistLoading] = useState(true)
  const [view,      setView]      = useState('form') // form | result | history

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    roadmapService.getAll()
      .then(r => setHistory(r.data.data || []))
      .catch(() => {})
      .finally(() => setHistLoading(false))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setResult(null)
    try {
      const r = await roadmapService.generate(data)
      setResult(r.data.data)
      setView('result')
      setHistory(prev => [r.data.data, ...prev])
      toast.success('Career roadmap generated!')
    } catch {} finally { setLoading(false) }
  }

  const loadHistoryItem = (item) => {
    // Parse stored roadmap from history item
    const parsed = {
      id: item.id,
      targetRole: item.targetRole,
      currentRole: item.currentRole,
      roadmapContent: item.roadmapContent,
      timeline: item.timeline,
      createdAt: item.createdAt,
      milestones: (() => {
        try { return JSON.parse(item.milestones || '[]') } catch { return [] }
      })(),
      technologies: (item.technologies || '').split('\n').filter(Boolean),
      projects: (item.projects || '').split('\n').filter(Boolean),
    }
    setResult(parsed)
    setView('result')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('form')}
          className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all
            ${view === 'form' ? 'bg-brand-500 text-white shadow-glow-green' : 'btn-ghost'}`}
        >
          Generate New
        </button>
        {result && (
          <button
            onClick={() => setView('result')}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all
              ${view === 'result' ? 'bg-brand-500 text-white shadow-glow-green' : 'btn-ghost'}`}
          >
            Current Roadmap
          </button>
        )}
        <button
          onClick={() => setView('history')}
          className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all flex items-center gap-1.5
            ${view === 'history' ? 'bg-brand-500 text-white shadow-glow-green' : 'btn-ghost'}`}
        >
          <History className="w-3.5 h-3.5" /> History ({history.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Form ── */}
        {view === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
                  <Map className="w-4 h-4 text-brand-500" />
                </div>
                <div>
                  <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">Career Roadmap Generator</h2>
                  <p className="text-xs text-surface-400">AI creates your personalized step-by-step career plan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Target Role *</label>
                    <input
                      placeholder="e.g. Principal Software Engineer"
                      className={`input-field ${errors.targetRole ? 'border-red-500' : ''}`}
                      {...register('targetRole', { required: 'Target role is required' })}
                    />
                    {errors.targetRole && <p className="text-xs text-red-500 mt-1">{errors.targetRole.message}</p>}
                  </div>
                  <div>
                    <label className="label">Current Role</label>
                    <input
                      placeholder="e.g. Junior Software Developer"
                      className="input-field"
                      {...register('currentRole')}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Years of Experience</label>
                  <select className="input-field" {...register('experienceYears', { valueAsNumber: true })}>
                    <option value="">Select experience level</option>
                    {[0,1,2,3,4,5,6,7,8,10,15].map(y => (
                      <option key={y} value={y}>{y === 0 ? 'Fresher / Student' : `${y}+ years`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Current Skills</label>
                  <textarea
                    rows={3}
                    placeholder="List your current skills and technologies (comma or newline separated)…"
                    className="input-field resize-none"
                    {...register('currentSkills')}
                  />
                </div>

                <Button type="submit" loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full justify-center py-3">
                  Generate My Roadmap
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {view === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Header */}
            <div className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Map className="w-4 h-4 text-brand-500" />
                    <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">
                      {result.currentRole ? `${result.currentRole} → ` : ''}{result.targetRole}
                    </h2>
                  </div>
                  {result.timeline && (
                    <div className="flex items-center gap-1.5 text-sm text-surface-500">
                      <Clock className="w-3.5 h-3.5" />
                      Estimated timeline: <span className="font-600 text-brand-500">{result.timeline}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setView('form')} className="btn-ghost text-xs flex-shrink-0">New Roadmap</button>
              </div>

              {result.roadmapContent && (
                <p className="mt-3 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                  {result.roadmapContent}
                </p>
              )}
            </div>

            {/* Milestones timeline */}
            {result.milestones?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500 mb-4">
                  Roadmap Phases
                </h3>
                <div className="space-y-4">
                  {result.milestones.map((ms, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${PHASE_BG[i % PHASE_BG.length]}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full ${PHASE_COLORS[i % PHASE_COLORS.length]} flex items-center justify-center text-white text-xs font-700 flex-shrink-0 mt-0.5`}>
                          {ms.phase || i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-sm font-display font-700 text-surface-800 dark:text-surface-200">{ms.title}</h4>
                            {ms.duration && (
                              <span className="text-[10px] font-600 text-surface-400 flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" /> {ms.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-surface-600 dark:text-surface-400 mb-2">{ms.description}</p>
                          {ms.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {ms.skills.map((s, j) => (
                                <span key={j} className="badge-blue text-[10px]">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies + Projects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.technologies?.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Technologies to Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.technologies.map((t, i) => (
                      <span key={i} className="badge-purple text-[11px]">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.projects?.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderKanban className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Suggested Projects</h3>
                  </div>
                  <ol className="space-y-2">
                    {result.projects.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                        <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[10px] font-700 flex-shrink-0 mt-0.5">{i+1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── History ── */}
        {view === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {histLoading ? (
              <div className="card p-10 text-center">
                <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
              </div>
            ) : history.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-sm font-600 text-surface-600 dark:text-surface-400">No roadmaps generated yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <button key={item.id || i} onClick={() => loadHistoryItem(item)}
                    className="w-full text-left card p-4 hover:shadow-card-hover transition-all flex items-center justify-between">
                    <div>
                      <div className="text-sm font-600 text-surface-800 dark:text-surface-200">
                        {item.currentRole ? `${item.currentRole} → ` : ''}{item.targetRole}
                      </div>
                      <div className="text-xs text-surface-400 mt-0.5">{formatDate(item.createdAt)}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-400" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
