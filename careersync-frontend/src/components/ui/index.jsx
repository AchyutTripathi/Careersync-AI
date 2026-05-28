import { forwardRef } from 'react'
import Spinner from './Spinner'

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', loading, icon, className = '', ...props },
  ref
) {
  const base = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-600 text-sm bg-red-500 hover:bg-red-600 text-white transition-all duration-200 active:scale-95',
  }[variant]

  const sizes = { sm: 'px-3 py-1.5 text-xs', md: '', lg: 'px-6 py-3 text-base' }

  return (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  )
})

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = forwardRef(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={`input-field ${error ? 'border-red-500 focus:ring-red-500/40' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-400 mt-0.5">{hint}</p>}
    </div>
  )
})

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  { label, error, rows = 4, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="label">{label}</label>}
      <textarea ref={ref} rows={rows} className={`input-field resize-none ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
})

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = forwardRef(function Select(
  { label, error, children, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="label">{label}</label>}
      <select ref={ref} className={`input-field ${error ? 'border-red-500' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
})

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'green', className = '' }) {
  return <span className={`badge-${variant} ${className}`}>{children}</span>
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative w-full ${widths[size]} card p-6 animate-scale-in max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-display font-700 text-surface-900 dark:text-surface-50">{title}</h3>
            <button onClick={onClose} className="btn-ghost !px-2 !py-1 text-lg leading-none">×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-4 opacity-40">{icon}</div>}
      <h3 className="text-base font-display font-600 text-surface-700 dark:text-surface-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-400 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ─── SkeletonCard ────────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  )
}

// ─── ScoreRing ────────────────────────────────────────────────────────────────
export function ScoreRing({ score = 0, size = 80, strokeWidth = 6 }) {
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score >= 80 ? '#14b46a' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} className="text-surface-200 dark:text-surface-800" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className="absolute text-lg font-display font-700" style={{ color }}>{score}</span>
    </div>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color = 'brand', label, showValue = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    brand: 'from-brand-500 to-brand-400',
    amber: 'from-amber-500 to-amber-400',
    red:   'from-red-500 to-red-400',
    blue:  'from-blue-500 to-blue-400',
  }
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs font-500 text-surface-600 dark:text-surface-400">{label}</span>}
          {showValue && <span className="text-xs font-600 text-surface-700 dark:text-surface-300">{pct}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className={`progress-fill bg-gradient-to-r ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── AiStreamBox ─────────────────────────────────────────────────────────────
export function AiResultBox({ content, loading, placeholder = 'AI result will appear here...' }) {
  return (
    <div className="card p-5 min-h-[120px]">
      {loading ? (
        <div className="space-y-2.5">
          {[100, 85, 90, 60].map((w, i) => (
            <div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : content ? (
        <div className="ai-response">{content}</div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-surface-600 italic">{placeholder}</p>
      )}
    </div>
  )
}
