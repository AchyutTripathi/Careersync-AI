import { useState } from 'react'
import { motion } from 'framer-motion'
import { PenLine, Sparkles, Copy, Check, Download } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { coverLetterService } from '../services'
import { Button } from '../components/ui'
import { useCopyToClipboard } from '../hooks'
import toast from 'react-hot-toast'

export default function CoverLetter() {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const { copied, copy } = useCopyToClipboard()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setResult(null)
    try {
      const r = await coverLetterService.generate(data)
      setResult(r.data.data)
      toast.success('Cover letter generated!')
    } catch {} finally { setLoading(false) }
  }

  const downloadTxt = () => {
    const blob = new Blob([result.coverLetter], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'cover-letter.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h2 className="font-display font-700 text-surface-900 dark:text-surface-50">Cover Letter Generator</h2>
            <p className="text-xs text-surface-400">AI writes a tailored cover letter in seconds</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name *</label>
              <input
                placeholder="Google, Microsoft, Stripe…"
                className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                {...register('companyName', { required: 'Company name is required' })}
              />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
            </div>
            <div>
              <label className="label">Role / Position *</label>
              <input
                placeholder="Senior Software Engineer"
                className={`input-field ${errors.role ? 'border-red-500' : ''}`}
                {...register('role', { required: 'Role is required' })}
              />
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Your Experience Summary *</label>
            <textarea
              rows={4}
              placeholder="Briefly describe your background, key achievements, skills, and years of experience relevant to this role…"
              className={`input-field resize-none ${errors.experience ? 'border-red-500' : ''}`}
              {...register('experience', { required: 'Experience summary is required', minLength: { value: 30, message: 'Please provide more detail' } })}
            />
            {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
          </div>

          <div>
            <label className="label">Additional Info (optional)</label>
            <textarea
              rows={3}
              placeholder="Anything specific to mention — why you love the company, referrals, unique context…"
              className="input-field resize-none"
              {...register('additionalInfo')}
            />
          </div>

          <Button type="submit" loading={loading} icon={<Sparkles className="w-4 h-4" />} className="w-full justify-center py-3">
            Generate Cover Letter
          </Button>
        </form>
      </motion.div>

      {loading && (
        <div className="card p-10 text-center">
          <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-600 text-brand-600 dark:text-brand-400">Writing your cover letter…</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-purple-500" />
              <h3 className="font-display font-700 text-surface-900 dark:text-surface-50">Generated Cover Letter</h3>
              {result.wordCount && (
                <span className="badge-blue text-[10px]">{result.wordCount} words</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => copy(result.coverLetter)}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button size="sm" variant="secondary" icon={<Download className="w-3.5 h-3.5" />} onClick={downloadTxt}>
                Download
              </Button>
            </div>
          </div>

          <div className="bg-surface-50 dark:bg-dark-200 rounded-xl p-5 border border-surface-100 dark:border-surface-800">
            <pre className="ai-response font-body">{result.coverLetter}</pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}
