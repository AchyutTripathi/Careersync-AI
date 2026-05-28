import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic2, Sparkles, ChevronDown, ChevronUp, Star, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { interviewService } from '../services'
import { Button, Select, ScoreRing } from '../components/ui'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'HR',            label: 'HR / Behavioral' },
  { value: 'DSA',           label: 'Data Structures & Algorithms' },
  { value: 'BACKEND',       label: 'Backend Engineering' },
  { value: 'FRONTEND',      label: 'Frontend Engineering' },
  { value: 'SYSTEM_DESIGN', label: 'System Design' },
  { value: 'BEHAVIORAL',    label: 'Behavioral' },
  { value: 'MIXED',         label: 'Mixed' },
]

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function MockInterview() {
  const [session,   setSession]   = useState(null)
  const [feedback,  setFeedback]  = useState(null)
  const [answers,   setAnswers]   = useState({})
  const [step,      setStep]      = useState('setup')  // setup | questions | feedback
  const [loading,   setLoading]   = useState(false)
  const [expanded,  setExpanded]  = useState(null)
  const [submitting,setSubmitting]= useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { category: 'BACKEND', difficultyLevel: 'INTERMEDIATE', numberOfQuestions: 5 }
  })

  const generate = async (data) => {
    setLoading(true)
    try {
      const r = await interviewService.generate(data)
      setSession(r.data.data)
      setStep('questions')
      setAnswers({})
      setFeedback(null)
      toast.success('Interview questions generated!')
    } catch {} finally { setLoading(false) }
  }

  const submitAnswers = async () => {
    if (!session) return
    const answersText = session.questions?.map((q, i) => (
      `Q${i+1}: ${typeof q === 'string' ? q : q.question}\nA: ${answers[i] || '(no answer)'}`
    )).join('\n\n')

    setSubmitting(true)
    try {
      const r = await interviewService.feedback({ sessionId: session.id, answers: answersText })
      setFeedback(r.data.data)
      setStep('feedback')
      toast.success('Feedback generated!')
    } catch {} finally { setSubmitting(false) }
  }

  const reset = () => { setSession(null); setFeedback(null); setAnswers({}); setStep('setup') }

  const questions = session?.questions
    ? (typeof session.questions === 'string'
        ? session.questions.split('\n').filter(l => l.trim()).map((q, i) => ({ number: i+1, question: q.replace(/^\d+[\.\)]\s*/, '') }))
        : session.questions)
    : []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* ── Setup ── */}
        {step === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                  <Mic2 className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">Mock Interview</h2>
                  <p className="text-xs text-surface-400">AI-generated questions + detailed feedback</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(generate)} className="space-y-4">
                <div>
                  <label className="label">Interview Category *</label>
                  <select className="input-field" {...register('category', { required: true })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Difficulty</label>
                    <select className="input-field" {...register('difficultyLevel')}>
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Number of Questions</label>
                    <select className="input-field" {...register('numberOfQuestions')}>
                      {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Role Context (optional)</label>
                  <input placeholder="e.g. Senior Backend Engineer at a fintech startup" className="input-field" {...register('roleContext')} />
                </div>

                <Button type="submit" loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full justify-center py-3">
                  Generate Interview
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── Questions ── */}
        {step === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="section-title">Interview Session</h2>
                <p className="section-subtitle">{session?.category} · {session?.difficultyLevel} · {questions.length} questions</p>
              </div>
              <button onClick={reset} className="btn-ghost text-xs">← New Session</button>
            </div>

            {questions.map((q, i) => {
              const qText = typeof q === 'string' ? q : q.question
              const isOpen = expanded === i
              return (
                <div key={i} className="card overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between text-left"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-xs font-700 flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-600 text-surface-800 dark:text-surface-200 line-clamp-2">{qText}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-surface-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-surface-400 flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          {q.hint && (
                            <p className="text-xs text-surface-400 mb-3 italic">💡 Hint: {q.hint}</p>
                          )}
                          <textarea
                            rows={5}
                            placeholder="Type your answer here…"
                            className="input-field resize-none text-xs"
                            value={answers[i] || ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            <div className="flex gap-3">
              <Button onClick={reset} variant="secondary" className="flex-1 justify-center">Start Over</Button>
              <Button onClick={submitAnswers} loading={submitting} icon={<Send className="w-4 h-4" />} className="flex-1 justify-center">
                Submit for Feedback
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Feedback ── */}
        {step === 'feedback' && feedback && (
          <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="section-title">Interview Feedback</h2>
                <p className="section-subtitle">Detailed AI evaluation of your answers</p>
              </div>
              <button onClick={reset} className="btn-ghost text-xs">New Interview</button>
            </div>

            {/* Overall score */}
            <div className="card p-6 flex items-center gap-6">
              <ScoreRing score={feedback.overallScore || 0} size={88} strokeWidth={7} />
              <div>
                <div className="text-xs font-display font-700 uppercase tracking-wider text-surface-500 mb-1">Overall Performance</div>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{feedback.overallFeedback}</p>
              </div>
            </div>

            {/* Per-question feedback */}
            {(feedback.questionFeedbacks || []).map((qf, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-100 dark:bg-dark-200 text-surface-600 dark:text-surface-400 text-xs font-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qf.questionNumber || i+1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-600 text-surface-800 dark:text-surface-200 mb-1">{qf.question}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < Math.round((qf.score || 0) / 20) ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}`} />
                      ))}
                      <span className="text-xs text-surface-500">{qf.score}/100</span>
                    </div>
                    <p className="text-xs text-surface-600 dark:text-surface-400">{qf.feedback}</p>
                    {qf.strengths && (
                      <div className="mt-2 p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/20 text-xs text-brand-700 dark:text-brand-300">
                        ✓ {qf.strengths}
                      </div>
                    )}
                    {qf.improvements && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-700 dark:text-amber-300">
                        ↗ {qf.improvements}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={reset} className="w-full justify-center" variant="secondary">Start New Interview</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
