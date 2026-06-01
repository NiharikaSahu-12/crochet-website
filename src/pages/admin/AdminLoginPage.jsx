import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Scissors, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await authService.signIn(email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-blush-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-yarn-dark to-blush-900 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yarn-pink to-yarn-blush rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scissors size={28} className="text-white" />
            </div>
            <h1 className="font-display text-3xl text-white">TheCozzyLoops</h1>
            <p className="text-blush-300 mt-1 text-sm">Admin Panel</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={18} className="text-yarn-blush" />
              <h2 className="font-display text-xl text-yarn-dark">Sign In</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yarn-dark mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@thecozzyloops.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yarn-dark mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
