import api from './api'

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  login:    (data)    => api.post('/auth/login', data),
  register: (data)    => api.post('/auth/register', data),
  me:       ()        => api.get('/auth/me'),
  update:   (data)    => api.put('/auth/profile', data),
}

// ─── Resume ───────────────────────────────────────────────────────────────────
export const resumeService = {
  upload:  (file)      => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/resume/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  analyze: (id)        => api.post(`/resume/${id}/analyze`),
  getAll:  ()          => api.get('/resume/all'),
  getById: (id)        => api.get(`/resume/${id}`),
  delete:  (id)        => api.delete(`/resume/${id}`),
  latest:  ()          => api.get('/resume/latest'),
}

// ─── JD Matcher ───────────────────────────────────────────────────────────────
export const jdService = {
  match: (data) => api.post('/jd/match', data),
}

// ─── Cover Letter ─────────────────────────────────────────────────────────────
export const coverLetterService = {
  generate: (data) => api.post('/cover-letter/generate', data),
}

// ─── Skill Analysis ───────────────────────────────────────────────────────────
export const skillService = {
  analyze: (data) => api.post('/skill-gap/analyze', data),
  getAll:  ()     => api.get('/skill-gap/all'),
  getById: (id)   => api.get(`/skill-gap/${id}`),
  latest:  ()     => api.get('/skill-gap/latest'),
}

// ─── Interview ────────────────────────────────────────────────────────────────
export const interviewService = {
  generate:   (data) => api.post('/interview/generate', data),
  feedback:   (data) => api.post('/interview/feedback', data),
  getAll:     ()     => api.get('/interview/all'),
  getById:    (id)   => api.get(`/interview/${id}`),
  delete:     (id)   => api.delete(`/interview/${id}`),
}

// ─── Career Roadmap ───────────────────────────────────────────────────────────
export const roadmapService = {
  generate: (data) => api.post('/roadmap/generate', data),
  getAll:   ()     => api.get('/roadmap/all'),
  getById:  (id)   => api.get(`/roadmap/${id}`),
  latest:   ()     => api.get('/roadmap/latest'),
}

// ─── Job Tracker ──────────────────────────────────────────────────────────────
export const jobTrackerService = {
  getAll:   ()            => api.get('/jobs/all'),
  create:   (data)        => api.post('/jobs/create', data),
  update:   (id, data)    => api.put(`/jobs/${id}`, data),
  delete:   (id)          => api.delete(`/jobs/${id}`),
  getStats: ()            => api.get('/jobs/stats'),
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
export const chatService = {
  send:      (data) => api.post('/chat/send', data),
  getSessions: ()   => api.get('/chat/sessions'),
  getSession: (id)  => api.get(`/chat/session/${id}`),
  deleteSession:(id)=> api.delete(`/chat/session/${id}`),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  stats: () => api.get('/dashboard/stats'),
}
