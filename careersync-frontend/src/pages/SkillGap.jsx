import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles, BookOpen, Code2, FolderKanban } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { skillService } from '../services'
import { Button, EmptyState, SkeletonCard } from '../components/ui'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function SkillGap() {
  const [analyses, setAnalyses] = useState([])
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [listLoading, setListLoading] = useState(true)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    skillService.getAll()
      .then(r => { setAnalyses(r.data.data || []); setListLoading(false) })
      .catch(() => setListLoading(false))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setResult(null)
    try {
      const r = await skillService.analyze(data)
      const analysis = r.data.data
      setResult(analysis)
      setAnalyses(prev => [analysis, ...prev])
      toast.success('Skill gap analysis complete!')
    } catch {} finally { setLoading(false) }
  }

  const parsedResult = result ? {
    missingSkills:    Array.isArray(result.missingSkills)    ? result.missingSkills    : (result.missingSkills || '').split('\n').filter(Boolean),
    recommendations:  Array.isArray(result.recommendations)  ? result.recommendations  : (result.recommendations || '').split('\n').filter(Boolean),
    learningResources:Array.isArray(result.learningResources) ? result.learningResources: (result.learningResources || '').split('\n').filter(Boolean),
    suggestedProjects:Array.isArray(result.suggestedProjects) ? result.suggestedProjects: (result.suggestedProjects || '').split('\n').filter(Boolean),
  } : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">Skill Gap Analyzer</h2>
            <p className="text-xs text-surface-400">Discover what you need to learn to land your target role</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Target Role *</label>
            <input
              placeholder="e.g. Senior Backend Engineer, ML Engineer, DevOps Engineer"
              className={`input-field ${errors.targetRole ? 'border-red-500' : ''}`}
              {...register('targetRole', { required: 'Target role is required' })}
            />
            {errors.targetRole && <p className="text-xs text-red-500 mt-1">{errors.targetRole.message}</p>}
          </div>

          <div>
            <label className="label">Your Current Skills</label>
            <textarea
              rows={3}
              placeholder="List your current skills, technologies, and experience (comma or newline separated)…"
              className="input-field resize-none"
              {...register('currentSkills')}
            />
          </div>

          <Button type="submit" loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full justify-center py-3">
            Analyze Skill Gap
          </Button>
        </form>
      </motion.div>

      {loading && (
        <div className="card p-10 text-center">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-600 text-amber-600 dark:text-amber-400">Analyzing skill gap with AI…</p>
        </div>
      )}

      {parsedResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Missing skills */}
          {parsedResult.missingSkills.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">
                  Missing Skills ({parsedResult.missingSkills.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {parsedResult.missingSkills.map((s, i) => (
                  <span key={i} className="badge-red text-[11px]">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommendations */}
            {parsedResult.recommendations.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Recommendations</h3>
                </div>
                <ol className="space-y-2">
                  {parsedResult.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                      <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 flex items-center justify-center text-[10px] font-700 flex-shrink-0 mt-0.5">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Learning Resources */}
            {parsedResult.learningResources.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Learning Resources</h3>
                </div>
                <ul className="space-y-2">
                  {parsedResult.learningResources.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggested Projects */}
          {parsedResult.suggestedProjects.length > 0 && (
            <div className="card p-5 border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/10">
              <div className="flex items-center gap-2 mb-3">
                <FolderKanban className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-display font-700 uppercase tracking-wider text-amber-600 dark:text-amber-400">Suggested Projects</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {parsedResult.suggestedProjects.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white dark:bg-dark-100 border border-amber-100 dark:border-amber-800/30 text-xs text-surface-700 dark:text-surface-300">
                    <span className="font-600 text-amber-600 dark:text-amber-400 mr-1.5">#{i+1}</span>{p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* History */}
      {!listLoading && analyses.length > 0 && !result && (
        <div>
          <h3 className="text-xs font-display font-700 text-surface-500 uppercase tracking-wider mb-3">Recent Analyses</h3>
          <div className="space-y-2">
            {analyses.slice(0, 5).map(a => (
              <button key={a.id} onClick={() => setResult(a)}
                className="w-full text-left card p-4 hover:shadow-card-hover transition-all flex items-center justify-between">
                <div>
                  <div className="text-sm font-600 text-surface-800 dark:text-surface-200">{a.targetRole}</div>
                  <div className="text-xs text-surface-400">{formatDate(a.createdAt)}</div>
                </div>
                <Zap className="w-4 h-4 text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
