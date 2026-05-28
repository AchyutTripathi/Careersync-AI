import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  User, Mail, Briefcase, Target, Clock, Save,
  Shield, Key, LogOut, Sparkles, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services'
import { Button } from '../components/ui'
import toast from 'react-hot-toast'

const ROLES = [
  'Student / Fresher',
  'Junior Developer',
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'CTO',
  'Product Manager',
  'Data Scientist',
  'ML Engineer',
  'DevOps / SRE',
  'QA Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Other',
]

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name:           user?.name           || '',
      currentRole:    user?.currentRole    || '',
      targetRole:     user?.targetRole     || '',
      yearsExperience:user?.yearsExperience || '',
    }
  })

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const r = await authService.update(data)
      updateUser(r.data.data)
      setSaved(true)
      toast.success('Profile updated!')
      setTimeout(() => setSaved(false), 3000)
    } catch {} finally { setSaving(false) }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-white text-xl font-display font-800 shadow-glow-green-lg flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-display font-800 text-surface-900 dark:text-surface-50">{user?.name}</h2>
            <p className="text-sm text-surface-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-green text-[10px]">
                <Sparkles className="w-2.5 h-2.5" /> {user?.role || 'USER'}
              </span>
              {user?.targetRole && (
                <span className="badge-blue text-[10px]">
                  <Target className="w-2.5 h-2.5" /> {user.targetRole}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-display font-700 text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-500" /> Profile Information
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 chars' } })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Current Role</label>
              <select className="input-field" {...register('currentRole')}>
                <option value="">Select your current role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target Role</label>
              <select className="input-field" {...register('targetRole')}>
                <option value="">What do you want to become?</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Years of Experience</label>
            <select className="input-field" {...register('yearsExperience', { valueAsNumber: true })}>
              <option value="">Select experience level</option>
              {[0,1,2,3,4,5,6,7,8,10,12,15,20].map(y => (
                <option key={y} value={y}>
                  {y === 0 ? 'Fresher / Student' : `${y}+ years`}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              loading={saving}
              disabled={!isDirty && !saving}
              icon={saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              className="w-full justify-center py-3"
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-display font-700 text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" /> Account & Security
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-dark-200 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-surface-500" />
              </div>
              <div>
                <div className="text-xs font-display font-700 text-surface-700 dark:text-surface-300">Email Address</div>
                <div className="text-xs text-surface-500">{user?.email}</div>
              </div>
            </div>
            <span className="badge-green text-[10px]">Verified</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-dark-200 flex items-center justify-center">
                <Key className="w-3.5 h-3.5 text-surface-500" />
              </div>
              <div>
                <div className="text-xs font-display font-700 text-surface-700 dark:text-surface-300">Password</div>
                <div className="text-xs text-surface-500">••••••••••</div>
              </div>
            </div>
            <button className="btn-ghost text-xs py-1.5 px-3">Change</button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-dark-200 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-surface-500" />
              </div>
              <div>
                <div className="text-xs font-display font-700 text-surface-700 dark:text-surface-300">Account Role</div>
                <div className="text-xs text-surface-500">{user?.role || 'USER'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6 border-red-200 dark:border-red-900/40">
        <h3 className="font-display font-700 text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Session
        </h3>
        <p className="text-xs text-surface-500 mb-3">
          Signing out will remove your session from this device. Your data is safely stored.
        </p>
        <Button variant="danger" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
          Sign Out
        </Button>
      </motion.div>
    </div>
  )
}
