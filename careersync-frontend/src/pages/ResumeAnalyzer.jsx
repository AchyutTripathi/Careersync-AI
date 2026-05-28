import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Trash2, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { resumeService } from '../services'
import { ScoreRing, ProgressBar, SkeletonCard, EmptyState, Button } from '../components/ui'
import { formatDate, splitLines, validatePDF } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ResumeAnalyzer() {
  const [resumes,    setResumes]    = useState([])
  const [selected,   setSelected]   = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const [analyzing,  setAnalyzing]  = useState(false)
  const [loadingAll, setLoadingAll] = useState(true)
  const [dragging,   setDragging]   = useState(false)

  const loadResumes = async () => {
    try {
      const r = await resumeService.getAll()
      const list = r.data.data || []
      setResumes(list)
      if (list.length && !selected) setSelected(list[0])
    } catch {}
    finally { setLoadingAll(false) }
  }

  useEffect(() => { loadResumes() }, [])

  const handleFile = async (file) => {
    const err = validatePDF(file)
    if (err) return toast.error(err)
    setUploading(true)
    try {
      const r = await resumeService.upload(file)
      const resume = r.data.data
      toast.success('Resume uploaded! Starting analysis…')
      setResumes(prev => [resume, ...prev])
      setSelected(resume)
      // auto-analyze
      await analyzeResume(resume.id)
    } catch {} finally { setUploading(false) }
  }

  const analyzeResume = async (id) => {
    setAnalyzing(true)
    try {
      const r = await resumeService.analyze(id)
      const updated = r.data.data
      setResumes(prev => prev.map(rv => rv.id === id ? updated : rv))
      setSelected(updated)
      toast.success('Analysis complete!')
    } catch {} finally { setAnalyzing(false) }
  }

  const deleteResume = async (id) => {
    try {
      await resumeService.delete(id)
      const next = resumes.filter(r => r.id !== id)
      setResumes(next)
      setSelected(next[0] || null)
      toast.success('Deleted')
    } catch {}
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const strengths  = splitLines(selected?.strengths)
  const weaknesses = splitLines(selected?.weaknesses)
  const skills     = splitLines(selected?.skills)
  const suggestions= splitLines(selected?.suggestions)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`card p-8 border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer
          ${dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-400'}`}
        onClick={() => document.getElementById('resume-input').click()}
      >
        <input id="resume-input" type="file" accept=".pdf" hidden onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        {uploading || analyzing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-sm font-600 text-brand-600 dark:text-brand-400">
              {uploading ? 'Uploading resume…' : 'AI is analyzing your resume…'}
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
              <Upload className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <p className="text-sm font-display font-700 text-surface-800 dark:text-surface-200">Drop your resume here</p>
              <p className="text-xs text-surface-400 mt-1">PDF only · Max 10 MB · AI analysis included</p>
            </div>
            <span className="btn-primary text-xs px-4 py-2 pointer-events-none">Browse File</span>
          </>
        )}
      </motion.div>

      {/* Resume list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="space-y-2">
          <h2 className="text-xs font-display font-700 text-surface-500 uppercase tracking-wider px-1">Your Resumes</h2>
          {loadingAll ? (
            <SkeletonCard lines={2} />
          ) : resumes.length === 0 ? (
            <EmptyState icon={<FileText />} title="No resumes yet" description="Upload a PDF to get started." />
          ) : (
            resumes.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all
                  ${selected?.id === r.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                    : 'border-surface-100 dark:border-surface-800 bg-white dark:bg-dark-100 hover:border-surface-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-display font-700 text-surface-800 dark:text-surface-200 truncate max-w-[80%]">
                    {r.originalFilename || 'Resume'}
                  </span>
                  {r.atsScore && <ScoreRing score={r.atsScore} size={32} strokeWidth={3} />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge text-[10px] px-1.5 py-0.5 ${
                    r.analysisStatus === 'COMPLETED' ? 'badge-green' :
                    r.analysisStatus === 'ANALYZING' ? 'badge-amber' : 'badge-blue'
                  }`}>
                    {r.analysisStatus}
                  </span>
                  <span className="text-[10px] text-surface-400">{formatDate(r.createdAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-10">
                <EmptyState
                  icon="📄"
                  title="Select a resume"
                  description="Upload or select a resume to view AI analysis"
                />
              </motion.div>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Header card */}
                <div className="card p-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={selected.atsScore || 0} size={72} strokeWidth={6} />
                    <div>
                      <h3 className="font-display font-700 text-surface-900 dark:text-surface-50">
                        {selected.originalFilename || 'Resume'}
                      </h3>
                      <p className="text-xs text-surface-400 mt-0.5">{formatDate(selected.createdAt)}</p>
                      <div className="mt-2">
                        <ProgressBar value={selected.atsScore || 0} label="ATS Score" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selected.analysisStatus !== 'COMPLETED' && (
                      <Button
                        size="sm" variant="secondary" icon={<Sparkles className="w-3.5 h-3.5" />}
                        loading={analyzing}
                        onClick={() => analyzeResume(selected.id)}
                      >
                        Analyze
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" icon={<RefreshCw className="w-3.5 h-3.5" />}
                      loading={analyzing}
                      onClick={() => analyzeResume(selected.id)}
                    />
                    <Button size="sm" variant="ghost"
                      icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
                      onClick={() => deleteResume(selected.id)}
                    />
                  </div>
                </div>

                {selected.analysisStatus === 'COMPLETED' && (
                  <>
                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="card p-5">
                        <h4 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500 mb-3">Detected Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((s, i) => (
                            <span key={i} className="badge-green text-[11px]">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-brand-500" />
                          <h4 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Strengths</h4>
                        </div>
                        <ul className="space-y-2">
                          {strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                              <div className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs font-display font-700 uppercase tracking-wider text-surface-500">Areas to Improve</h4>
                        </div>
                        <ul className="space-y-2">
                          {weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                              <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="card p-5 border-brand-200 dark:border-brand-800/50 bg-brand-50/40 dark:bg-brand-950/10">
                        <h4 className="text-xs font-display font-700 uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
                        </h4>
                        <ol className="space-y-2">
                          {suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-700 dark:text-surface-300">
                              <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 flex items-center justify-center text-[10px] font-700 flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                )}

                {selected.analysisStatus === 'PENDING' && (
                  <div className="card p-10 text-center">
                    <div className="text-3xl mb-3">⏳</div>
                    <p className="text-sm font-600 text-surface-700 dark:text-surface-300">Click Analyze to start AI analysis</p>
                  </div>
                )}

                {selected.analysisStatus === 'ANALYZING' && (
                  <div className="card p-10 text-center">
                    <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm font-600 text-brand-600 dark:text-brand-400">Gemini AI is analyzing your resume…</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
