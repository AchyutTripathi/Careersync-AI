import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('cs_token'))
  const [loading, setLoading] = useState(true)

  const applyToken = useCallback((t) => {
    if (t) {
      localStorage.setItem('cs_token', t)
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      localStorage.removeItem('cs_token')
      delete api.defaults.headers.common['Authorization']
    }
    setToken(t)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('cs_token')
    if (saved) {
      api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
      api.get('/auth/me')
        .then(r => setUser(r.data.data))
        .catch(() => applyToken(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [applyToken])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    applyToken(r.data.data.token)
    setUser(r.data.data.user)
    return r.data
  }

  const register = async (name, email, password) => {
    const r = await api.post('/auth/register', { name, email, password })
    applyToken(r.data.data.token)
    setUser(r.data.data.user)
    return r.data
  }

  const logout = () => {
    applyToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
