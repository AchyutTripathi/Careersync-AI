import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Kanban, Plus, Pencil, Trash2, ExternalLink,
  Calendar, Building2, Briefcase, Filter
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { jobTrackerService } from '../services'
import { Button, Modal, EmptyState, Badge } from '../components/ui'
import { formatDate, toTitleCase, STATUS_COLORS } from '../utils/helpers'
import toast from 'react-hot-toast'

const STATUSES = ['WISHLIST','APPLIED','PHONE_SCREEN','INTERVIEW','OFFER','ACCEPTED','REJECTED','WITHDRAWN']

const STATUS_BADGE = {
  WISHLIST:     'blue',
  APPLIED:      'amber',
  PHONE_SCREEN: 'purple',
  INTERVIEW:    'purple',
  OFFER:        'green',
  ACCEPTED:     'green',
  REJECTED:     'red',
  WITHDRAWN:    'red',
}

function AppForm({ initial, onSave, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initial || { status: 'APPLIED' }
  })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try { await onSave(data) }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="label">Company *</label>
          <input placeholder="Google" className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
            {...register('companyName', { required: 'Company required' })} />
          {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="label">Role *</label>
          <input placeholder="Software Engineer" className={`input-field ${errors.role ? 'border-red-500' : ''}`}
            {...register('role', { required: 'Role required' })} />
          {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input-field" {...register('status')}>
            {STATUSES.map(s => <option key={s} value={s}>{toTitleCase(s)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Applied Date</label>
          <input type="date" className="input-field" {...register('appliedDate')} />
        </div>
        <div>
          <label className="label">Interview Date</label>
          <input type="date" className="input-field" {...register('interviewDate')} />
        </div>
        <div>
          <label className="label">Salary Range</label>
          <input placeholder="$120K – $160K" className="input-field" {...register('salaryRange')} />
        </div>
        <div className="col-span-2">
          <label className="label">Job URL</label>
          <input type="url" placeholder="https://…" className="input-field" {...register('jobUrl')} />
        </div>
        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea rows={3} placeholder="Recruiter name, referral, anything relevant…"
            className="input-field resize-none" {...register('notes')} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        <Button type="submit" loading={saving} className="flex-1 justify-center">
          {initial ? 'Save Changes' : 'Add Application'}
        </Button>
      </div>
    </form>
  )
}

export default function JobTracker() {
  const [apps,      setApps]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [filter,    setFilter]    = useState('ALL')

  const load = async () => {
    setLoading(true)
    try { const r = await jobTrackerService.getAll(); setApps(r.data.data || []) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data) => {
    try {
      const r = await jobTrackerService.create(data)
      setApps(prev => [r.data.data, ...prev])
      setShowModal(false)
      toast.success('Application added!')
    } catch {}
  }

  const handleUpdate = async (data) => {
    try {
      const r = await jobTrackerService.update(editing.id, data)
      setApps(prev => prev.map(a => a.id === editing.id ? r.data.data : a))
      setEditing(null)
      toast.success('Updated!')
    } catch {}
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    try {
      await jobTrackerService.delete(id)
      setApps(prev => prev.filter(a => a.id !== id))
      toast.success('Deleted')
    } catch {}
  }

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  // Status counts for filter pills
  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc }, {})

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Kanban className="w-5 h-5 text-blue-500" /> Job Tracker
          </h1>
          <p className="section-subtitle">{apps.length} applications tracked</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Application
        </Button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all
            ${filter === 'ALL' ? 'bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-900' : 'btn-ghost'}`}
        >
          All ({apps.length})
        </button>
        {STATUSES.filter(s => counts[s]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all
              ${filter === s ? 'bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-900' : 'btn-ghost'}`}
          >
            {toTitleCase(s)} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-4 space-y-2">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title={filter === 'ALL' ? 'No applications yet' : `No ${toTitleCase(filter)} applications`}
          description={filter === 'ALL' ? "Track every job you apply to — from wishlist to offer." : undefined}
          action={filter === 'ALL' ? <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Add First Application</Button> : undefined}
        />
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence>
            {filtered.map(app => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-4 flex items-center gap-4"
              >
                {/* Company initial */}
                <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-200 flex items-center justify-center text-surface-600 dark:text-surface-400 font-display font-700 text-sm flex-shrink-0">
                  {app.companyName?.[0]?.toUpperCase()}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-display font-700 text-surface-900 dark:text-surface-50 truncate">
                      {app.companyName}
                    </span>
                    <Badge variant={STATUS_BADGE[app.status] || 'blue'}>
                      {toTitleCase(app.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {app.role}
                    </span>
                    {app.appliedDate && (
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(app.appliedDate)}
                      </span>
                    )}
                    {app.salaryRange && (
                      <span className="text-xs text-surface-400">{app.salaryRange}</span>
                    )}
                  </div>
                  {app.notes && (
                    <p className="text-[11px] text-surface-400 mt-1 truncate">{app.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50 text-surface-400 transition-all"
                      onClick={e => e.stopPropagation()}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => setEditing(app)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50 text-surface-400 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(app.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-surface-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Job Application" size="lg">
        <AppForm onSave={handleCreate} onClose={() => setShowModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Application" size="lg">
        {editing && <AppForm initial={editing} onSave={handleUpdate} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
