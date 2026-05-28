import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/dashboard'

  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (e) {
      // interceptor already toasts
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-300">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-20 translate-y-20" />

        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-700 text-white text-lg">CareerSync AI</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-display font-800 text-white mb-4 leading-tight">
            Your AI Career<br />Companion
          </h2>
          <p className="text-brand-100 leading-relaxed text-sm max-w-xs">
            Analyze resumes, match job descriptions, generate cover letters, and practice mock interviews — all powered by Gemini AI.
          </p>

          <div className="mt-8 space-y-3">
            {['Resume ATS scoring', 'JD match analysis', 'AI cover letters', 'Mock interviews'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-brand-100 text-sm">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-brand-200 text-xs">© 2026 CareerSync AI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-green">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-surface-900 dark:text-surface-50">
              CareerSync <span className="text-brand-500">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-display font-800 text-surface-900 dark:text-surface-50 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-surface-500 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-600">Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-surface-50 dark:bg-dark-100 border border-surface-100 dark:border-surface-800">
            <p className="text-xs text-surface-500 mb-2 font-600">Demo credentials</p>
            <p className="text-xs font-mono text-surface-600 dark:text-surface-400">demo@careersync.ai</p>
            <p className="text-xs font-mono text-surface-600 dark:text-surface-400">password123</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
