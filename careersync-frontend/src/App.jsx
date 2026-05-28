import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

// Public pages
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'

// Protected pages
import Dashboard     from './pages/Dashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import JDMatcher     from './pages/JDMatcher'
import CoverLetter   from './pages/CoverLetter'
import SkillGap      from './pages/SkillGap'
import MockInterview from './pages/MockInterview'
import CareerRoadmap from './pages/CareerRoadmap'
import JobTracker    from './pages/JobTracker'
import Chatbot       from './pages/Chatbot'
import Profile       from './pages/Profile'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected — all share AppLayout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/resume"       element={<ResumeAnalyzer />} />
              <Route path="/jd-matcher"   element={<JDMatcher />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/skill-gap"    element={<SkillGap />} />
              <Route path="/interview"    element={<MockInterview />} />
              <Route path="/roadmap"      element={<CareerRoadmap />} />
              <Route path="/job-tracker"  element={<JobTracker />} />
              <Route path="/chatbot"      element={<Chatbot />} />
              <Route path="/profile"      element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: '#f0fdf6',
                color: '#166534',
                border: '1px solid #bbf7d0',
              },
              iconTheme: { primary: '#14b46a', secondary: '#fff' },
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}
