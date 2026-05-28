import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { jdService, resumeService } from '../services'
import { Button, ProgressBar, ScoreRing } from '../components/ui'
import toast from 'react-hot-toast'

export default function JDMatcher() {
  const [resumes,  setResumes]  = useState([])
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    resumeService.getAll().then(r => setResumes(r.data.data || [])).catch(() => {})
  }, [])

  const onSubmit = async ({ jobDescription, resumeId }) => {
    setLoading(true)
    setResult(null)
    try {
      const r = await jdService.match({ jobDescription, resumeId: resumeId || undefined })
      setResult(r.data.data)
      toast.success('Match analysis complete!')
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">JD Matcher</h2>
            <p className="text-xs text-surface-400">Compare your resume against a job description</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="label">Select Resume (optional)</label>
              <select className="input-field" {...register('resumeId')}>
                <option value="">Use latest resume</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.originalFilename || `Resume #${r.id}`}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Job Description *</label>
            <textarea
              rows={8}
              placeholder="Paste the full job description here… Include the role, responsibilities, requirements, and qualifications."
              className={`input-field resize-none ${errors.jobDescription ? 'border-red-500' : ''}`}
              {...register('jobDescription', { required: 'Job description is required', minLength: { value: 100, message: 'Please paste the full JD (min 100 characters)' } })}
            />
            {errors.jobDescription && <p className="text-xs text-red-500 mt-1">{errors.jobDescription.message}</p>}
          </div>

          <Button type="submit" loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full justify-center py-3">
            Analyze Match
          </Button>
        </form>
      </motion.div>

      {/* Results */}
      {loading && (
        <div className="card p-10 text-center">
          <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-600 text-brand-600 dark:text-brand-400">Gemini AI is analyzing the match…</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Score header */}
          <div className="card p-6 flex items-center gap-6">
            <ScoreRing score={result.matchPercentage || 0} size={88} strokeWidth={7} />
            <div className="flex-1">
              <h3 className="text-xl font-display font-800 text-surface-900 dark:text-surface-50">
                {result.matchPercentage >= 80 ? 'Great Match! 🎉' :
                 result.matchPercentage >= 60 ? 'Good Match 👍' :
                 result.matchPercentage >= 40 ? 'Partial Match 🤔' : 'Low Match 😬'}
              </h3>
              <p className="text-sm text-surface-500 mt-1">{result.overallAssessment}</p>
              <div className="mt-3">
                <ProgressBar value={result.matchPercentage || 0} label="Match Score" color={
                  result.matchPercentage >= 80 ? 'brand' : result.matchPercentage >= 60 ? 'amber' : 'red'
                } />
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <h4 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">
                  Matched Keywords ({result.matchedKeywords?.length || 0})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(result.matchedKeywords || []).map((k, i) => (
                  <span key={i} className="badge-green text-[11px]">{k}</span>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-500" />
                <h4 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">
                  Missing Keywords ({result.missingKeywords?.length || 0})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(result.missingKeywords || []).map((k, i) => (
                  <span key={i} className="badge-red text-[11px]">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <div className="card p-5 border-brand-200 dark:border-brand-800/50 bg-brand-50/40 dark:bg-brand-950/10">
              <h4 className="text-xs font-display font-700 uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Suggested Improvements
              </h4>
              <ol className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-surface-700 dark:text-surface-300">
                    <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 flex items-center justify-center text-[10px] font-700 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {imp}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
