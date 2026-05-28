import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true)
    try {
      await authRegister(name, email, password)
      toast.success('Account created! Welcome to CareerSync AI 🎉')
      navigate('/dashboard')
    } catch (e) {
      // interceptor handles toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-300">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-surface-900 via-dark-100 to-dark-200 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <span className="font-display font-700 text-white text-lg">CareerSync AI</span>
        </div>

        <div className="relative">
          <div className="text-6xl mb-6 animate-float">🚀</div>
          <h2 className="text-4xl font-display font-800 text-white mb-4 leading-tight">
            Start your<br />career journey today
          </h2>
          <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
            Join thousands of professionals who use CareerSync AI to land their dream jobs faster.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { val: '50K+', lbl: 'Users' },
              { val: '95%',  lbl: 'ATS Pass Rate' },
              { val: '3×',   lbl: 'More Interviews' },
              { val: 'Free', lbl: 'To Start' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xl font-display font-800 text-brand-400">{val}</div>
                <div className="text-xs text-surface-500">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-surface-600 text-xs">© 2026 CareerSync AI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-green">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-surface-900 dark:text-surface-50">
              CareerSync <span className="text-brand-500">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-display font-800 text-surface-900 dark:text-surface-50 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-surface-500 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-600">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'At least 2 characters' }
                })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

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
                  placeholder="Min. 6 characters"
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' }
                  })}
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

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-[11px] text-surface-400 mt-5 text-center">
            By signing up you agree to our{' '}
            <span className="text-brand-500 cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-brand-500 cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
