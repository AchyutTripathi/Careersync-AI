import { useState, useEffect, useCallback, useRef } from 'react'

// ─── useAsync ─────────────────────────────────────────────────────────────────
export function useAsync(asyncFn, immediate = false) {
  const [status, setStatus] = useState('idle')
  const [data,   setData]   = useState(null)
  const [error,  setError]  = useState(null)

  const execute = useCallback(async (...args) => {
    setStatus('pending')
    setError(null)
    try {
      const result = await asyncFn(...args)
      setData(result?.data?.data ?? result?.data ?? result)
      setStatus('success')
      return result
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
      setStatus('error')
      throw e
    }
  }, [asyncFn])

  useEffect(() => {
    if (immediate) execute()
  }, []) // eslint-disable-line

  return { execute, status, data, error,
    loading: status === 'pending',
    success: status === 'success',
  }
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch { return initial }
  })

  const set = useCallback((v) => {
    const next = v instanceof Function ? v(value) : v
    setValue(next)
    localStorage.setItem(key, JSON.stringify(next))
  }, [key, value])

  return [value, set]
}

// ─── useDebounce ─────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ─── useCopyToClipboard ───────────────────────────────────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])
  return { copied, copy }
}

// ─── useOutsideClick ─────────────────────────────────────────────────────────
export function useOutsideClick(handler) {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])
  return ref
}
