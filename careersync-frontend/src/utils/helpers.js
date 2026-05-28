// ─── Date helpers ─────────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hrs   = Math.floor(mins / 60)
  const days  = Math.floor(hrs / 24)
  if (days > 0)  return `${days}d ago`
  if (hrs > 0)   return `${hrs}h ago`
  if (mins > 0)  return `${mins}m ago`
  return 'just now'
}

// ─── String helpers ───────────────────────────────────────────────────────────
export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const toTitleCase = (str = '') =>
  str.replace(/_/g, ' ').replace(/\w\S*/g, capitalize)

// ─── Score helpers ────────────────────────────────────────────────────────────
export const scoreColor = (score) => {
  if (score >= 80) return 'text-brand-500'
  if (score >= 60) return 'text-amber-500'
  return 'text-red-500'
}

export const scoreBg = (score) => {
  if (score >= 80) return 'bg-brand-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export const scoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}

// ─── Status color map ────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  WISHLIST:    'badge-blue',
  APPLIED:     'badge-amber',
  PHONE_SCREEN:'badge-purple',
  INTERVIEW:   'badge-purple',
  OFFER:       'badge-green',
  ACCEPTED:    'badge-green',
  REJECTED:    'badge-red',
  WITHDRAWN:   'badge-red',
}

// ─── Parse JSON safely ────────────────────────────────────────────────────────
export const safeJson = (str, fallback = null) => {
  try { return JSON.parse(str) } catch { return fallback }
}

// ─── File validation ─────────────────────────────────────────────────────────
export const validatePDF = (file) => {
  if (!file) return 'No file selected'
  if (file.type !== 'application/pdf') return 'Only PDF files are accepted'
  if (file.size > 10 * 1024 * 1024) return 'File must be under 10 MB'
  return null
}

// ─── Split AI text into array of items ───────────────────────────────────────
// Safely handles null, undefined, numbers — always returns an array
export const splitLines = (str) => {
  if (str === null || str === undefined) return []
  return String(str)
    .split('\n')
    .map(s => s.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter(Boolean)
}