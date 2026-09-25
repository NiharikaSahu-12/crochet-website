import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@thecozzyloops.com')
  const [password, setPassword] = useState('admin123')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await authService.signIn(email, password)
      toast.success('Welcome to Atelier Management')
      navigate('/admin')
    } catch {
      toast.error('Invalid admin credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 selection:bg-terracotta-100 selection:text-terracotta-900">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Atelier Storefront</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl border border-canvas-border shadow-lifted overflow-hidden">
        {/* Header */}
        <div className="bg-ink px-8 py-10 text-center text-white relative">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500/20 border border-terracotta-400/30 flex items-center justify-center mx-auto mb-3.5 text-terracotta-400 shadow-xs">
            <Sparkles size={22} />
          </div>
          <h1 className="font-editorial text-2xl font-semibold tracking-tight text-white">TheCozzyLoops</h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-terracotta-300 mt-1">
            Atelier Portal Management
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-xs"
                placeholder="admin@thecozzyloops.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10 text-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink p-1"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-canvas-subtle rounded-xl border border-canvas-border text-[11px] text-ink-subtle flex items-start gap-2">
              <ShieldCheck size={14} className="text-terracotta-600 shrink-0 mt-0.5" />
              <span>Demo credentials pre-filled for immediate testing of products & categories.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary text-xs py-3.5 shadow-subtle flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Atelier Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
