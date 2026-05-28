import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cs_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 401) {
      localStorage.removeItem('cs_token')
      delete api.defaults.headers.common['Authorization']
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    } else if (status === 403) {
      toast.error('You do not have permission to do that.')
    } else if (status === 404) {
      // Let caller handle
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (message && !error.config?._silent) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
