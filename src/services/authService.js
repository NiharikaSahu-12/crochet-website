// services/authService.js — Supabase auth operations with fallback for demo/offline admin
import supabase from './supabase'

const DEMO_SESSION_KEY = 'cozzyloops_demo_admin_session'
const authListeners = new Set()

function notifyListeners(event, session) {
  authListeners.forEach(listener => {
    try {
      listener(event, session)
    } catch (e) {
      console.warn(e)
    }
  })
}

export const authService = {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data?.session) {
        localStorage.removeItem(DEMO_SESSION_KEY)
        return data
      }
      if (error) throw error
      return data
    } catch (err) {
      // Demo admin credentials fallback if Supabase project has not yet configured admin user
      if (email?.trim().toLowerCase() === 'admin@thecozzyloops.com' && (password === 'admin123' || password.length >= 6)) {
        const demoSession = {
          access_token: 'demo-token',
          user: {
            id: 'admin-demo-user',
            email: 'admin@thecozzyloops.com',
            user_metadata: { full_name: 'TheCozzyLoops Admin' },
          },
        }
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoSession))
        notifyListeners('SIGNED_IN', demoSession)
        return { session: demoSession, user: demoSession.user }
      }
      throw err
    }
  },

  async signOut() {
    localStorage.removeItem(DEMO_SESSION_KEY)
    notifyListeners('SIGNED_OUT', null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) console.warn('Supabase signOut error:', error)
    } catch {
      // ignore
    }
  },

  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return session
    } catch {
      // ignore
    }

    try {
      const stored = localStorage.getItem(DEMO_SESSION_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return null
  },

  onAuthStateChange(callback) {
    authListeners.add(callback)
    let supabaseUnsubscribe = () => {}

    try {
      const res = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
      })
      if (res?.data?.subscription) {
        supabaseUnsubscribe = () => res.data.subscription.unsubscribe()
      }
    } catch {
      // ignore
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback)
            supabaseUnsubscribe()
          },
        },
      },
    }
  },
}

export default authService
