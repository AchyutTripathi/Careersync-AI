import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Plus, Trash2, Sparkles, Bot, User } from 'lucide-react'
import { chatService } from '../services'
import { useAuth } from '../context/AuthContext'
import { timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const STARTERS = [
  'How do I prepare for a system design interview?',
  'What skills should I learn for backend engineering in 2024?',
  'How do I negotiate a higher salary offer?',
  'Can you review my career path and suggest improvements?',
  'What are the best resources to learn Kubernetes?',
  'How do I transition from frontend to full-stack?',
]

function MessageBubble({ msg, userName }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-700
        ${isUser
          ? 'bg-brand-500 text-white shadow-glow-green'
          : 'bg-surface-100 dark:bg-dark-50 text-surface-600 dark:text-surface-400'
        }`}>
        {isUser ? (userName?.[0]?.toUpperCase() || 'U') : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed
        ${isUser
          ? 'bg-brand-500 text-white rounded-tr-sm'
          : 'bg-white dark:bg-dark-100 border border-surface-100 dark:border-surface-800 text-surface-700 dark:text-surface-300 rounded-tl-sm'
        }`}>
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        {msg.timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-brand-100' : 'text-surface-400'}`}>
            {timeAgo(msg.timestamp)}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function Chatbot() {
  const { user } = useAuth()
  const [sessions,    setSessions]    = useState([])
  const [activeId,    setActiveId]    = useState(null)
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    chatService.getSessions()
      .then(r => setSessions(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingSessions(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSession = async (id) => {
    try {
      const r = await chatService.getSession(id)
      const session = r.data.data
      const msgs = JSON.parse(session.messages || '[]')
      setMessages(msgs)
      setActiveId(id)
    } catch { toast.error('Failed to load session') }
  }

  const newChat = () => {
    setActiveId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  const deleteSession = async (id, e) => {
    e.stopPropagation()
    try {
      await chatService.deleteSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
      if (activeId === id) newChat()
      toast.success('Session deleted')
    } catch {}
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || sending) return
    setInput('')

    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setSending(true)

    try {
      const r = await chatService.send({ message: msg, sessionId: activeId || undefined })
      const result = r.data.data
      const aiMsg  = { role: 'assistant', content: result.aiResponse, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])

      if (!activeId) {
        setActiveId(result.sessionId)
        const newSession = { id: result.sessionId, title: result.sessionTitle, updatedAt: new Date().toISOString() }
        setSessions(prev => [newSession, ...prev])
      } else {
        setSessions(prev => prev.map(s => s.id === activeId ? { ...s, updatedAt: new Date().toISOString() } : s))
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar — sessions list */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <button onClick={newChat} className="btn-primary justify-center w-full py-2.5">
          <Plus className="w-4 h-4" /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
          {loadingSessions ? (
            <div className="space-y-1.5 mt-1">
              {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-surface-400">No conversations yet</div>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-all group
                  ${activeId === s.id
                    ? 'bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/50'
                    : 'hover:bg-surface-100 dark:hover:bg-dark-50'
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-600 truncate ${activeId === s.id ? 'text-brand-700 dark:text-brand-300' : 'text-surface-700 dark:text-surface-300'}`}>
                    {s.title || 'New conversation'}
                  </p>
                  <p className="text-[10px] text-surface-400 mt-0.5">{timeAgo(s.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-surface-400 hover:text-red-500 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-surface-100 dark:border-surface-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center shadow-glow-green">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-display font-700 text-surface-900 dark:text-surface-50">CareerSync AI</div>
            <div className="text-[11px] text-brand-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
              Online · Powered by Gemini
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 pb-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center mx-auto mb-3 shadow-glow-green-lg animate-float">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-700 text-surface-900 dark:text-surface-50 mb-1">
                  Your AI Career Advisor
                </h3>
                <p className="text-sm text-surface-400 max-w-xs">
                  Ask me anything about your career — interviews, skills, salary, transitions, and more.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {STARTERS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left p-3 rounded-xl border border-surface-200 dark:border-surface-800
                               bg-white dark:bg-dark-100 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20
                               text-xs text-surface-600 dark:text-surface-400 hover:text-brand-700 dark:hover:text-brand-300
                               transition-all duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} userName={user?.name} />
          ))}

          {/* Typing indicator */}
          {sending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-surface-100 dark:bg-dark-50 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-surface-400" />
              </div>
              <div className="bg-white dark:bg-dark-100 border border-surface-100 dark:border-surface-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t border-surface-100 dark:border-surface-800/50">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask anything about your career…"
              className="flex-1 input-field resize-none py-2.5 max-h-32"
              style={{ minHeight: 44 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                ${input.trim() && !sending
                  ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-green active:scale-95'
                  : 'bg-surface-100 dark:bg-dark-50 text-surface-400 cursor-not-allowed'
                }`}
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
          <p className="text-[10px] text-surface-400 mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
